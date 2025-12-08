"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import Erreurs from '../page/Erreurs';
import MyModal from '../modal/MyModal';
import DetailProduit from './DetailProduit';
import { Product } from '@/types/interfaces';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductListProps {
    products: Product[];
    searchTerm: string;
    onResetFilters: () => void;
}

const ProductList = ({ products, searchTerm, onResetFilters }: ProductListProps) => {

    const [isLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 6;
    const [open, setOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();

    const paginatedProducts = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const formatPrice = (price: number) => price.toLocaleString() + ' ₣';

    const handleSelectProduct = (data: Product) => {
        setSelectedProduct(data);
        setOpen(true);
    };

    const handleAddToCartClick = (product: Product) => {
        addToCart(product);
    };

    if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

    if (products.length === 0) return (
        <div className="text-center py-8">
            <div className="flex justify-center py-1"><Erreurs /></div>
            <button onClick={onResetFilters} className="mt-2 text-[#b07b5e] text-sm hover:text-[#b07b5e]">Réinitialiser les filtres</button>
        </div>
    );

    return (
        <div className="relative w-full mb-3 mt-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                    {searchTerm ? `Résultats pour "${searchTerm}"` : 'Tous les produits'}
                    <span className="text-sm font-normal text-gray-500 ml-2">({products.length})</span>
                </h2>
            </div>

            <div className="space-y-3">
                {paginatedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg p-3 border border-gray-200 shadow-xs">
                        <div onClick={() => handleSelectProduct(product)} className="flex items-center space-x-3">

                            {/* Product Image */}
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative">
                                <Image
                                    src={product.images?.[0] || "/placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full" unoptimized
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                                <p className="text-xs text-gray-500 mb-1 line-clamp-1">{product.category.name} • {product.subCategory.name}</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <p className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className="text-xs text-gray-500">{product.rating} ({product.reviewCount})</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                            <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{product.stock > 10 ? 'En stock' : product.stock > 0 ? `Stock faible (${product.stock})` : 'Rupture'}</span>
                            <button onClick={() => handleAddToCartClick(product)} className="bg-[#b07b5e] hover:bg-[#b07b5e] text-white text-xs px-2 py-1 rounded-xl transition-colors">
                                <ShoppingCart className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <MyModal open={open} onClose={() => setOpen(false)}>
                    <DetailProduit product={selectedProduct} />
                </MyModal>
            )}

            {totalPages > 1 && (
                <Pagination
                    page={page}
                    onPageChange={setPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalPages}
                />
            )}
        </div>
    );
};

export default ProductList;