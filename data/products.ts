import { Product, ServiceType } from "@/types/interfaces";


export const categories = [
    {
        id: "1",
        name: "Électronique",
        slug: "electronique",
        subCategories: [
            { id: "1-1", name: "Smartphones", slug: "smartphones" },
            { id: "1-2", name: "Accessoires", slug: "accessoires-electronique" },
            { id: "1-3", name: "Audio", slug: "audio" },
            { id: "1-4", name: "Gaming", slug: "gaming" }
        ]
    },
    {
        id: "2",
        name: "Mode & Accessoires",
        slug: "mode-accessoires",
        subCategories: [
            { id: "2-1", name: "Vêtements", slug: "vetements" },
            { id: "2-2", name: "Chaussures", slug: "chaussures" },
            { id: "2-3", name: "Sacs", slug: "sacs" },
            { id: "2-4", name: "Bijoux", slug: "bijoux" }
        ]
    },
    {
        id: "3",
        name: "Maison & Jardin",
        slug: "maison-jardin",
        subCategories: [
            { id: "3-1", name: "Décoration", slug: "decoration" },
            { id: "3-2", name: "Literie", slug: "literie" },
            { id: "3-3", name: "Cuisine", slug: "cuisine" },
            { id: "3-4", name: "Jardinage", slug: "jardinage" }
        ]
    },
    {
        id: "4",
        name: "Beauté & Santé",
        slug: "beaute-sante",
        subCategories: [
            { id: "4-1", name: "Parfums", slug: "parfums" },
            { id: "4-2", name: "Soins Visage", slug: "soins-visage" },
            { id: "4-3", name: "Maquillage", slug: "maquillage" },
            { id: "4-4", name: "Accessoires Beauté", slug: "accessoires-beaute" }
        ]
    },
    {
        id: "5",
        name: "Sports & Loisirs",
        slug: "sports-loisirs",
        subCategories: [
            { id: "5-1", name: "Vélos", slug: "velos" },
            { id: "5-2", name: "Fitness", slug: "fitness" },
            { id: "5-3", name: "Camping", slug: "camping" },
            { id: "5-4", name: "Sports Collectifs", slug: "sports-collectifs" }
        ]
    }
];

