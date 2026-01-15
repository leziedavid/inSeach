// AnnonceForm.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { X, Upload, MapPin, Home, Users, Bed, Star, CheckCircle, Search, Plus, Building, Hotel, Castle, Building2, Mountain, Calendar, Navigation, Globe, Map, Loader2, Info } from "lucide-react";
import { Annonce, Amenity, User, categoriesAnnonce, UserLocation, AnnonceType } from "@/types/interfaces";
import { toast } from "sonner";
import { availableAmenities, LiestcategoriesAnnonce } from "@/data/fakeAnnonce";
import { GeoLocationResult, getUserLocation } from "@/utils/geolocation";
import { listCategories } from "@/services/CategoryAnnonceServices";
import { getAllAmenities } from "@/services/annonceAmenityService";
import { listAnnonceTypes } from "@/services/annonceTypeService";

// ================= VALIDATION ZOD =================
const annonceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(10, "Le titre doit contenir au moins 10 caractères").max(200, "Le titre est trop long"),
    // Category - accepter aussi des valeurs vides temporairement
    category: z.object({ id: z.string(), value: z.string(), label: z.string(), certifiedAt: z.string().optional().nullable(), }).optional(),
    categoryId: z.string().min(1, "La catégorie est requise"),
    location: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    price: z.number().min(1, "Le prix doit être supérieur à 0"),
    capacity: z.number().int().min(1, "La capacité doit être d'au moins 1 personne"),
    rooms: z.number().int().min(0, "Le nombre de pièces ne peut pas être négatif"),
    beds: z.number().int().min(0, "Le nombre de lits ne peut pas être négatif"),
    description: z.string().min(50, "La description doit contenir au moins 50 caractères"),

    certifiedAt: z.string().optional().nullable(),
    pinned: z.boolean().optional().default(false),
    providerId: z.string().optional(),

    // GPS Location - tous les champs optionnels
    gpsLocation: z.object({
        lat: z.number().nullable().optional(),
        lng: z.number().nullable().optional(),
        country: z.string().nullable().optional(),
        city: z.string().nullable().optional(),
        district: z.string().nullable().optional(),
        street: z.string().nullable().optional(),
    }).optional().nullable(),

    // Amenities - accepter tableau vide
    amenities: z.array(  z.object({ id: z.string(), label: z.string(), icon: z.string().nullable().optional(), }) ).optional().default([]),
    //AnnonceType - accepter tableau vide
    typeId: z.string().min(1, "La catégorie est requise"),
    type: z.object({ id: z.string(), label: z.string(), description: z.string().nullable(), }).optional().nullable(),
    // Images - accepter tableau vide en développement
    images: z.array(z.string()).min(1, "Au moins une image est requise").max(20, "Maximum 20 images autorisées"),
});

// ================= TYPES =================
// Utilise le type Annonce directement depuis tes interfaces
type AnnonceFormValues = Omit<Annonce, 'id' | 'provider'> & {
    id?: string;
    providerId?: string;
    gpsLocation?: UserLocation | null;
};

interface AnnonceFormProps {
    initialData?: Partial<Annonce>;
    onClose: () => void;
    user: User | null;
    fetchAll: () => Promise<void>;
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting?: boolean;
}

