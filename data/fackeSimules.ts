// ===========================
// FAKE DATA
// ===========================

import { ServiceCategory, ServiceSubcategory, ServiceType } from "@/types/interfaces";

// ⚙️ Catégories de services simulées
export const fakeCategories: ServiceCategory[] = [
    {
        id: "cat-1",
        name: "Beauté & Bien-être",
        description: "Services de beauté, coiffure, spa et bien-être.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "cat-2",
        name: "Réparations & Bricolage",
        description: "Services de maintenance, réparation et aide à domicile.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "cat-3",
        name: "Éducation & Formation",
        description: "Cours particuliers, soutien scolaire, formations professionnelles.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "cat-4",
        name: "Transport & Livraison",
        description: "Livraisons, déménagements, chauffeurs privés et logistique.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// ⚙️ Sous-catégories simulées
export const fakeSubcategories: ServiceSubcategory[] = [
    // Beauté & Bien-être
    {
        id: "sub-1",
        name: "Coiffure & Barber",
        description: "Coiffure, coupe, brushing, barbe, coloration.",
        categoryId: "cat-1",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "sub-2",
        name: "Massage & Spa",
        description: "Massages relaxants, soins spa et bien-être.",
        categoryId: "cat-1",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    // Réparations & Bricolage
    {
        id: "sub-3",
        name: "Plomberie",
        description: "Installation et réparation de plomberie.",
        categoryId: "cat-2",
        serviceType: [ServiceType.ORDER, ServiceType.MIXED],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "sub-4",
        name: "Électricité",
        description: "Interventions électriques et installations.",
        categoryId: "cat-2",
        serviceType: [ServiceType.ORDER],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    // Éducation & Formation
    {
        id: "sub-5",
        name: "Cours particuliers",
        description: "Soutien scolaire et accompagnement individuel.",
        categoryId: "cat-3",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "sub-6",
        name: "Formation professionnelle",
        description: "Ateliers et formations en entreprise.",
        categoryId: "cat-3",
        serviceType: [ServiceType.MIXED],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    // Transport & Livraison
    {
        id: "sub-7",
        name: "Livraison express",
        description: "Livraison rapide de colis et repas.",
        categoryId: "cat-4",
        serviceType: [ServiceType.ORDER],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "sub-8",
        name: "Chauffeur privé",
        description: "Transport personnalisé et premium.",
        categoryId: "cat-4",
        serviceType: [ServiceType.APPOINTMENT],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