export const products: Product[] = [
    // BEST-SELLERS
    {
        id: "bs-001",
        name: "Manette de Jeu Bluetooth PS5",
        price: 800,
        currency: "FCFA",
        category: { id: "1", name: "Électronique", slug: "electronique", subCategories: [] },
        subCategory: { id: "1-4", name: "Gaming", slug: "gaming" },
        images: ["/slider/slider2.jpg"],
        description: "Manette de jeu sans fil compatible PS5 et PC, avec retour haptique et triggers adaptatifs.",
        rating: 4.8,
        reviewCount: 1247,
        isBestSeller: true,
        stock: 45,
        tags: ["gaming", "bluetooth", "ps5", "sans-fil"],
        features: ["Retour haptique", "Triggers adaptatifs", "Batterie 12h", "Charge USB-C"],
        seller: "GameTech Store",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-01-15"
    },
    {
        id: "bs-002",
        name: "Brume Parfumée Sunny Vibes",
        price: 800,
        currency: "FCFA",
        category: { id: "4", name: "Beauté & Santé", slug: "beaute-sante", subCategories: [] },
        subCategory: { id: "4-1", name: "Parfums", slug: "parfums" },
        images: ["/avatars/user1.png"],
        description: "Brume parfumée aux notes d'agrumes et de fleurs blanches pour une ambiance ensoleillée.",
        rating: 4.6,
        reviewCount: 892,
        isBestSeller: true,
        stock: 120,
        tags: ["brume", "parfum", "maison", "ambiance"],
        features: ["Notes d'agrumes", "Durée 6-8h", "100ml", "Vegan"],
        seller: "BeautyHome",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-02-10"
    },
    {
        id: "bs-003",
        name: "Draps Coton 200 Fils Reine",
        price: 5000,
        currency: "FCFA",
        category: { id: "3", name: "Maison & Jardin", slug: "maison-jardin", subCategories: [] },
        subCategory: { id: "3-2", name: "Literie", slug: "literie" },
        images: ["/avatars/user2.png"],
        description: "Set de draps en coton égyptien 200 fils, taille reine, couleur blanc cassé.",
        rating: 4.7,
        reviewCount: 1563,
        isBestSeller: true,
        stock: 28,
        tags: ["draps", "coton", "literie", "chambre"],
        features: ["Coton égyptien", "200 fils", "Taille reine", "Lavable 60°C"],
        seller: "HomeComfort",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-01-22"
    },
    {
        id: "bs-004",
        name: "Adaptateur USB-C Multiport 7-en-1",
        price: 7000,
        currency: "FCFA",
        category: { id: "1", name: "Électronique", slug: "electronique", subCategories: [] },
        subCategory: { id: "1-2", name: "Accessoires", slug: "accessoires-electronique" },
        images: ["/avatars/user3.png"],
        description: "Adaptateur USB-C avec ports HDMI, USB 3.0, Ethernet, SD et charge rapide PD 100W.",
        rating: 4.5,
        reviewCount: 2104,
        isBestSeller: true,
        stock: 67,
        tags: ["usb-c", "adaptateur", "multiport", "macbook"],
        features: ["HDMI 4K", "USB 3.0", "Ethernet", "Charge 100W"],
        seller: "TechGadgets",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-03-05"
    },

    // PRODUITS VÉLO
    {
        id: "sp-001",
        name: "Vélo Électrique Tout Terrain",
        price: 40000,
        originalPrice: 45000,
        currency: "FCFA",
        category: { id: "5", name: "Sports & Loisirs", slug: "sports-loisirs", subCategories: [] },
        subCategory: { id: "5-1", name: "Vélos", slug: "velos" },
        images: ["/avatars/user4.png"],
        description: "Vélo électrique tout terrain avec moteur 250W, autonomie 60km et suspension avant.",
        rating: 4.9,
        reviewCount: 567,
        isBestSeller: false,
        stock: 12,
        tags: ["vélo", "électrique", "tout-terrain", "eco"],
        features: ["Moteur 250W", "Autonomie 60km", "Suspension avant", "Pliable"],
        seller: "yango service",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-02-28"
    },

    // AUTRES PRODUITS POPULAIRES
    {
        id: "el-001",
        name: "Smartphone Android 128GB",
        price: 120000,
        originalPrice: 150000,
        currency: "FCFA",
        category: { id: "1", name: "Électronique", slug: "electronique", subCategories: [] },
        subCategory: { id: "1-1", name: "Smartphones", slug: "smartphones" },
        images: ["/avatars/user1.png"],
        description: "Smartphone Android avec écran 6.5\", 128GB storage, triple caméra et batterie 5000mAh.",
        rating: 4.4,
        reviewCount: 3120,
        isBestSeller: true,
        stock: 23,
        tags: ["smartphone", "android", "128gb", "4g"],
        features: ["Écran 6.5\"", "128GB", "Triple caméra", "5000mAh"],
        seller: "MobileWorld",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-01-10"
    },
    {
        id: "mo-001",
        name: "Sac à Main Cuir Végan",
        price: 15000,
        currency: "FCFA",
        category: { id: "2", name: "Mode & Accessoires", slug: "mode-accessoires", subCategories: [] },
        subCategory: { id: "2-1", name: "Sacs", slug: "sacs" },
        images: ["/avatars/user2.png"],
        description: "Sac à main en cuir végan, compartiment intérieur spacieux, fermeture zip.",
        rating: 4.3,
        reviewCount: 845,
        isBestSeller: true,
        stock: 34,
        tags: ["sac", "cuir", "végan", "mode"],
        features: ["Cuir végan", "Compartiments multiples", "Bandoulière ajustable"],
        seller: "FashionStyle",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-03-12"
    },
    {
        id: "ma-001",
        name: "Set de Casseroles Anti-adhésives",
        price: 25000,
        originalPrice: 30000,
        currency: "FCFA",
        category: { id: "3", name: "Maison & Jardin", slug: "maison-jardin", subCategories: [] },
        subCategory: { id: "3-3", name: "Cuisine", slug: "cuisine" },
        images: ["/avatars/user3.png"],
        description: "Set de 5 casseroles et poêles anti-adhésives avec revêtement céramique.",
        rating: 4.6,
        reviewCount: 1123,
        isBestSeller: true,
        stock: 18,
        tags: ["cuisine", "casseroles", "anti-adhésif", "set"],
        features: ["5 pièces", "Revêtement céramique", "Poignées bakélite", "Compatible induction"],
        seller: "KitchenPro",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: "2024-02-15"
    }
];


// fakeData.ts
export const fakeCheckoutData = {
    address: {
        street: "201 Bells Camp",
        city: "ADGER",
        state: "AL",
        zipCode: "35006-2319",
        country: "USA"
    },
    paymentMethod: {
        type: "Visa",
        lastFour: "2377",
        icon: "⚠️"
    },
    orderItems: 2,
    subtotal: 43.32,
    shipping: 0.00,
    total: 43.32,
    deliveryOptions: [
        { id: 'express', name: 'Express delivery', estimated: '1-2 business days' },
        { id: 'standard', name: 'Standard delivery', estimated: '3-5 business days' }
    ]
};

export type DeliveryOption = typeof fakeCheckoutData.deliveryOptions[0];
export type PaymentMethod = typeof fakeCheckoutData.paymentMethod;
export type Address = typeof fakeCheckoutData.address;


// Fonctions utilitaires
export const getBestSellers = (): Product[] => {
    return products.filter(product => product.isBestSeller);
};

export const getProductsByCategory = (categorySlug: string): Product[] => {
    return products.filter(product => {
        const category = categories.find(cat => cat.slug === categorySlug);
        return category && product.category.name === category.name;
    });
};

export const getProductsBySubCategory = (subCategorySlug: string): Product[] => {
    return products.filter(product => {
        const subCategory = categories.flatMap(cat => cat.subCategories).find(sub => sub.slug === subCategorySlug);
        return subCategory && product.subCategory.name === subCategory.name;
    });
};

export const getProductById = (id: string): Product | undefined => {
    return products.find(product => product.id === id);
};

export const getFeaturedProducts = (limit: number = 8): Product[] => {
    return products
        .filter(product => product.rating >= 4.5)
        .slice(0, limit);
};