// ================= COMPOSANT PRINCIPAL =================
export default function AnnonceForm({ initialData, onClose, user, fetchAll, onSubmit, isSubmitting = false }: AnnonceFormProps) {

    const router = useRouter();
    // ================= STATES =================
    const [images, setImages] = useState<string[]>(initialData?.images || []);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [liesAmenity, setLiesAmenity] = useState<Amenity[]>(availableAmenities);
    const [liesCategories, setLiesCategories] = useState<categoriesAnnonce[]>(LiestcategoriesAnnonce);
    const [liesTypes, setLiesTypes] = useState<AnnonceType[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>(initialData?.amenities || []);
    const [selectedCategory, setSelectedCategory] = useState<categoriesAnnonce | null>(initialData?.category || (liesCategories.length > 0 ? liesCategories[0] : null));
    const [selectedType, setSelectedType] = useState<AnnonceType | null>(initialData?.type || null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchAmenities, setSearchAmenities] = useState("");
    const [gpsLocation, setGpsLocation] = useState<GeoLocationResult | null>(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [locationDisplay, setLocationDisplay] = useState<string>("Localisation non définie");

    // ================= FORM SETUP AVEC TYPAGE CORRECT =================
    const form = useForm<AnnonceFormValues>({
        resolver: zodResolver(annonceSchema) as any,
        defaultValues: {
            id: initialData?.id,
            title: initialData?.title || "",
            category: initialData?.category || (liesCategories.length > 0 ? liesCategories[0] : { id: "", value: "", label: "Appartement", certifiedAt: undefined }),
            categoryId: initialData?.categoryId || (liesCategories.length > 0 ? liesCategories[0].id : ""),
            location: initialData?.location || "",
            price: initialData?.price || 0,
            rating: initialData?.rating || 0,
            capacity: initialData?.capacity || 1,
            rooms: initialData?.rooms || 1,
            beds: initialData?.beds || 1,
            description: initialData?.description || "",
            certifiedAt: initialData?.certifiedAt || new Date().toISOString().split('T')[0],
            pinned: initialData?.pinned || false,
            providerId: initialData?.providerId || user?.id,
            gpsLocation: initialData?.gpsLocation ? {
                lat: initialData.gpsLocation.lat || null,
                lng: initialData.gpsLocation.lng || null,
                country: initialData.gpsLocation.country || null,
                city: initialData.gpsLocation.city || null,
                district: initialData.gpsLocation.district || null,
                street: initialData.gpsLocation.street || null,
            } : undefined,
            amenities: initialData?.amenities || [],
            typeId: initialData?.typeId || "",
            type: initialData?.type || undefined,
            images: initialData?.images || [],
            review: initialData?.review,
        } as AnnonceFormValues,
    });

    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

    // ================= MEMOIZED VALUES =================
    const filteredAmenities = useMemo(() =>
        liesAmenity.filter(amenity => amenity.label.toLowerCase().includes(searchAmenities.toLowerCase())),
        [liesAmenity, searchAmenities]
    );

    const watchedPrice = watch("price");
    const watchedDescription = watch("description");

    // ================= CALLBACKS =================
    const fetchInitialData = useCallback(async () => {

        setIsLoading(true);
        // nous allons aller chcher les  liesCategories et les liesAmenity
        const responseCategories = await listCategories();
        if (responseCategories.statusCode === 200 && responseCategories.data) {
            setLiesCategories(responseCategories.data);
            setIsLoading(false);
        }

        const responseAmenities = await getAllAmenities();
        if (responseAmenities.statusCode === 200 && responseAmenities.data) {
            setLiesAmenity(responseAmenities.data);
            setIsLoading(false);
        }

        const responseTypes = await listAnnonceTypes();
        if (responseTypes.statusCode === 200 && responseTypes.data) {
            setLiesTypes(responseTypes.data);
            setIsLoading(false);
        }

    }, []);

    const updateLocationDisplay = useCallback((locationData: GeoLocationResult) => {
        const displayParts = [];
        if (locationData.city) displayParts.push(locationData.city);
        if (locationData.district) displayParts.push(locationData.district);
        if (locationData.street) displayParts.push(locationData.street);

        const displayText = displayParts.length > 0
            ? displayParts.join(", ")
            : locationData.lat && locationData.lng
                ? `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(6)}`
                : "Localisation non définie";

        setLocationDisplay(displayText);
    }, []);

    const fetchUserLocation = useCallback(async () => {
        setIsFetchingLocation(true);
        try {
            const locationData = await getUserLocation({
                onPermissionDenied: () => {
                    toast.error("Permission de localisation refusée. Veuillez l'autoriser dans les paramètres de votre navigateur.");
                }
            });

            if (locationData.error) {
                toast.error(`Erreur de localisation: ${locationData.error}`);
                return;
            }

            if (locationData.lat && locationData.lng) {
                setGpsLocation(locationData);

                setValue("gpsLocation", {
                    lat: locationData.lat,
                    lng: locationData.lng,
                    country: locationData.country || null,
                    city: locationData.city || null,
                    district: locationData.district || null,
                    street: locationData.street || null,
                }, { shouldValidate: true });

                updateLocationDisplay(locationData);
                toast.success("Position GPS récupérée avec succès");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la localisation:", error);
            toast.error("Erreur lors de la récupération de la localisation");
        } finally {
            setIsFetchingLocation(false);
        }
    }, [setValue, updateLocationDisplay]);

    const handleImageUpload = useCallback((files: FileList) => {
        const filesArray = Array.from(files);
        if (images.length + filesArray.length > 20) {
            toast.error("Vous ne pouvez ajouter que 20 images maximum");
            return;
        }

        const newImages: string[] = [];
        const newFiles: File[] = [];

        filesArray.forEach(file => {
            const imageUrl = URL.createObjectURL(file);
            newImages.push(imageUrl);
            newFiles.push(file);
        });

        setImages(prev => [...prev, ...newImages]);
        setNewImageFiles(prev => [...prev, ...newFiles]);
    }, [images.length]);

    const removeImage = useCallback((index: number) => {
        setImages(prev => {
            const newImages = prev.filter((_, i) => i !== index);
            // Nettoyer l'URL blob pour éviter les fuites mémoire
            if (prev[index].startsWith('blob:')) {
                URL.revokeObjectURL(prev[index]);
            }
            return newImages;
        });
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const toggleAmenity = useCallback((amenity: Amenity) => {
        setSelectedAmenities(prev => {
            const isSelected = prev.some(a => a.id === amenity.id);
            return isSelected
                ? prev.filter(a => a.id !== amenity.id)
                : [...prev, amenity];
        });
    }, []);

    const handleCategoryChange = useCallback((category: categoriesAnnonce) => {
        setSelectedCategory(category);
        setValue("category", category, { shouldValidate: true });
        setValue("categoryId", category.id, { shouldValidate: true });
    }, [setValue]);

    const handleTypeChange = useCallback((type: AnnonceType) => {
        setSelectedType(type);
        setValue("type", type, { shouldValidate: true });
        setValue("typeId", type.id, { shouldValidate: true });
    }, [setValue]);

    const formatPrice = useCallback((price: number): string => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(price);
    }, []);

    // ================= SUBMIT HANDLER AVEC TYPE EXPLICITE =================
    const handleFormSubmit: SubmitHandler<AnnonceFormValues> = useCallback(async (data) => {
        try {
            const formData = new FormData();

            // Champs de base
            if (data.id) formData.append("id", data.id);
            formData.append("title", data.title);
            formData.append("categoryId", data.categoryId); // SEULEMENT ID
            formData.append("location", data.location);
            formData.append("price", data.price.toString());
            formData.append("capacity", data.capacity.toString());
            formData.append("rooms", data.rooms.toString());
            formData.append("beds", data.beds.toString());
            formData.append("description", data.description);
            formData.append("pinned", data.pinned ? "true" : "false"); // boolean comme string
            formData.append("typeId", data.typeId);

            // Champs optionnels
            if (data.rating) formData.append("rating", data.rating.toString());
            if (data.certifiedAt) formData.append("certifiedAt", data.certifiedAt);

            // Provider ID
            if (data.providerId) {
                formData.append("providerId", data.providerId);
            } else if (user?.id) {
                formData.append("providerId", user.id);
            }

            // Équipements - ENVOYER SEULEMENT LES IDs
            if (data.amenities && data.amenities.length > 0) {
                // Méthode 1: Tableau d'IDs comme JSON
                // const amenityId = data.amenities.map(amenity => amenity.id);
                // formData.append("amenityId", JSON.stringify(amenityId));

                // Méthode alternative: Tableau FormData
                data.amenities.forEach((amenity, index) => {
                    formData.append("amenityId", amenity.id);
                });
            }

            // Localisation GPS - ENVOYER COMME JSON
            if (data.gpsLocation) {
                const gpsData = {
                    lat: Number(data.gpsLocation.lat),
                    lng: Number(data.gpsLocation.lng),
                    country: data.gpsLocation.country || "",
                    city: data.gpsLocation.city || "",
                    district: data.gpsLocation.district || "",
                    street: data.gpsLocation.street || ""
                };
                formData.append("gpsLocation", JSON.stringify(gpsData));
            }

            // Review - ENVOYER COMME JSON
            if (data.review) {
                const reviewData = {
                    author: data.review.author,
                    rating: parseInt(data.review.rating.toString()),
                    comment: data.review.comment || ""
                };
                formData.append("review", JSON.stringify(reviewData));
            }

            // Images - AJOUTER LES NOUVELLES IMAGES
            newImageFiles.forEach(file => {
                formData.append("images", file); // Nom simple "images"
            });

            // Images existantes
            const existingImages = images.filter(image => !image.startsWith('blob:'));
            if (existingImages.length > 0) {
                // Envoyer comme JSON array
                formData.append("existingImages", JSON.stringify(existingImages));
            }

            await onSubmit(formData);
            await fetchAll();
            toast.success(initialData?.id ? "Annonce mise à jour avec succès" : "Annonce créée avec succès");
            onClose();
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            toast.error("Erreur lors de la soumission du formulaire");
        }
    }, [newImageFiles, images, initialData?.id, user?.id, onSubmit, fetchAll, onClose]);


    // ================= EFFETS =================
    useEffect(() => {
        // Initialiser la localisation
        if (user?.location) {
            const userLoc = user.location;
            if (userLoc.lat && userLoc.lng) {
                const locationData: GeoLocationResult = {
                    lat: userLoc.lat,
                    lng: userLoc.lng,
                    country: userLoc.country || null,
                    city: userLoc.city || null,
                    district: userLoc.district || null,
                    street: userLoc.street || null,
                    source: 'gps'
                };

                setGpsLocation(locationData);
                setValue("gpsLocation", {
                    lat: userLoc.lat,
                    lng: userLoc.lng,
                    country: userLoc.country || null,
                    city: userLoc.city || null,
                    district: userLoc.district || null,
                    street: userLoc.street || null,
                }, { shouldValidate: true });

                updateLocationDisplay(locationData);
            }
        } else {
            fetchUserLocation();
        }

        fetchInitialData();
    }, [user, setValue, updateLocationDisplay, fetchUserLocation, fetchInitialData]);

    useEffect(() => {
        if (images.length > 0) {
            setValue("images", images, { shouldValidate: true });
        }
    }, [images, setValue]);

    useEffect(() => {
        // Toujours mettre à jour, même si vide
        setValue("amenities", selectedAmenities, { shouldValidate: true });
    }, [selectedAmenities, setValue]);

    // Nettoyage des URLs blob au démontage du composant
    useEffect(() => {
        return () => {
            images.forEach(image => {
                if (image.startsWith('blob:')) {
                    URL.revokeObjectURL(image);
                }
            });
        };
    }, [images]);


    // Avant le return, ajoutez :
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error("Erreurs de validation:", errors);
            toast.error("Veuillez corriger les erreurs du formulaire");
        }
    }, [errors]);

    // ================= RENDER =================
    return (

        <div className="">

            {/* Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-900">
                    {initialData?.id ? "Modifier l'annonce" : "Créer une nouvelle annonce"}
                </h1>
                <p className="text-gray-600 mt-1">
                    {initialData?.id
                        ? "Modifiez les informations de votre annonce"
                        : "Remplissez le formulaire pour publier votre annonce"}
                </p>
            </div>

            {/* Contenu avec scroll */}
            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                        {/* Section Utilisateur */}
                        {user && (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <span className="font-semibold text-blue-600">
                                            {user.name?.charAt(0) || "U"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {initialData?.id ? "Modification d'annonce" : "Création d'annonce"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Images Section */}
                        <div className="bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    Photos de l'annonce
                                </h2>
                                <span className="text-sm text-gray-500">
                                    {images.length}/20 photos
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">

                                {/* Upload Button */}
                                <label className={` relative w-full aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors overflow-hidden ${images.length >= 20 ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-100" : "border-gray-300 hover:border-blue-500 cursor-pointer bg-gray-50"} `}  >
                                    <Upload className="w-7 h-7 text-gray-400 mb-1" />
                                    <span className="text-xs text-gray-600">Ajouter</span>
                                    <span className="text-[10px] text-gray-400">JPG, PNG</span>
                                    <input type="file" accept="image/*" multiple disabled={images.length >= 20} onChange={(e) => e.target.files && handleImageUpload(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                                </label>

                                {/* Image Preview */}
                                {images.map((image, index) => (
                                    <div key={`${image}-${index}`} className="relative w-full aspect-square rounded-lg overflow-hidden group bg-gray-100"  >
                                        <Image src={image.startsWith("blob:") ? image : image} alt={`Annonce ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" unoptimized />

                                        {/* Bouton supprimer */}
                                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" aria-label={`Supprimer l'image ${index + 1}`} >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Overlay bas */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] p-2">
                                            Photo {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {errors.images && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <X className="w-4 h-4" />
                                    {errors.images.message}
                                </p>
                            )}
                        </div>

                        {/* Informations de base */}
                        <div className="bg-white space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Home className="w-5 h-5" />
                                Informations de base
                            </h2>

                            {/* Titre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre de l'annonce *
                                </label>
                                <input type="text"     {...register("title")} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: Appartement moderne avec vue sur mer" />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie *
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {liesCategories.map((cat) => (
                                        <button key={cat.id} type="button" onClick={() => handleCategoryChange(cat)} className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${selectedCategory?.id === cat.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}  >
                                            <span className="text-sm font-medium">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                                {errors.category && (
                                    <p className="text-red-500 text-sm mt-1">{errors.category.message?.toString()}</p>
                                )}
                                {errors.categoryId && (
                                    <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                                )}
                            </div>

                            {/* Type d'annonce */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type d'annonce *
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {liesTypes.map((type) => (
                                            <button key={type.id} type="button" onClick={() => handleTypeChange(type)}
                                                className={`  flex items-center justify-center text-center  h-10 w-full px-2 text-xs font-medium rounded-md border transition truncate ${selectedType?.id === type.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'} `}
                                                title={type.label} >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>

                                {errors.type && (
                                    <p className="text-red-500 text-sm mt-1">{errors.type.message?.toString()}</p>
                                )}
                                {errors.typeId && (
                                    <p className="text      -red-500 text-sm mt-1">{errors.typeId.message}</p>
                                )}
                            </div>


                            {/* Badge info - Aide sur le type d'annonce */}
                            <div className="mt-4 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                                <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600" />

                                <ul className="space-y-1">
                                    <li>
                                        <strong>1.</strong> Le type d’annonce définit la <strong>nature de votre publication</strong>
                                        (vente, location, publicité, réservation, etc.).
                                    </li>
                                    <li>
                                        <strong>2.</strong> Ce choix détermine les <strong>champs affichés</strong> et la
                                        <strong> visibilité</strong> de votre annonce sur la plateforme.
                                    </li>
                                    <li>
                                        <strong>3.</strong> Sélectionnez le type qui correspond exactement à
                                        <strong> l’objectif principal</strong> de votre annonce.
                                    </li>
                                </ul>
                            </div>


                            {/* Localisation */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse *
                                </label>
                                <div className="flex gap-2">
                                    <input type="text"   {...register("location")} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: 123 Boulevard de la République, Abidjan" />
                                    <button type="button" onClick={fetchUserLocation} disabled={isFetchingLocation} className="px-4 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"  >
                                        {isFetchingLocation ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Navigation className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {gpsLocation && (
                                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        GPS: {locationDisplay}
                                    </p>
                                )}
                                {errors.location && (
                                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                                )}
                            </div>

                            {/* Prix */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prix par J / Nuit (XOF) *
                                </label>
                                <input type="number"   {...register("price", { valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: 50000" min="0" />
                                {watchedPrice > 0 && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {formatPrice(watchedPrice)}
                                    </p>
                                )}
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                )}
                            </div>

                            {/* Capacité, Chambres, Lits */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Users className="w-4 h-4 inline mr-1" />
                                        Capacité *
                                    </label>
                                    <input
                                        type="number"
                                        {...register("capacity", { valueAsNumber: true })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="1"
                                    />
                                    {errors.capacity && (
                                        <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Home className="w-4 h-4 inline mr-1" />
                                        Chambres *
                                    </label>
                                    <input
                                        type="number"
                                        {...register("rooms", { valueAsNumber: true })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                    {errors.rooms && (
                                        <p className="text-red-500 text-xs mt-1">{errors.rooms.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Bed className="w-4 h-4 inline mr-1" />
                                        Lits *
                                    </label>
                                    <input
                                        type="number"
                                        {...register("beds", { valueAsNumber: true })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        min="0"
                                    />
                                    {errors.beds && (
                                        <p className="text-red-500 text-xs mt-1">{errors.beds.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    {...register("description")}
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Décrivez votre bien en détail..."
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                                    )}
                                    <p className="text-sm text-gray-500 ml-auto">
                                        {watchedDescription?.length || 0} caractères
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Équipements */}
                        <div className="bg-white">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Star className="w-5 h-5" />
                                Équipements
                            </h2>

                            {/* Barre de recherche */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={searchAmenities} onChange={(e) => setSearchAmenities(e.target.value)} placeholder="Rechercher un équipement..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>

                            {/* Liste des équipements */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                                {filteredAmenities.map((amenity) => {
                                    const isSelected = selectedAmenities.some(a => a.id === amenity.id);
                                    return (
                                        <button key={amenity.id} type="button" onClick={() => toggleAmenity(amenity)} className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all  ${isSelected ? 'border-brand-primary bg-brand-primary/50 text-brand-secondary' : 'border-gray-200 hover:border-gray-300'} `} >
                                            <Image src={`${amenity.icon}`} alt={amenity.label} width={16} height={16} />
                                            <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-black'}`} >
                                                {amenity.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedAmenities.length > 0 && (
                                <p className="text-sm text-gray-600 mt-4">
                                    {selectedAmenities.length} équipement(s) sélectionné(s)
                                </p>
                            )}
                        </div>

                        {/* Affichage des erreurs globales */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h3 className="text-red-800 font-semibold mb-2 flex items-center gap-2">
                                    <X className="w-5 h-5" />
                                    Erreurs de validation
                                </h3>
                                <ul className="text-red-700 text-sm space-y-1">
                                    {Object.entries(errors).map(([key, error]) => (
                                        <li key={key}>• {key}: {error?.message?.toString()}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Boutons d'action */}
                        <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">

                            {/* Annuler */}
                            <button type="button" onClick={onClose} disabled={isSubmitting} className=" flex-1  px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-base border-2 border-gray-300  text-gray-700 rounded-lg  hover:bg-gray-50  font-medium transition-colors  disabled:opacity-50  " >
                                Annuler
                            </button>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                onClick={() => {
                                    console.log("Bouton cliqué");
                                    console.log("Erreurs actuelles:", errors);
                                }}
                                className="flex-1 px-3 py-2 text-sm sm:px-6 sm:py-3 sm:text-base bg-brand-secondary text-white rounded-lg hover:bg-brand-secondary/80 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 sm:gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        <span className="whitespace-nowrap">Enregistrement...</span>
                                    </>
                                ) : (
                                    <span className="whitespace-nowrap">
                                        {initialData?.id ? "Mettre à jour" : "Créer l'annonce"}
                                    </span>
                                )}
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>

    );
}