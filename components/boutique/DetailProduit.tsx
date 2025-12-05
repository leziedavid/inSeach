"use client"

import { useState } from "react"
import Link from "next/link"
import { Product } from "@/types/interfaces"

interface ProductDetailProps {
    product: Product
}

const DetailProduit = ({ product }: ProductDetailProps) => {
    const [selectedSize, setSelectedSize] = useState("L")
    const [showFullDescription, setShowFullDescription] = useState(false)

    // Calculer la réduction si originalPrice existe
    const discount = product.originalPrice  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)  : 0

    // Tailles par défaut basées sur la catégorie
    const getDefaultSizes = () => {
        if (product.category.name.includes("Vêtements") || product.category.name.includes("Mode")) {
            return ["S", "M", "L", "XL"]
        }
        if (product.category.name.includes("Chaussures")) {
            return ["38", "39", "40", "41", "42", "43"]
        }
        return ["Unique"]
    }

    const sizes = getDefaultSizes()

    const shortDescription = product.description.split('.').slice(0, 2).join('.') + '...'

    return (
        <div className="bg-white p-1 max-w-md mx-auto mt-4">

            {/* CONTENU */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 hide-scrollbar">

                {/* Image du produit */}
                <div className="bg-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                        <div className="text-4xl mb-2">
                            {product.category.name === "Électronique" && "📱"}
                            {product.category.name === "Beauté & Santé" && "💄"}
                            {product.category.name === "Maison & Jardin" && "🏠"}
                            {product.category.name === "Mode & Accessoires" && "👕"}
                            {product.category.name === "Sports & Loisirs" && "⚽"}
                        </div>
                        <p className="text-sm">Image: {product.images?.[0] && typeof product.images[0] === 'string' ? product.images[0] : 'Produit'}</p>
                    </div>
                </div>

                {/* Prix et nom */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold text-gray-900">{product.price.toLocaleString()} {product.currency}</span>
                        {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">{product.originalPrice.toLocaleString()}{product.currency}</span>
                        )}
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h1>
                    <p className="text-sm text-gray-600">{product.category.name} • {product.subCategory.name}</p>
                </div>

                {/* Tailles */}
                {sizes.length > 1 && (
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">Taille de l'article</span>
                            <span className="text-green-600 text-sm font-medium">✓ disponibilité confirmée</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-3 rounded-lg border text-sm font-medium transition-colors ${selectedSize === size
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Infos boutique */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-gray-900">{product.seller}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(product.rating) ? "#fbbf24" : "#d1d5db"} stroke={i < Math.floor(product.rating) ? "#fbbf24" : "#d1d5db"} strokeWidth="2">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">{product.rating} ★ {product.reviewCount} évaluations</span>
                    </div>
                </div>

                {/* Bouton contacter */}
                <button className="w-full bg-gray-50 text-black py-3 rounded-xl font-semibold mb-6 transition-colors">
                    Contacter le vendeur
                </button>

                {/* Détails produit */}
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">Détails</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">
                        {showFullDescription ? product.description : shortDescription}
                    </p>
                    <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-orange-500 text-sm font-medium hover:text-orange-600"
                    >
                        {showFullDescription ? 'Moins' : 'Plus'}
                    </button>
                </div>

                {/* Caractéristiques */}
                {product.features.length > 0 && (
                    <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Caractéristiques</h3>
                        <ul className="text-gray-600 text-sm space-y-1">
                            {product.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Boutique info */}
                <div className="bg-gray-50 rounded-xl p-4 ">
                    <h4 className="font-semibold text-gray-900 mb-2">{product.seller}</h4>
                    <p className="text-gray-600 text-sm">Boutique certifiée • Vendeur professionnel</p>
                </div>

            </div>

            {/* BOUTONS D'ACTION FIXÉS EN BAS */}
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-gray-200 p-4 ">
                <div className="flex gap-3">
                    <button className="flex-1 bg-white border border-orange-500 text-orange-500 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="21" r="1" />
                            <circle cx="19" cy="21" r="1" />
                            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                        Ajouter au panier
                    </button>
                    <button className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors">
                        Acheter
                    </button>
                </div>
            </div>

        </div>
    )
}

export default DetailProduit