// components/services/FormServices.tsx
"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Check, Info, MapPin } from "lucide-react";
import { useAlert } from "@/contexts/AlertContext";
import { User, ServiceCategory, ServiceSubcategory, Service, UserLocation, Icone } from "@/types/interfaces";
import { Spinner } from "../forms/spinner/Loader";
import MultiSelect from "../forms/MultiSelect";
import ImageUploader from "./ImageUploader";
import KRichEditor from "./KRichEditor";
import { GeoLocationResult, getUserLocation } from "@/utils/geolocation";
import { Loading } from "./spinner/Loading";
import { listIcons } from "@/services/iconsService";
import IconSelector from "./files/IconSelector";
import SelectedIconDisplay from "./files/SelectedIconDisplay";
import { createService, updateService } from "@/services/allService";
import Messages, { MessagesData } from "../home/Messages";


// ========== TYPES & INTERFACES ==========
interface FormServicesProps {
    onClose: () => void;
    user: User;
    allCategories: ServiceCategory[];
    allSubcategories: ServiceSubcategory[];
    mode?: "create" | "edit";
    initialData?: Service | null;
    OnGetAllServices: () => void;
}

interface FormData {
    categoryId: string;
    subcategoryId: string;
    title: string;
    description: string;
    basePriceCents: number;
    iconId: string;
    image: File | null;
}

// ========== VALIDATION SCHEMA ==========
const serviceSchema = z.object({
    categoryId: z.string().min(1, "Catégorie obligatoire"),
    subcategoryId: z.string().min(1, "Sous-catégorie obligatoire"),
    title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
    description: z.string().min(10, "Description trop courte (min. 10 caractères)"),
    basePriceCents: z.number().min(100, "Le prix doit être d'au moins 1 F CFA"),
    iconId: z.string().min(1, "Icône obligatoire"),
});


const FormField = memo(({ label, required = false, error, children, hint }: { label: string; required?: boolean; error?: string; children: React.ReactNode; hint?: string; }) => (

    <div className="space-y-2">
        <label className="block font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {hint && (
            <p className="text-sm text-blue-600 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{hint}</span>
            </p>
        )}
        {error && (
            <p className="text-red-500 text-sm flex items-center gap-1">
                <span className="text-lg">⚠️</span>
                {error}
            </p>
        )}
    </div>

));
FormField.displayName = "FormField";

