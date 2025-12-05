// components/Cart.tsx
"use client";

import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";

export default function Cart() {
    const { cartItems, removeFromCart, updateCartItemQuantity } = useCart();

    const [promoCode, setPromoCode] = useState("");
    const deliveryFee = 20;

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const total = subtotal + deliveryFee;

    return (
        <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-2">
                <h1 className="text-xl font-medium text-gray-900 mb-2">
                    Mon panier
                </h1>
            </div>

            {/* EMPTY CART */}
            {cartItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Image
                        src="/empty-cart.png"
                        width={180}
                        height={180}
                        alt="Empty Cart"
                        className="opacity-80"
                    />
                    <p className="text-gray-600 text-sm mt-4 px-4">
                        Votre panier est vide. Ajoutez des produits pour continuer.
                    </p>
                </div>
            )}

            {/* CART ITEMS */}
            {cartItems.length > 0 && (
                <div className="space-y-4 px-2">
                    {cartItems.map((item) => (
                        <div
                            key={item.product.id}
                            className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm active:scale-[0.97] transition-all duration-150 flex items-center justify-between swipe-item hover:scale-[1.02] hover:shadow-md"
                        >
                            <div className="flex items-start space-x-3 flex-1">

                                {/* Product Image with skeleton */}
                                <div className="w-12 h-12 flex-shrink-0 relative rounded-md overflow-hidden bg-gray-100 animate-pulse">
                                    <Image
                                        src={item.product.images?.[0] || "/upload_area.svg"}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover w-full h-full"
                                        onLoadingComplete={(img) => img.classList.remove('animate-pulse')}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 text-sm">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.product.category?.name || ""}
                                    </p>
                                    <p className="text-base font-semibold text-[#b07b5e] mt-1">
                                        {item.product.price} {item.product.currency}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        <Minus size={14} className="text-gray-600" />
                                    </button>

                                    <span className="text-base font-medium text-gray-900 min-w-6 text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                    >
                                        <Plus size={14} className="text-gray-600" />
                                    </button>

                                    <button
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-red-50 hover:border-red-200 ml-2"
                                    >
                                        <X size={14} className="text-gray-500 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SUMMARY */}
            {cartItems.length > 0 && (
                <>
                    <div className="px-4 py-3">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Code promo"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b07b5e]"
                            />
                            <button className="px-4 py-2 bg-[#b07b5e] text-white rounded-lg text-sm font-medium">
                                Appliquer
                            </button>
                        </div>
                    </div>

                    <div className="px-4 py-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Sous-total</span>
                            <span className="font-medium text-gray-900">{subtotal.toFixed(2)} FCFA</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Livraison</span>
                            <span className="font-medium text-gray-900">{deliveryFee.toFixed(2)} FCFA</span>
                        </div>

                        <div className="flex justify-between pt-2 text-base font-semibold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-[#b07b5e]">{total.toFixed(2)} FCFA</span>
                        </div>
                    </div>

                    {/* PAY NOW */}
                    <div className="px-4 py-4">
                        <Link href="/checkout" className="flex items-center">
                            <button className="w-full bg-[#b07b5e] text-white py-3 rounded-lg text-base font-semibold">
                                Payer maintenant
                            </button>
                        </Link>

                    </div>
                </> 
            )}
        </div>
    );
}