"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import { Product } from '@/types/interfaces';

interface BestSellersProps {
    products: Product[];
}

const BestSellers = ({ products }: BestSellersProps) => {
    const [isLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 6;

    const paginatedProducts = products.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const formatPrice = (price: number) => price.toLocaleString() + ' ₣';

    if (isLoading) return <div className="flex justify-center py-4"><Spinner /></div>;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-medium text-gray-900">Best-sellers</h2>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
                {paginatedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg p-2 border border-[#b07b5e]/80 shadow-xs hover:shadow-sm transition-shadow">
                        <div className="flex flex-col items-center text-center">

                            {/* Product Image */}
                            <div className="w-12 h-12 mb-1 relative rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={product.images?.[0] || "/placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-cover w-full h-full" unoptimized
                                />
                            </div>

                            {/* Texte compact */}
                            <h3 className="font-medium text-gray-800 text-[10px] leading-tight mb-1 line-clamp-2">
                                {product.name.split(' ').slice(0, 3).join(' ')}
                                {product.name.split(' ').length > 3 && '...'}
                            </h3>
                            <p className="text-xs font-bold text-gray-900">{formatPrice(product.price)}</p>

                            {/* Rating compact */}
                            <div className="flex items-center mt-0.5">
                                <span className="text-yellow-400 text-[10px]">★</span>
                                <span className="text-[10px] text-gray-500 ml-0.5">{product.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="mt-2">
                    <Pagination
                        page={page}
                        onPageChange={setPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalPages}
                    />
                </div>
            )}
        </div>
    );
};

export default BestSellers;