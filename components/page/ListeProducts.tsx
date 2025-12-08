"use client"

import { useState } from "react"
import Image, { StaticImageData } from "next/image"
import { Plus } from "lucide-react"
import { Category, Product, ServiceType, SubCategory } from "@/types/interfaces"
import { Spinner } from "../forms/spinner/Loader"
import Pagination from "../pagination/Paginations"
import MyModal from "../modal/MyModal"
import { EditIcon, PinIcon, TrashIcon } from "./IconSvg"
import Erreurs from "./Erreurs"
import ProductForm, { ProductFormValues } from "../forms/FormProduct"
import { useAlert } from "@/contexts/AlertContext";

interface ProductsProps {
    products: Product[]
}

function truncateText(text: string, maxLength = 50) {
    if (!text) return ""
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "..."
}

export default function ListeProducts({ products }: ProductsProps) {

    const { showAlert } = useAlert();
    const [open, setOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
    const [selectedProducts, setSelectedProducts] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [page, setPage] = useState(0)

    const itemsPerPage = 5
    const totalPages = Math.ceil(products.length / itemsPerPage)
    const visibleItems = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage)

    const clicEdit = (product: Product) => {
        // 1️⃣ Préparer les images pour le formulaire (File ou string)
        const images = product.images?.map(img => img || null) || [];

        // 2️⃣ Préparer la catégorie et sous-catégorie correctement
        const category: Category | undefined = product.category
            ? {
                id: product.category.id,
                name: product.category.name,
                slug: product.category.slug,
                subCategories: product.category.subCategories || [],
            }
            : undefined;

        const subCategory: SubCategory | undefined = product.subCategory
            ? {
                id: product.subCategory.id,
                name: product.subCategory.name,
                slug: product.subCategory.slug,
            }
            : undefined;

        // 3️⃣ Construire l'objet pour ProductFormValues
        const formValues: ProductFormValues = {
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            currency: product.currency || "USD",
            category: category!,        // "!" car on sait qu'on a une valeur
            subCategory: subCategory!,  // idem
            images: Array.isArray(product.images) ? product.images.map(img => (typeof img === "string" ? img : img.src)) : product.images ? [product.images] : [],
            description: product.description,
            rating: product.rating || 0,
            percentegeRating: product.percentegeRating,
            reviewCount: product.reviewCount || 0,
            isBestSeller: product.isBestSeller || false,
            sizes: product.sizes || [],
            stock: product.stock || 1,
            tags: product.tags || [],
            features: product.features || [],
            createdAt: product.createdAt,
        };

        // 4️⃣ Définir dans l'état et ouvrir le formulaire
        setSelectedProducts(formValues);
        setOpen(true);
    };



    const handleDelete = (product: Product) => {
        console.log("🗑️ Suppression demandée pour :", product.name)
    }

    const handlePin = (id: string) => {
        console.log("📌 Pin clicked:", id)
    }


    // Dans ton composant ListeProducts
    const onSubmit = async (data: ProductFormValues) => {
        try {
            setIsLoading(true);

            if (data.id) {
                // ⚡ C’est une modification
                console.log("Modification du produit :", data);
                // Ici tu peux appeler ton API PUT / PATCH
            } else {
                // ⚡ C’est un nouveau produit
                console.log("Création du produit :", data);
                // Ici tu peux appeler ton API POST
            }

            showAlert("Produit enregistré avec succès !", "success"); // si tu as un context alert
            setOpen(false); // fermer le modal après enregistrement
        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            showAlert("Erreur lors de l'enregistrement du produit", "error");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="relative w-full mb-3 mt-4">
            {/* En-tête */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-bold text-gray-900">Mes Products</h1>
                    <div className="w-23 h-1 bg-[#b07b5e] mt-2"></div>
                </div>

                <button
                    onClick={() => { setSelectedProducts(null); setOpen(true) }}
                    className="bg-[#b07b5e] p-2.5 rounded-full hover:bg-gray-200 transition shadow-md"
                >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Liste */}
            <div className="flex flex-col space-y-3">
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Spinner />
                        </div>
                    ) : visibleItems.length > 0 ? (
                        visibleItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition"
                            >
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#b07b5e]/50 to-[#b07b5e]/50 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {item.images && item.images.length > 0 ? (
                                            <Image
                                                src={item.images[0] as string | StaticImageData}
                                                alt={item.name}
                                                width={28}
                                                height={28}
                                                className={`object-contain ${selectedProduct === item.id ? "brightness-200 invert" : ""}`}
                                                unoptimized
                                            />
                                        ) : (
                                            <span className={`text-sm font-semibold ${selectedProduct === item.id ? "text-white" : "text-gray-500"}`}>
                                                {item.name[0]?.toUpperCase() || "?"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-medium text-gray-900 text-sm">
                                                    {truncateText(item.name)}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-1 ml-3 transition-opacity">
                                    <button
                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        onClick={() => handlePin(item.id)}
                                    >
                                        <PinIcon size={18} color="#155e75" />
                                    </button>

                                    <button
                                        onClick={() => clicEdit(item)}
                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <EditIcon size={16} color="#b07b5e" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(item)}
                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                    >
                                        <TrashIcon size={16} color="#ff0000ff" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex justify-center py-1">
                            <Erreurs />
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            page={page}
                            onPageChange={setPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalPages}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile">
                <ProductForm
                    initialValue={selectedProducts}
                    onClose={() => setOpen(false)}
                    onSubmit={onSubmit}
                />
                {/* Contenu modal à compléter */}
            </MyModal>
        </div>
    )
}