// ========== MAIN COMPONENT ==========
export default function FormServices({ onClose, user, allCategories, allSubcategories, mode = "create", initialData = null,OnGetAllServices }: FormServicesProps) {

    const [msg, setMsg] = useState<MessagesData[]>([]);
    const [location, setLocation] = useState<GeoLocationResult | null>(null);
    const { showAlert } = useAlert();
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");

    const [icones, setIcones] = useState<Icone[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const iconsPerPage = 8;

    // ========== STATE ==========
    const [formData, setFormData] = useState<FormData>({
        categoryId: "",
        subcategoryId: "",
        title: "",
        description: "",
        basePriceCents: 0,
        iconId: "",
        image: null,
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showIconSelector, setShowIconSelector] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Fonction qui peut être appelée à tout moment pour recharger
    const reloadIcons = (pageNumber?: number, limit?: number) => {
        const loadIcons = async () => {
            try {
                const response = await listIcons(pageNumber ?? page, limit ?? iconsPerPage);
                if (response.statusCode === 200 && response.data) {
                    setIcones(response.data.data);
                    setTotalPages(response.data.total);
                    console.log("data", response.data);
                } else {
                    console.log("error", response.message);
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des icônes :", err);
            }
        };
        loadIcons(); // ← Important : il faut exécuter la fonction !
    };

    // Récupération initiale des icônes au montage
    useEffect(() => {
        reloadIcons();
    }, [page]);


    // ========== MEMOIZED VALUES ==========
    const userCategories = useMemo(() => allCategories.filter((cat) => (user.selectedCategories ?? []).some((uc) => uc.categoryId === cat.id)),
        [user.selectedCategories, allCategories]
    );

    const filteredSubcategories = useMemo(() => {
        if (!formData.categoryId) return [];
        return allSubcategories.filter((sub) => sub.categoryId === formData.categoryId && (user.selectedSubcategories ?? []).some((us) => us.subcategoryId === sub.id)
        );
    }, [formData.categoryId, allSubcategories, user.selectedSubcategories]);

    const isFormValid = useMemo(() => formData.iconId.length > 0 && !isLoading,
        [formData.iconId, isLoading]
    );

    const askForLocation = async () => {
        try {
            setIsLocLoading(true); // ← loader ON

            const data = await getUserLocation({
                onPermissionDenied: () => {
                    setIsLocLoading(false);
                    setMsg([
                        {
                            id: "geo-001",
                            type: "text",
                            title: "📍 Localisation obligatoire",
                            message:
                                "Notre application nécessite votre localisation pour fonctionner correctement. Veuillez l’activer.",
                            linkText: "Activer la localisation",
                            onClick: () => askForLocation(),
                        },
                    ]);
                },
            });

            // Remplissage de l'objet userLocation
            const userLocation: UserLocation = {
                lat: data.lat,
                lng: data.lng,
                country: data.country ?? null,
                city: data.city ?? null,
                district: data.district ?? null,
                street: data.street ?? null,
            };

            setLocation(userLocation);

            if (!data.error) {
                const readableText = `${userLocation.city ?? "Ville inconnue"} – ${userLocation.street ?? "Rue inconnue"}`;
                setDisplayLocation(readableText);
                setMsg([]);
            } else {
                setMsg([
                    {
                        id: "geo-002",
                        type: "text",
                        title: "📍 Oups une erreur s'est produite",
                        message: "Erreur de réseau, veuillez réessayer.",
                        linkText: "Relancer",
                        onClick: () => askForLocation(),
                    },
                ]);
            }
        } catch (err) {
            setMsg([
                {
                    id: "geo-003",
                    type: "text",
                    title: "🚨 Erreur inattendue",
                    message:
                        "Une erreur est survenue. Vérifiez votre réseau et réessayez.",
                    linkText: "Réessayer",
                    onClick: () => askForLocation(),
                },
            ]);
        } finally {
            setIsLocLoading(false); // ← loader OFF
        }
    };

    const onCloseMessage = async () => {
        setMsg([]);
    };


    const handleFieldChange = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setValidationErrors((prev) => ({ ...prev, [field]: "" }));
    }, []);

    const handleImageSelect = useCallback((files: File[] | null) => {
        const selectedFile = files?.[0] ?? null;
        handleFieldChange("image", selectedFile);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(selectedFile);

        } else {
            setImagePreview(null);
        }
    }, [handleFieldChange]);


    useEffect(() => {
        if (!user) return;
        const loc = (user.location ?? {}) as UserLocation;
        const formatted: UserLocation = {
            lat: loc.lat ?? null,
            lng: loc.lng ?? null,
            country: loc.country ?? null,
            city: loc.city ?? null,
            district: loc.district ?? null,
            street: loc.street ?? null,
        };
        setLocation(formatted);
    }, [user]);

    // ========== EFFECTS ==========
    // Auto-préremplissage intelligent du titre avec le nom de la sous-catégorie

    useEffect(() => {
        if (formData.subcategoryId) {

            const selectedSubcat = allSubcategories.find(
                (sub) => sub.id === formData.subcategoryId
            );
            // Préremplit uniquement si le champ est vide ou égal à l'ancien nom
            if (selectedSubcat &&
                (!formData.title.trim() || allSubcategories.some((s) => s.name === formData.title.trim()))) {
                setFormData((prev) => ({ ...prev, title: selectedSubcat.name }));
            }
        }
    }, [formData.subcategoryId, allSubcategories]);


    // Préremplissage en mode édition
    useEffect(() => {

        if (mode === "edit" && initialData) {
            setFormData({
                categoryId: initialData.categoryId || "",
                subcategoryId: initialData.subcategoryId || "",
                title: initialData.title || "",
                description: initialData.description || "",
                basePriceCents: initialData.basePriceCents || 0,
                iconId: initialData.iconId || "",
                image: null,
            });
            setShowIconSelector(false);
            setImagePreview(initialData.images || null);
        }
    }, [initialData, mode]);

    const clearForm = () => {
        setFormData({
            categoryId: "",
            subcategoryId: "",
            title: "",
            description: "",
            basePriceCents: 0,
            iconId: "",
            image: null,
        });
        setShowIconSelector(true);
        setImagePreview(null);
        setValidationErrors({});
    };


    const handleSubmit = useCallback(async (e: React.FormEvent) => {

        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});


        // Validation Zod
        const parsed = serviceSchema.safeParse(formData);
        if (!parsed.success) {
            const errors = Object.fromEntries(
                parsed.error.issues.map(issue => [issue.path[0] as string, issue.message])
            );
            setValidationErrors(errors);
            showAlert("Veuillez corriger les erreurs du formulaire ⚠️", "error");
            setIsLoading(false);
            return;
        }

        try {
            // Préparer FormData
            const formPayload = new FormData();
            Object.entries(parsed.data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formPayload.append(key, value.toString());
                }
            });

            // Ajout des images (support fichier unique ou tableau)
            if (formData.image) {
                if (Array.isArray(formData.image)) {
                    formData.image.forEach(file => formPayload.append("images", file));
                } else {
                    formPayload.append("images", formData.image);
                }
            }

            // Ajout location et type de service
            if (location) formPayload.append("location", JSON.stringify(location));
            formPayload.append("serviceType", "APPOINTMENT");

            // Envoi via service
            let res;
            if (mode === "edit" && initialData) {
                res = await updateService(initialData.id, formPayload);
            } else {
                res = await createService(formPayload);
            }

            // Gestion du message
            const successMessage = mode === "create" ? "Service créé avec succès ! 🎉" : "Service modifié avec succès ! ✅";

            if (res.statusCode === 201 || res.statusCode === 200) {
                showAlert(res.message || successMessage, "success");

                if (mode === "create") {
                    clearForm();
                }
                // Fermer la modale ou le formulaire
                onClose?.();
                OnGetAllServices?.();
            } else {
                showAlert(res.message || "Une erreur est survenue.", "error");
                OnGetAllServices?.();
            }


        } catch (error) {
            console.error(error);
            showAlert("Une erreur est survenue. Veuillez réessayer.", "error");
        } finally {
            setIsLoading(false);
        }


    }, [formData, mode, location, showAlert, close, initialData]);


    // ========== RENDER ==========
    return (

        <div className="bg-white p-1 max-w-md mx-auto mt-4">
            <h2 className="text-xl font-medium text-black text-center mb-8 uppercase">
                {mode === "create" ? "Créer un nouveau service" : "Modifier le service"}
            </h2>

            {/* <pre className="mb-4">{JSON.stringify(user, null, 2)}</pre> */}

            <Messages msg={msg} onCloseMsg={onCloseMessage} />

            <form onSubmit={handleSubmit} className="space-y-6">

                <FormField label="Choisissez où se situe votre service sur la carte">
                    <div className="flex flex-col gap-2">
                        <button  type="button" onClick={askForLocation} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"  >
                            <MapPin className="w-4 h-4 text-[#b07b5e]" />
                            {isLocLoading ? "Détection..." : "Utiliser mon point actuel"}
                        </button>

                        {/* Affichage position ou loader */}
                        <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">

                            {isLocLoading ? (
                                <Loading />
                            ) : (
                                <>
                                    <span className="text-[#b07b5e]">📍</span>
                                    {displayLocation}
                                </>
                            )}
                        </div>

                        <p className="text-xs text-slate-500">
                            Par défaut, votre localisation a été détectée lors de la création du compte.
                            Vous pouvez la modifier en cliquant sur ce bouton ou ignorer.
                        </p>
                    </div>
                </FormField>


                {/* Sélection d'icône */}
                <FormField label="Icône du service" required error={validationErrors.iconId} hint="Choisissez une icône représentative de votre service"  >
                    {!formData.iconId || showIconSelector ? (

                        <IconSelector
                            selectedIcon={formData.iconId}
                            onSelectIcon={(id) => { setFormData((p) => ({ ...p, iconId: id })); setShowIconSelector(false); }}
                            page={page}            // page initiale
                            limit={iconsPerPage}          // icônes par page
                            onIconsLoaded={(loaded) => setIcones(loaded)} // synchronise le parent
                        />
                    ) : (
                        <SelectedIconDisplay
                            iconId={formData.iconId}
                            icones={icones}
                            onEdit={() => setShowIconSelector(true)}
                        />
                    )}
                </FormField>

                {/* Catégorie */}
                <FormField label="Catégorie" required error={validationErrors.categoryId} >
                    <MultiSelect data={userCategories.map((c) => ({ id: c.id, label: c.name }))}
                        multiple={false}
                        placeholder="Sélectionner une catégorie"
                        onSelect={(id) => handleFieldChange("categoryId", String(id))}
                        defaultValue={formData.categoryId}
                    />
                </FormField>

                {/* Sous-catégorie */}
                {formData.categoryId && (
                    <FormField label="Sous-catégorie" required error={validationErrors.subcategoryId} >
                        <MultiSelect data={filteredSubcategories.map((s) => ({ id: s.id, label: s.name, }))}
                            multiple={false}
                            placeholder="Sélectionner une sous-catégorie"
                            onSelect={(id) => handleFieldChange("subcategoryId", String(id))}
                            defaultValue={formData.subcategoryId}
                        />
                    </FormField>
                )}

                {/* Titre */}
                <FormField
                    label="Titre du service"
                    required
                    error={validationErrors.title}
                    hint={formData.subcategoryId ? "Le titre est automatiquement rempli. Gardez-le pour faciliter la recherche de votre service par les clients." : undefined
                    } >
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleFieldChange("title", e.target.value)}
                        className="p-2 w-full text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                        style={{ fontSize: '16px' }} // ← C'est la clé !
                        placeholder="Ex: Plomberie résidentielle"
                    />
                </FormField>

                {/* Description */}
                {/* <pre>  {JSON.stringify(formData.description, null, 2)}</pre> */}
                <FormField label="Description" required error={validationErrors.description} >
                    <KRichEditor value={formData.description}
                        onChange={(content) => handleFieldChange("description", content)}
                        maxLength={200} />
                </FormField>

                {/* Prix */}

                <FormField label="Prix de base (F CFA)" required error={validationErrors.basePriceCents}>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={formData.basePriceCents > 0 ? formData.basePriceCents : ""}
                        onChange={(e) => handleFieldChange("basePriceCents", Number(e.target.value))}
                        className="p-2 w-full text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                        style={{ fontSize: '16px' }} // ← C'est la clé !
                        placeholder="Ex: 5000"
                    />
                </FormField>



                {/* Image (optionnelle) */}
                <FormField label="Image du service" hint="Ajoutez une image pour illustrer votre service (optionnel)" >
                    <ImageUploader multiple={false} initialPreviews={mode === "edit" && imagePreview ? [imagePreview] : []} onSelect={handleImageSelect} />
                    {formData.image && (
                        <p className="text-sm text-green-600 mt-2 flex items-center">
                            <Check className="w-4 h-4 mr-1" />  Fichier sélectionné : {formData.image.name}
                        </p>
                    )}
                </FormField>

                {/* Bouton de soumission */}
                <div className="pt-4">
                    <button type="submit" disabled={!isFormValid} className={`w-full py-3.5 font-semibold rounded-lg transition-all ${isFormValid ? "bg-[#b07b5e] text-white hover:bg-[#155e75] shadow-md hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                        aria-label={mode === "create" ? "Créer le service" : "Mettre à jour le service"} >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Spinner />
                                <span>Traitement en cours...</span>
                            </span>
                        ) : mode === "create" ? ("Créer le service") : ("Mettre à jour le service"
                        )}
                    </button>

                    {!isFormValid && !isLoading && (
                        <p className="text-sm text-amber-600 text-center mt-3 flex items-center justify-center gap-2">
                            <span className="text-lg">⚠️</span>
                            Veuillez sélectionner une icône pour continuer
                        </p>
                    )}
                </div>

            </form>

        </div>
    );

}
