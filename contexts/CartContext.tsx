'use client';

import { CartItem, Product } from '@/types/interfaces';
import { createContext, useContext, useState } from 'react';

interface CartContextValue {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void; // string
    updateCartItemQuantity: (productId: string, quantity: number) => void; // string
    cartTotal: number;
    cartCount: number;
}

// Create a context with default values
const CartContext = createContext<CartContextValue>({
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateCartItemQuantity: () => {},
    cartTotal: 0,
    cartCount: 0,
});

interface Props {
    children: React.ReactNode;
}

// Create a provider component that wraps the children components
export const CartProvider = ({ children }: Props) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        const existingCartItemIndex = cartItems.findIndex(
            (item) => item.product.id === product.id
        );

        if (existingCartItemIndex !== -1) {
            const existingCartItem = cartItems[existingCartItemIndex];
            const updatedCartItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingCartItemIndex] = updatedCartItem;
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string) => {
        const updatedCartItems = cartItems.filter(
            (item) => item.product.id !== productId
        );
        setCartItems(updatedCartItems);
    };

    const updateCartItemQuantity = (productId: string, quantity: number) => {
        const existingCartItemIndex = cartItems.findIndex(
            (item) => item.product.id === productId
        );
        if (existingCartItemIndex !== -1) {
            const existingCartItem = cartItems[existingCartItemIndex];
            const updatedCartItem = {
                ...existingCartItem,
                quantity,
            };
            const updatedCartItems = [...cartItems];
            updatedCartItems[existingCartItemIndex] = updatedCartItem;
            setCartItems(updatedCartItems);
        }
    };

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartItemQuantity,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Create a custom hook to use the CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
