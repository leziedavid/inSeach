// components/ProductCarousel.tsx
import React, { useState } from 'react';
import { Product, ServiceType } from '@/types/interfaces';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ProductDetail from './ProductDetail';
import MyModal from '../modal/MyModal';
import Link from "next/link";

// Données factices de produits basées sur votre interface
const fakeProducts: Product[] = [
    {
        id: '1',
        name: 'Oraimo Toast 15 Flash 10000mAh 37W Power Bank',
        price: 7000,
        currency: '₣',
        category: {
            id: 'cat1',
            name: 'Électronique',
            slug: 'electronique',
            subCategories: []
        },
        subCategory: {
            id: 'sub1',
            name: 'Batteries externes',
            slug: 'batteries-externes'
        },
        images: ['https://static.vagueapp.com/lacabine/uploads/luga7oeap5rit9z4wpmcihg8.webp'],
        description: 'Power bank haute capacité 10000mAh avec charge rapide 37W',
        rating: 4.5,
        reviewCount: 128,
        isBestSeller: true,
        stock: 50,
        tags: ['Oraimo', 'Power Bank', '10000mAh'],
        features: ['Charge rapide 37W', 'Double port USB', 'Protection multiple'],
        seller: 'TechShop',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        name: 'Oraimo PowerGaN 33 Pro 33W GaN Wall Charger',
        price: 7000,
        currency: '₣',
        category: {
            id: 'cat1',
            name: 'Électronique',
            slug: 'electronique',
            subCategories: []
        },
        subCategory: {
            id: 'sub2',
            name: 'Chargeurs',
            slug: 'chargeurs'
        },
        images: ['https://static.vagueapp.com/lacabine/uploads/nhyuav95docf1s9hvr16uv6s.webp'],
        description: 'Chargeur GaN 33W compact et efficace',
        rating: 4.7,
        reviewCount: 95,
        isBestSeller: true,
        stock: 30,
        tags: ['Oraimo', 'GaN', 'Chargeur rapide'],
        features: ['Technologie GaN', 'Compact', 'Chargement rapide'],
        seller: 'ElectroPlus',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    },
    {
        id: '3',
        name: 'Oraimo PowerTrans Hub USB-C 7 en 1 Adaptateur multifonctionnel',
        price: 9500,
        currency: '₣',
        category: {
            id: 'cat1',
            name: 'Électronique',
            slug: 'electronique',
            subCategories: []
        },
        subCategory: {
            id: 'sub3',
            name: 'Adaptateurs',
            slug: 'adaptateurs'
        },
        images: ['https://static.vagueapp.com/lacabine/uploads/k75v23p4iafjkhpt2nrxb6cc.webp'],
        description: 'Hub USB-C 7-en-1 avec multiples ports',
        rating: 4.3,
        reviewCount: 64,
        isBestSeller: false,
        stock: 25,
        tags: ['Oraimo', 'USB-C', 'Hub'],
        features: ['7 ports', '4K HDMI', 'Lecteur SD'],
        seller: 'ConnectTech',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    },
    {
        id: '4',
        name: 'Oraimo BoomPop Lite Écouteurs supra-auriculaires sans fil ENC',
        price: 13000,
        currency: '₣',
        category: {
            id: 'cat2',
            name: 'Audio',
            slug: 'audio',
            subCategories: []
        },
        subCategory: {
            id: 'sub4',
            name: 'Écouteurs',
            slug: 'ecouteurs'
        },
        images: ['https://static.vagueapp.com/lacabine/uploads/al1h3b4vftx0nvws0pneitih.webp'],
        description: 'Écouteurs sans fil avec réduction de bruit ENC',
        rating: 4.8,
        reviewCount: 210,
        isBestSeller: true,
        stock: 100,
        tags: ['Oraimo', 'Bluetooth', 'ANC'],
        features: ['ANC actif', '30h batterie', 'IPX5'],
        seller: 'AudioPro',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    },
    {
        id: '5',
        name: 'Oraimo Watch 5 Lite Montre intelligente IP68 HD 2,01 pouces',
        price: 9000,
        currency: '₣',
        category: {
            id: 'cat3',
            name: 'Montres connectées',
            slug: 'montres-connectees',
            subCategories: []
        },
        subCategory: {
            id: 'sub5',
            name: 'Smartwatches',
            slug: 'smartwatches'
        },
        images: ['https://static.vagueapp.com/lacabine/uploads/elimibr0n5p7f0vxrvv33yuk.webp'],
        description: 'Montre connectée avec écran HD et étanche IP68',
        rating: 4.4,
        reviewCount: 156,
        isBestSeller: true,
        stock: 75,
        tags: ['Oraimo', 'Smartwatch', 'Fitness'],
        features: ['IP68', '100+ modes sport', 'Suivi santé'],
        seller: 'WearTech',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    },
    {
        id: '6',
        name: 'Pack +200 produits à lancer en e-commerce',
        price: 4450,
        currency: '₣',
        category: {
            id: 'cat4',
            name: 'Business',
            slug: 'business',
            subCategories: []
        },
        subCategory: {
            id: 'sub6',
            name: 'Formation',
            slug: 'formation'
        },
        images: ['https://static.vagueapp.com/lacabine/uploads/azxiauj126i6jit414dhtlfb.png'],
        description: 'Pack complet pour démarrer en e-commerce',
        rating: 4.9,
        reviewCount: 89,
        isBestSeller: true,
        stock: 999,
        tags: ['Formation', 'E-commerce', 'Business'],
        features: ['200+ produits', 'Formation', 'Support'],
        seller: 'BusinessAcademy',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    },
    {
        id: '7',
        name: 'Smartphone Android 128Go 6.7" 5G',
        price: 25000,
        currency: '₣',
        category: {
            id: 'cat1',
            name: 'Électronique',
            slug: 'electronique',
            subCategories: []
        },
        subCategory: {
            id: 'sub7',
            name: 'Téléphones',
            slug: 'telephones'
        },
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop'],
        description: 'Smartphone haut de gamme avec écran AMOLED',
        rating: 4.6,
        reviewCount: 342,
        isBestSeller: true,
        stock: 40,
        tags: ['Android', '5G', '128Go'],
        features: ['Écran 6.7"', '128Go', 'Appareil photo 108MP'],
        seller: 'MobileWorld',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    },
    {
        id: '8',
        name: 'Casque Gaming RGB 7.1 Surround',
        price: 15000,
        currency: '₣',
        category: {
            id: 'cat5',
            name: 'Gaming',
            slug: 'gaming',
            subCategories: []
        },
        subCategory: {
            id: 'sub8',
            name: 'Casques',
            slug: 'casques-gaming'
        },
        images: ['https://images.unsplash.com/photo-1585298723688-8c7e0c7c9383?w=400&h=400&fit=crop'],
        description: 'Casque gaming avec audio surround 7.1 et RGB',
        rating: 4.5,
        reviewCount: 187,
        isBestSeller: false,
        stock: 60,
        tags: ['Gaming', 'RGB', '7.1'],
        features: ['Surround 7.1', 'RGB personnalisable', 'Micro détachable'],
        seller: 'GameTech',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date().toISOString()
    }
];

