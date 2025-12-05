'use client';

import { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronDown, Plus, X } from "lucide-react";
import Image from "next/image";
import { SubCategory, ServiceType, User } from "@/types/interfaces";
import { useAlert } from "@/contexts/AlertContext";
import { categories } from "@/data/products";
import { getDefaultSizes } from "@/utils/getgetDefaultSizes";
import { fakeUsers } from "@/data/fakeServices";
import KRichEditor from "./KRichEditor";

// ================= VALIDATION ZOD =================
const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3, "Le nom du produit doit contenir au moins 3 caractères"),
    price: z.number().min(0, "Le prix doit être positif"),
    originalPrice: z.number().min(0, "Le prix original doit être positif").optional(),
    currency: z.string().default("USD"),
    category: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        subCategories: z.array(z.object({
            id: z.string(),
            name: z.string(),
            slug: z.string(),
        }))
    }),
    subCategory: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
    }),
    images: z.array(z.union([z.instanceof(File), z.string(), z.null()])).min(1, "Au moins une image est requise").max(4, "4 images maximum"),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    rating: z.number().min(0).max(5).default(0),
    percentegeRating: z.number().min(0).max(100).optional(),
    reviewCount: z.number().min(0).default(0),
    isBestSeller: z.boolean().default(false),
    sizes: z.array(z.string()).default([]),
    stock: z.number().min(0, "Le stock doit être positif").default(1),
    tags: z.array(z.string()).default([]),
    features: z.array(z.string()).default([]),
    // Supprimé seller et serviceType car ils seront ajoutés automatiquement
    createdAt: z.string().optional(),
});

// ================= TYPES =================
export type ProductFormValues = z.infer<typeof productSchema>;

// Type étendu pour inclure seller et serviceType lors de l'envoi
export type ProductSubmitData = ProductFormValues & {
    seller: string;
    serviceType: ServiceType[];
};

export interface ProductFormProps {
    initialValue?: Partial<ProductFormValues>;
    onSubmit?: (data: ProductSubmitData) => Promise<void>;
    onClose?: () => void;
}

