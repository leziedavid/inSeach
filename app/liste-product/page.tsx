// app/liste-product/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ServiceType } from '@/types/interfaces';
import MyModal from '@/components/modal/MyModal';
import ProductDetail from '@/components/home/ProductDetail';

// Données factices de produits (même que dans ProductCarousel)
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
        description: 'Power bank haute capacité 10000mAh avec charge rapide 37W. Idéal pour voyager, ce power bank vous permet de charger votre téléphone, tablette et autres appareils USB jusqu\'à 2 fois plus rapidement grâce à la technologie de charge rapide 37W. Design compact et élégant avec indicateur LED.',
        rating: 4.5,
        reviewCount: 128,
        isBestSeller: true,
        stock: 50,
        tags: ['Oraimo', 'Power Bank', '10000mAh', 'Charge rapide', 'Portable'],
        features: [
            'Charge rapide 37W',
            'Double port USB',
            'Protection multiple (surintensité, surtension)',
            'Indicateur LED 4 niveaux',
            'Compact et portable'
        ],
        seller: 'TechShop',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-01-15').toISOString()
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
        description: 'Chargeur GaN 33W compact et efficace. Technologie GaN pour un chargeur plus petit, plus léger et plus efficace que les chargeurs traditionnels. Parfait pour les voyages avec sa taille compacte.',
        rating: 4.7,
        reviewCount: 95,
        isBestSeller: true,
        stock: 30,
        tags: ['Oraimo', 'GaN', 'Chargeur rapide', 'Compact'],
        features: [
            'Technologie GaN',
            'Compact et léger',
            'Chargement rapide 33W',
            'Sûr et fiable',
            'Compatible avec la plupart des appareils'
        ],
        seller: 'ElectroPlus',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-02-10').toISOString()
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
        description: 'Hub USB-C 7-en-1 avec multiples ports. Transformez votre port USB-C en un véritable centre de connexion avec 7 ports différents pour tous vos besoins.',
        rating: 4.3,
        reviewCount: 64,
        isBestSeller: false,
        stock: 25,
        tags: ['Oraimo', 'USB-C', 'Hub', 'Adaptateur', 'Multiport'],
        features: [
            '7 ports différents',
            'Sortie 4K HDMI',
            'Lecteur de cartes SD/TF',
            '3 ports USB 3.0',
            'Port Ethernet 1000Mbps',
            'Port de charge USB-C PD',
            'Compact et portable'
        ],
        seller: 'ConnectTech',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-01-20').toISOString()
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
        description: 'Écouteurs sans fil avec réduction de bruit ENC. Profitez d\'une expérience audio immersive avec une réduction de bruit active qui élimine les bruits ambiants.',
        rating: 4.8,
        reviewCount: 210,
        isBestSeller: true,
        stock: 100,
        tags: ['Oraimo', 'Bluetooth', 'ANC', 'Écouteurs', 'Sans fil'],
        features: [
            'ANC actif',
            'Autonomie 30h',
            'Étanche IPX5',
            'Connexion Bluetooth 5.3',
            'Micro intégré avec réduction de bruit',
            'Charge rapide USB-C'
        ],
        seller: 'AudioPro',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-03-05').toISOString()
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
        description: 'Montre connectée avec écran HD 2,01 pouces et étanche IP68. Suivez votre santé et vos activités sportives avec plus de 100 modes de sport.',
        rating: 4.4,
        reviewCount: 156,
        isBestSeller: true,
        stock: 75,
        tags: ['Oraimo', 'Smartwatch', 'Fitness', 'Santé', 'IP68'],
        features: [
            'Écran HD 2,01 pouces',
            'Étanche IP68',
            '100+ modes sport',
            'Suivi santé 24h/24',
            'Autonomie 7 jours',
            'Notifications smartphone',
            'Compatibilité iOS et Android'
        ],
        seller: 'WearTech',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-02-20').toISOString()
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
        description: 'Pack complet pour démarrer en e-commerce avec plus de 200 produits sélectionnés. Formation incluse pour maximiser vos chances de succès.',
        rating: 4.9,
        reviewCount: 89,
        isBestSeller: true,
        stock: 999,
        tags: ['Formation', 'E-commerce', 'Business', 'Dropshipping', 'Startup'],
        features: [
            '200+ produits sélectionnés',
            'Formation complète e-commerce',
            'Support technique dédié',
            'Guide de marketing digital',
            'Accès à la communauté',
            'Mises à jour régulières'
        ],
        seller: 'BusinessAcademy',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-01-05').toISOString()
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
        description: 'Smartphone haut de gamme avec écran AMOLED 6.7 pouces, 128Go de stockage et connectivité 5G. Appareil photo 108MP pour des photos professionnelles.',
        rating: 4.6,
        reviewCount: 342,
        isBestSeller: true,
        stock: 40,
        tags: ['Android', '5G', '128Go', 'Smartphone', 'Haut de gamme'],
        features: [
            'Écran AMOLED 6.7"',
            '128Go de stockage',
            'Appareil photo 108MP',
            'Batterie 5000mAh',
            'Charge rapide 65W',
            'Processeur haut de gamme',
            '5G intégrée'
        ],
        seller: 'MobileWorld',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-03-15').toISOString()
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
        description: 'Casque gaming avec audio surround 7.1 et éclairage RGB personnalisable. Confort optimal pour les sessions de jeu prolongées.',
        rating: 4.5,
        reviewCount: 187,
        isBestSeller: false,
        stock: 60,
        tags: ['Gaming', 'RGB', '7.1', 'Casque', 'Gamer'],
        features: [
            'Audio surround 7.1',
            'Éclairage RGB personnalisable',
            'Micro détachable avec réduction de bruit',
            'Coussinets en mousse mémoire',
            'Compatibilité multiplateforme',
            'Câble détachable'
        ],
        seller: 'GameTech',
        serviceType: [ServiceType.PRODUCT],
        createdAt: new Date('2024-02-28').toISOString()
    }
];