interface ProductCarouselProps {
    title?: string;
    showViewAll?: boolean;
    products?: Product[];
    maxProducts?: number;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ title = "Produits populaires", showViewAll = true, products = fakeProducts, maxProducts }) => {
    
    const displayedProducts = maxProducts ? products.slice(0, maxProducts) : products;
    const [open, setOpen] = useState(false);
    const [selecteProduct, setSelectedProduct] = useState<Product | null>(null);

    const router = useRouter();
    const params = useParams()

    // Fonction pour formater le prix avec espace insécable
    const formatPrice = (price: number) => {
        return price.toLocaleString('fr-FR').replace(/\s/g, '\u202F');
    };

    const handleBack = () => {
        setOpen(false);
    };

    const handleNegotiate = (product: Product) => {
        console.log('Négociation pour:', product.name);
        // Implémentez votre logique de négociation ici
        alert(`Négociation démarrée pour ${product.name}`);
    };

    const handleOrder = (product: Product) => {
        console.log('Commande pour:', product.name);
        // Implémentez votre logique de commande ici
        router.push(`/checkout?product=${product.id}`);
    };

    const openDetail = (items: Product) => {
        setSelectedProduct(items)
        setOpen(true)
    };

    return (
        <div className="mt-6">

            {/* En-tête avec titre et bouton "Voir tout " */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">
                    {title}
                </h2>
                {showViewAll && (
                    <Link href="/liste-product"  className="flex items-center gap-1 text-sm text-cyan-700 dark:text-cyan-400 font-medium hover:text-cyan-800 dark:hover:text-cyan-300 transition-colors">
                        Voir tout
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-4 h-4" >
                            <path d="m9 18 6-6-6-6"></path>
                        </svg>
                    </Link>
                )}
            </div>

            {/* Conteneur de scroll horizontal */}

            <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden  [scrollbar-width:none]">
                    {displayedProducts.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-[160px] cursor-pointer group">
                            {/* Carte produit */}
                            <div  onClick={() => {openDetail(product)  }} className="dark:bg-slate-800 rounded-2xl overflow-hidden transition-shadow duration-300">
                                {/* Image du produit */}
                                <div  className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                                    {product.images && product.images[0] ? (
                                        <img src={typeof product.images[0] === 'string' ? product.images[0] : ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12"  >
                                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                                <circle cx="9" cy="9" r="2"></circle>
                                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                            </svg>
                                        </div>
                                    )}

                                    {/* Badge best-seller */}
                                    {product.isBestSeller && (
                                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                            Best-seller
                                        </div>
                                    )}

                                    {/* Badge stock limité */}
                                    {product.stock < 10 && product.stock > 0 && (
                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                            Stock limité
                                        </div>
                                    )}
                                </div>

                                {/* Informations du produit */}
                                <div className="p-3">
                                    {/* Nom du produit */}
                                    <h3 className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight mb-2 min-h-[2.5rem]">
                                        {product.name}
                                    </h3>

                                    {/* Note et avis */}
                                    <div className="flex items-center gap-1 mb-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"  >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                        {/* <span className="text-xs text-slate-600 dark:text-slate-400">
                                            ({product.reviewCount})
                                        </span> */}
                                    </div>

                                    {/* Prix */}
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                            {formatPrice(product.price)} {product.currency}
                                        </span>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <span className="text-xs text-slate-500 dark:text-slate-400 line-through">
                                                {formatPrice(product.originalPrice)} {product.currency}
                                            </span>
                                        )}
                                    </div>

                                    {/* Vendeur */}
                                    {/* {product.seller && (
                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">
                                            Par {product.seller}
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Flèches de navigation (optionnelles) */}
                <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile">
                <ProductDetail product={selecteProduct}  onBack={handleBack}  onNegotiate={handleNegotiate}  onOrder={handleOrder} />
            </MyModal>

        </div>
    );
};

export default ProductCarousel;