// ================= COMPOSANT =================
export default function ProductForm({ initialValue, onSubmit }: ProductFormProps) {

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as any, // Solution temporaire
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            originalPrice: undefined, // Utilisez undefined au lieu de 0 pour les champs optionnels
            currency: "USD",
            category: undefined as any, // Initialisez comme undefined
            subCategory: undefined as any,
            images: [],
            rating: 0,
            reviewCount: 0,
            isBestSeller: false,
            sizes: [],
            stock: 1,
            tags: [],
            features: [],
            // Supprimé seller et serviceType des defaultValues
            ...initialValue,
        },
    });

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting }, control } = form;

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [availableSubCategories, setAvailableSubCategories] = useState<SubCategory[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [availableSizes, setAvailableSizes] = useState<string[]>([]);
    const [customSizeInput, setCustomSizeInput] = useState("");
    const { showAlert } = useAlert();
    const [mainImages, setMainImages] = useState<(File | string | null)[]>(() => {
        const imgs = initialValue?.images || [];
        return [...imgs, ...Array(4 - imgs.length).fill(null)];
    });
    const [users, setUsers] = useState<User | undefined>(undefined);

    const getUserInfo = async () => {
        try {
            // const user = await getUserInfos();
            const user = fakeUsers[0];
            if (!user) return;
            setUsers(user);
        } catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur", err);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    // ================= MISE À JOUR DES SOUS-CATÉGORIES QUAND LA CATÉGORIE CHANGE =================
    useEffect(() => {
        if (selectedCategory) {
            const category = categories.find(cat => cat.id === selectedCategory);
            if (category) {
                setSelectedCategoryName(category.name);
                setValue("category", category);

                // Mettre à jour les sous-catégories disponibles
                setAvailableSubCategories(category.subCategories);

                // Réinitialiser la sous-catégorie sélectionnée
                setValue("subCategory", {} as any);

                // Obtenir les tailles par défaut pour cette catégorie
                const defaultSizes = getDefaultSizes(category.name);
                setAvailableSizes(defaultSizes);

                // Si c'est une nouvelle création, pré-sélectionner les tailles par défaut
                if (!initialValue?.id && defaultSizes.length > 0) {
                    setValue("sizes", defaultSizes);
                }
            }
        } else {
            setAvailableSubCategories([]);
            setAvailableSizes([]);
        }
    }, [selectedCategory, setValue, initialValue]);

    // ================= INITIALISATION AVEC LES VALEURS INITIALES =================
    useEffect(() => {
        if (initialValue?.category?.id) {
            setSelectedCategory(initialValue.category.id);
        }
    }, [initialValue]);

    // ================= GESTION DES IMAGES =================
    const handleImageChange = (index: number, file: File | null) => {
        const updatedImages = [...mainImages];
        updatedImages[index] = file;
        setMainImages(updatedImages);
        setValue("images", updatedImages);
    };

    // ================= GESTION DES TAGS =================
    const addTag = () => {
        if (tagInput.trim() && !watch("tags")?.includes(tagInput.trim())) {
            const newTags = [...(watch("tags") || []), tagInput.trim()];
            setValue("tags", newTags);
            setTagInput("");
        }
    };

    const removeTag = (index: number) => {
        const newTags = watch("tags")?.filter((_, i) => i !== index) || [];
        setValue("tags", newTags);
    };

    // ================= GESTION DES FEATURES =================
    const addFeature = () => {
        if (featureInput.trim() && !watch("features")?.includes(featureInput.trim())) {
            const newFeatures = [...(watch("features") || []), featureInput.trim()];
            setValue("features", newFeatures);
            setFeatureInput("");
        }
    };

    const removeFeature = (index: number) => {
        const newFeatures = watch("features")?.filter((_, i) => i !== index) || [];
        setValue("features", newFeatures);
    };

    // ================= GESTION DES TAILLES =================
    const toggleSize = (size: string) => {
        const currentSizes = watch("sizes") || [];
        if (currentSizes.includes(size)) {
            setValue("sizes", currentSizes.filter(s => s !== size));
        } else {
            setValue("sizes", [...currentSizes, size]);
        }
    };

    const addCustomSize = () => {
        if (customSizeInput.trim() && !watch("sizes")?.includes(customSizeInput.trim())) {
            const newSizes = [...(watch("sizes") || []), customSizeInput.trim()];
            setValue("sizes", newSizes);
            setCustomSizeInput("");
        }
    };

    const removeSize = (size: string) => {
        const newSizes = watch("sizes")?.filter(s => s !== size) || [];
        setValue("sizes", newSizes);
    };

    // ================= GESTION DES CHAMPS DU FORMULAIRE =================
    const handleFieldChange = (fieldName: keyof ProductFormValues, value: any) => {
        setValue(fieldName, value);
    };

    // ================= SOUMISSION =================
    const submitHandler: SubmitHandler<ProductFormValues> = async (data) => {
        try {
            // Préparer les données finales avec seller et serviceType
            const submitData: ProductSubmitData = {
                ...data,
                seller: users?.id || "", // Utiliser l'ID de l'utilisateur connecté
                serviceType: users?.providedServices?.map(service => service.serviceType) || [ServiceType.PRODUCT] // Utiliser les serviceTypes de l'utilisateur
            };

            if (onSubmit) {
                await onSubmit(submitData);
            } else {
                console.log("Données du produit:", submitData);
                showAlert("Produit créé avec succès !", "success");
            }
        } catch (error) {
            console.error("Erreur lors de la création du produit:", error);
            showAlert("Erreur lors de la création du produit", "error");
        }
    };

    const currentSizes = watch("sizes") || [];
    const description = watch("description") || "";

    return (
        <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-2">
                <h1 className="text-sm font-medium text-gray-900">
                    Ajoutez vos articles pour commencer à vendre.
                </h1>
            </div>

            <form onSubmit={handleSubmit(submitHandler)}>

                {/* IMAGES */}
                <div>
                    <p className="font-medium mb-2 text-sm">Images (maximum 4 images)</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Array.from({ length: 4 }).map((_, index) => {
                            const img = mainImages[index] || null;
                            return (
                                <label key={index} htmlFor={`image${index}`}>
                                    <Image width={300} height={300} className="h-20 w-full sm:h-20 sm:w-full border border-slate-200 rounded cursor-pointer object-cover" src={img ? (typeof img === "string" ? img : URL.createObjectURL(img)) : "/upload_area.svg"} alt={`Image ${index + 1}`} />
                                    <input type="file" accept="image/*" id={`image${index}`} onChange={e => handleImageChange(index, e.target.files ? e.target.files[0] : null)} hidden />
                                </label>
                            );
                        })}
                    </div>
                    {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message as string}</p>}
                </div>

                {/* Listing Details Section */}
                <div className="bg-white rounded-lg p-2">
                    <h2 className="text-sm font-semibold text-gray-900 mb-6">Détails de l'annonce</h2>

                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">  Nom du produit*  </label>
                            <input type="text" {...register("name")}  className="p-2 w-full text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"  style={{ fontSize: '16px' }} placeholder="Ex: Coupe électrique" />
                            {errors.name && (<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>)}
                        </div>

                        {/* Description avec KRichEditor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description*
                            </label>
                            <KRichEditor
                                value={description}
                                onChange={(content) => handleFieldChange("description", content)}
                                maxLength={200}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {description.length}/200 caractères
                            </p>
                        </div>

                        {/* Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price*
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">F</span>
                                    </div>
                                    <input
                                        type="number"
                                        {...register("price", { valueAsNumber: true })}
                                        className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#155e7533] pl-9"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prix ​​d'origine </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">F</span>
                                    </div>
                                    <input
                                        type="number"
                                        {...register("originalPrice", { valueAsNumber: true })}
                                        className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#155e7533] pl-9"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stock*
                            </label>
                            <input type="number"   {...register("stock", { valueAsNumber: true })}
                                className="p-2 w-full text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                                style={{ fontSize: '16px' }} // ← C'est la clé !
                                placeholder="Ex: 5000"
                            />
                            {errors.stock && (
                                <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                            )}
                        </div>

                        {/* Category Details */}
                        <div>
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-900">Détails de la catégorie</h3>
                            </div>

                            {/* Category */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie *
                                </label>
                                <div className="relative">
                                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b07b5e] focus:border-transparent appearance-none bg-white"  >
                                        <option value="">Sélectionnez une catégorie</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Sub Category - Affiché seulement si une catégorie est sélectionnée */}
                            {selectedCategory && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sous-catégorie *
                                    </label>
                                    <div className="relative">
                                        <select  {...register("subCategory.id")}
                                            onChange={(e) => {
                                                const subCat = availableSubCategories.find(sc => sc.id === e.target.value);
                                                if (subCat) {
                                                    setValue("subCategory", { id: subCat.id, name: subCat.name, slug: subCat.slug });
                                                }
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b07b5e] focus:border-transparent appearance-none bg-white"  >
                                            <option value="">Sélectionnez une sous-catégorie</option>
                                            {availableSubCategories.map((subCategory) => (
                                                <option key={subCategory.id} value={subCategory.id}>
                                                    {subCategory.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.subCategory && (
                                        <p className="text-red-500 text-sm mt-1">{errors.subCategory.message}</p>
                                    )}
                                </div>
                            )}

                            {/* Service Type - SUPPRIMÉ DU FORMULAIRE */}
                        </div>

                        {/* Sizes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tailles disponibles
                            </label>

                            {selectedCategory ? (
                                <>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Tailles disponibles pour {selectedCategoryName}
                                    </p>

                                    {/* Tailles prédéfinies */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {availableSizes.map((size) => (
                                            <button key={size} type="button" onClick={() => toggleSize(size)} className={`px-2 py-0 border rounded-lg transition-colors ${currentSizes.includes(size) ? "bg-[#b07b5e] text-white border-[#b07b5e]" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`} >
                                                {size}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Ajouter une taille personnalisée */}
                                    <div className="flex gap-2 mb-3">
                                        <input type="text"
                                            value={customSizeInput}
                                            onChange={(e) => setCustomSizeInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
                                            className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#155e7533] pl-9"
                                            placeholder="Ajouter une taille personnalisée" />
                                        <button type="button" onClick={addCustomSize} className="px-3 py-2 bg-[#b07b5e] text-white rounded-lg hover:bg-[#155e75]"  >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Tailles sélectionnées */}
                                    {currentSizes.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-2">Tailles sélectionnées:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {currentSizes.map((size) => (
                                                    <span key={size} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0 rounded">
                                                        {size}
                                                        <button type="button" onClick={() => removeSize(size)} className="text-[#b07b5e] hover:text-blue-800" >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">
                                    Veuillez d'abord sélectionner une catégorie pour voir les tailles disponibles
                                </p>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#155e7533] pl-9"
                                    placeholder="Ajouter un tag"
                                />
                                <button
                                    type="button"
                                    onClick={addTag}
                                    className="px-3 py-2 bg-[#b07b5e] text-white rounded-lg hover:bg-[#155e75]"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {watch("tags")?.map((tag, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            className="text-[#b07b5e] hover:text-blue-800"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Caractéristiques
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#155e7533] pl-9"
                                    placeholder="Ajouter une caractéristique"
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="px-3 py-2 bg-[#b07b5e] text-white rounded-lg hover:bg-[#155e75]"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <ul className="list-disc list-inside space-y-1">
                                {watch("features")?.map((feature, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Best Seller */}
                        {/* <div className="flex items-center gap-2">
                            <input type="checkbox"  {...register("isBestSeller")} className="rounded border-gray-300" />
                            <label className="text-sm font-medium text-gray-700">
                                Mark as Best Seller
                            </label>
                        </div> */}

                        {/* Seller - SUPPRIMÉ DU FORMULAIRE */}

                        {/* Affichage informatif du vendeur et service type */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Vendeur:</strong> {users?.name || users?.companyName || "Utilisateur connecté"} (ID: {users?.id})
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                <strong>Types de service:</strong> {users?.providedServices?.map(service => service.serviceType).join(", ") || ServiceType.PRODUCT}
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#b07b5e] text-white py-3 px-4 rounded-lg hover:bg-[#155e75] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Publishing..." : "Publish Listing"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}