export default function ListeProductPage() {

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fonction pour formater le prix
    const formatPrice = (price: number) => {
        return price.toLocaleString('fr-FR').replace(/\s/g, '\u202F');
    };

    // Filtrer les produits en fonction de la recherche
    const filteredProducts = fakeProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Gérer le clic sur un produit
    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Gérer le retour
    const handleBack = () => {
        setIsModalOpen(false);
    };

    // Gérer la négociation
    const handleNegotiate = (product: Product) => {
        console.log('Négociation pour:', product.name);
        // Implémentez votre logique de négociation ici
        alert(`Négociation démarrée pour ${product.name}`);
    };

    // Gérer la commande
    const handleOrder = (product: Product) => {
        console.log('Commande pour:', product.name);
        // Implémentez votre logique de commande ici
        router.push(`/checkout?product=${product.id}`);
    };

    // Gérer le retour à la page précédente
    const handleGoBack = () => {
        router.push("/");
    };

    return (
        <>
            <div className="overflow-y-auto pt-8 pb-24  bg-[#f8f8f8] dark:bg-slate-900 min-h-screen">
                <div className="mx-auto max-w-lg border-0">
                    <div style={{ opacity: 1 }}>
                        <div className="p-6 pt-0">
                            <div className="pt-2">
                                <div className="pb-24">
                                    {/* En-tête avec bouton retour */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <button type="button"  onClick={handleGoBack}   className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"  >
                                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"   viewBox="0 0 24 24"  fill="none" stroke="currentColor"  strokeWidth="2"   strokeLinecap="round"  strokeLinejoin="round"  className="lucide lucide-arrow-left w-5 h-5 text-slate-600 dark:text-slate-400"  >
                                                <path d="m12 19-7-7 7-7"></path>
                                                <path d="M19 12H5"></path>
                                            </svg>
                                        </button>
                                        <h1 className="text-lg font-medium text-slate-800 dark:text-white">
                                            Tous les produits
                                        </h1>
                                    </div>

                                    {/* Barre de recherche */}
                                    <div className="relative mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24"  height="24"   viewBox="0 0 24 24" fill="none"  stroke="currentColor"   strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500"  >
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <path d="m21 21-4.3-4.3"></path>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Rechercher un produit..."
                                            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700 transition-colors"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    {/* Nombre de résultats */}
                                    <div className="mb-4">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    {/* Grille de produits */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {filteredProducts.map((product) => (
                                            <div key={product.id}>
                                                <div className="cursor-pointer group" onClick={() => handleProductClick(product)} >
                                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                                                        {product.images && product.images[0] ? (
                                                            <img src={typeof product.images[0] === 'string' ? product.images[0] : ''}  alt={product.name}  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"  />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                                <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24" fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="w-12 h-12" >
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
                                                    <div className="pt-2">
                                                        <h3 className="text-xs font-medium text-black dark:text-white line-clamp-2 leading-tight">
                                                            {product.name}
                                                        </h3>
                                                        <div className="flex items-baseline gap-1.5 mt-1">
                                                            <span className="text-sm font-bold text-black dark:text-white">
                                                                {formatPrice(product.price)} {product.currency}
                                                            </span>
                                                            {product.originalPrice && product.originalPrice > product.price && (
                                                                <span className="text-xs text-slate-500 dark:text-slate-400 line-through">
                                                                    {formatPrice(product.originalPrice)} {product.currency}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Message si aucun produit trouvé */}
                                    {filteredProducts.length === 0 && (
                                        <div className="text-center py-12">
                                            <svg  xmlns="http://www.w3.org/2000/svg" width="48"  height="48"   viewBox="0 0 24 24"    fill="none" stroke="currentColor"  strokeWidth="2" strokeLinecap="round"  strokeLinejoin="round"  className="text-slate-400 dark:text-slate-600 mx-auto" >
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <path d="m21 21-4.3-4.3"></path>
                                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                                <line x1="8" y1="11" x2="14" y2="11"></line>
                                            </svg>
                                            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                                                Aucun produit trouvé
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                                Aucun produit ne correspond à votre recherche "{searchTerm}"
                                            </p>
                                            <button onClick={() => setSearchTerm('')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                                Réinitialiser la recherche
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal pour les détails du produit */}
            <MyModal  open={isModalOpen} onClose={() => setIsModalOpen(false)}  mode="mobile" >
                <ProductDetail product={selectedProduct} onBack={handleBack} onNegotiate={handleNegotiate} onOrder={handleOrder}/>
            </MyModal>
        </>
    );
}