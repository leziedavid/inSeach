// components/ProductDetail.tsx
import React from 'react';
import { Product } from '@/types/interfaces';

interface ProductDetailProps {
    product?: Product | null;
    onBack?: () => void;
    onNegotiate?: (product: Product) => void;
    onOrder?: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({product,onBack,onNegotiate,onOrder}) => {
    // Si pas de produit, afficher un état de chargement ou message d'erreur
    if (!product) {
        return (
            <div className="overflow-y-auto pt-8 pb-24 bg-white dark:bg-slate-900 min-h-screen">
                <div className="mx-auto max-w-md border-0">
                    <div className="p-6 pt-0">
                        <div className="pt-2">
                            <div className="pb-28">
                                {/* Bouton retour */}
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="p-2 -ml-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-left w-5 h-5 text-slate-600 dark:text-slate-400"
                                    >
                                        <path d="m12 19-7-7 7-7"></path>
                                        <path d="M19 12H5"></path>
                                    </svg>
                                </button>

                                {/* Message d'erreur */}
                                <div className="text-center py-12">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-slate-400 mx-auto"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                                        Produit non trouvé
                                    </h2>
                                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                                        Le produit que vous recherchez n'existe pas ou a été supprimé.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Fonction pour formater le prix avec espace insécable
    const formatPrice = (price: number) => {
        return price.toLocaleString('fr-FR').replace(/\s/g, '\u202F');
    };

    // Fonction pour afficher les étoiles de notation
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(rating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-600'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                    {rating.toFixed(1)} ({product.reviewCount} avis)
                </span>
            </div>
        );
    };

    // Fonction pour déterminer le statut du stock
    const getStockStatus = () => {
        if (product.stock <= 0) {
            return {
                text: 'Rupture de stock',
                className: 'bg-red-100 text-red-700'
            };
        } else if (product.stock < 10) {
            return {
                text: `Plus que ${product.stock} disponible${product.stock > 1 ? 's' : ''}`,
                className: 'bg-amber-100 text-amber-700'
            };
        } else {
            return {
                text: '✓ En stock',
                className: 'bg-green-100 text-green-700'
            };
        }
    };

    const stockStatus = getStockStatus();

    return (
        <div className="overflow-y-auto pt-8 pb-24 bg-white dark:bg-slate-900 min-h-screen">
            <div className="mx-auto max-w-md border-0">
                <div className="p-6 pt-0">
                    <div className="pt-2">
                        <div className="pb-28">
                            {/* Bouton retour */}
                            <button
                                type="button"
                                onClick={onBack}
                                className="p-2 -ml-2 mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-arrow-left w-5 h-5 text-slate-600 dark:text-slate-400"
                                >
                                    <path d="m12 19-7-7 7-7"></path>
                                    <path d="M19 12H5"></path>
                                </svg>
                            </button>

                            {/* Image du produit */}
                            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                {product.images && product.images[0] ? (
                                    <img
                                        src={typeof product.images[0] === 'string' ? product.images[0] : ''}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="w-20 h-20"
                                        >
                                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                            <circle cx="9" cy="9" r="2"></circle>
                                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                        </svg>
                                    </div>
                                )}

                                {/* Badge de prix */}
                                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                                    <span className="text-base font-bold">
                                        {formatPrice(product.price)} {product.currency}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div className="text-xs opacity-90 line-through mt-1">
                                            {formatPrice(product.originalPrice)} {product.currency}
                                        </div>
                                    )}
                                </div>

                                {/* Badge best-seller */}
                                {product.isBestSeller && (
                                    <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                                        Best-seller
                                    </div>
                                )}
                            </div>

                            {/* Titre du produit */}
                            <div className="mt-6">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {product.name}
                                </h1>

                                {/* Note et avis */}
                                <div className="mt-3">
                                    {renderStars(product.rating)}
                                </div>

                                {/* Catégorie et vendeur */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                        {product.category.name}
                                    </span>
                                    {product.subCategory && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            {product.subCategory.name}
                                        </span>
                                    )}
                                    {product.seller && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                                            Vendeur: {product.seller}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Informations de stock et livraison */}
                            <div className="mt-8 space-y-6">
                                {/* Statut du stock */}
                                <div>
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${stockStatus.className}`}>
                                        {stockStatus.text}
                                    </span>
                                </div>

                                {/* Livraison */}
                                <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                                    <p className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-truck"
                                        >
                                            <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
                                            <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
                                            <circle cx="7" cy="18" r="2" />
                                            <path d="M15 18H9" />
                                            <circle cx="17" cy="18" r="2" />
                                        </svg>
                                        🚚 Livraison disponible
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-shield-check"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                            <path d="m9 12 2 2 4-4" />
                                        </svg>
                                        Paiement sécurisé
                                    </p>
                                </div>

                                {/* Description */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                        Description
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>

                                {/* Caractéristiques */}
                                {product.features && product.features.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                            Caractéristiques
                                        </h3>
                                        <ul className="space-y-2">
                                            {product.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-check text-green-500 mt-0.5 flex-shrink-0"
                                                    >
                                                        <path d="M20 6 9 17l-5-5" />
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Tailles disponibles (si applicable) */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                            Tailles disponibles
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.sizes.map((size, index) => (
                                                <button
                                                    key={index}
                                                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                {product.tags && product.tags.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {product.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-sm"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Date d'ajout */}
                                <div className="mt-8 text-sm text-slate-500 dark:text-slate-500">
                                    <p>
                                        Ajouté le {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Boutons d'action fixés en bas */}
                            <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex gap-3 max-w-md mx-auto">
                                    <button
                                        onClick={() => onNegotiate?.(product)}
                                        className="inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 border bg-white dark:bg-slate-800 shadow-none hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 h-12 px-4 flex-1 py-6 rounded-2xl text-base font-medium border-slate-300 dark:border-slate-700"
                                        type="button" >
                                        Négocier
                                    </button>
                                    <button onClick={() => onOrder?.(product)}
                                        disabled={product.stock <= 0}
                                        className={`inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 shadow-none h-12 px-4 flex-[2] py-6 rounded-2xl text-base font-medium ${product.stock <= 0 ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed' : 'bg-slate-900 dark:bg-blue-900 hover:bg-slate-800 dark:hover:bg-blue-800 text-white dark:text-slate-50'  }`}
                                        type="button" >
                                        {product.stock <= 0 ? 'Rupture de stock' : 'Commander →'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;