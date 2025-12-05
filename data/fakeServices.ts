import { User, Service, Role, AccountType, ServiceType, Icone, ServiceCategory, ServiceSubcategory, Appointment, OrderItem, UserSubcategory, AppointmentStatus, UserStatus, } from "@/types/interfaces";

// ===============================
// 📦 FAKE ICONES
// ===============================
export const fakeIcones: Icone[] = [
    {
        id: "icn-1",
        name: "Nettoyage",
        description: "Icône pour les services de nettoyage",
        iconUrl: "/icons/icons8-housekeeping-94.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "icn-2",
        name: "Jardinage",
        description: "Icône pour les services de jardinage",
        iconUrl: "/icons/icons8-yard-work-50.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "icn-3",
        name: "Peinture",
        description: "Icône pour les services de peinture",
        iconUrl: "/icons/icons8-paint-32.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "icn-4",
        name: "Livraison",
        description: "Icône pour les services de livraison",
        iconUrl: "/icons/icons8-food-service-64.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "icn-5",
        name: "Informatique",
        description: "Icône pour les services informatiques",
        iconUrl: "/icons/icons8-multiple-devices-94.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "icn-6",
        name: "Menage",
        description: "Icône pour les services de menage",
        iconUrl: "/icons/icons8-trowel-48.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "icn-7",
        name: "Electricité",
        description: "Icône pour les services de electricité",
        iconUrl: "/icons/icons8-trowel-48.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "icn-8",
        name: "Reparation",
        description: "Icône pour les services de reparation",
        iconUrl: "/icons/icons8-trowel-48.png",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

];

// ===============================
// 🏷️ FAKE CATEGORIES / SUBCATEGORIES
// ===============================
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

// ===============================
// 👤 USERS
// ===============================


export const fakeUsers: User[] = [
    {
        id: "user-1",
        email: "alice.pro@example.com",
        name: "Alice Dupont",
        phone: "+33612345678",
        typeCompte: AccountType.INDIVIDUAL,
        roles: Role.PROVIDER,
        status: UserStatus.ACTIVE,
        companyName: "Alice Services",
        serviceType: ServiceType.MIXED,
        selectedCategories: [
            {
                id: "cat-1",
                userId: "user-1",
                categoryId: "cat-1",
                category: fakeCategories[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: "cat-2",
                userId: "user-1",
                categoryId: "cat-2",
                category: fakeCategories[1],
                createdAt: new Date().toISOString(),
            },
        ],
        selectedSubcategories: [
            {
                id: "sub-1",
                userId: "user-1",
                subcategoryId: "sub-1",
                subcategory: fakeSubcategories[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: "sub-2",
                userId: "user-1",
                subcategoryId: "sub-2",
                subcategory: fakeSubcategories[1],
                createdAt: new Date().toISOString(),
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "user-2",
        email: "bob.enterprise@example.com",
        name: "Bob Martin",
        phone: "+33698765432",
        typeCompte: AccountType.SELLER,
        status: UserStatus.ACTIVE,
        roles: Role.PROVIDER,
        companyName: "Martin Solutions",
        serviceType: ServiceType.MIXED,
        selectedCategories: [
            {
                id: "cat-1",
                userId: "user-2",
                categoryId: "cat-1",
                category: fakeCategories[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: "cat-2",
                userId: "user-2",
                categoryId: "cat-2",
                category: fakeCategories[1],
                createdAt: new Date().toISOString(),
            },
        ],
        selectedSubcategories: [
            {
                id: "sub-3",
                userId: "user-2",
                subcategoryId: "sub-3",
                subcategory: fakeSubcategories[2],
                createdAt: new Date().toISOString(),
            },
            {
                id: "sub-4",
                userId: "user-2",
                subcategoryId: "sub-4",
                subcategory: fakeSubcategories[3],
                createdAt: new Date().toISOString(),
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "user-3",
        email: "alice.pro@example.com",
        name: "Alice Dupont",
        phone: "+33612345678",
        typeCompte: AccountType.INDIVIDUAL,
        status: UserStatus.INACTIVE,
        roles: Role.CLIENT,
        companyName: "Alice Services",
        serviceType: ServiceType.MIXED,
        selectedCategories: [
            {
                id: "cat-1",
                userId: "user-3",
                categoryId: "cat-1",
                category: fakeCategories[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: "cat-2",
                userId: "user-3",
                categoryId: "cat-2",
                category: fakeCategories[1],
                createdAt: new Date().toISOString(),
            },
        ],
        selectedSubcategories: [
            {
                id: "sub-1",
                userId: "user-3",
                subcategoryId: "sub-1",
                subcategory: fakeSubcategories[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: "sub-2",
                userId: "user-3",
                subcategoryId: "sub-2",
                subcategory: fakeSubcategories[1],
                createdAt: new Date().toISOString(),
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: "user-4",
        email: "bob.enterprise@example.com",
        name: "Bob Martin",
        phone: "+33698765432",
        typeCompte: AccountType.SELLER,
        status: UserStatus.BLOCKED,
        roles: Role.PROVIDER,
        companyName: "Martin Solutions",
        serviceType: ServiceType.MIXED,
        selectedCategories: [
            {
                id: "cat-1",
                userId: "user-4",
                categoryId: "cat-1",
                category: fakeCategories[0],
                createdAt: new Date().toISOString(),
            },
            {
                id: "cat-2",
                userId: "user-4",
                categoryId: "cat-2",
                category: fakeCategories[1],
                createdAt: new Date().toISOString(),
            },
        ],
        selectedSubcategories: [
            {
                id: "sub-3",
                userId: "user-4",
                subcategoryId: "sub-3",
                subcategory: fakeSubcategories[2],
                createdAt: new Date().toISOString(),
            },
            {
                id: "sub-4",
                userId: "user-4",
                subcategoryId: "sub-4",
                subcategory: fakeSubcategories[3],
                createdAt: new Date().toISOString(),
            },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// ===============================
// ⚙️ SERVICES (6 total)
// ===============================
export const fakeServices: Service[] = [
    {
        id: "srv-1",
        title: "Nettoyage automobile complet",
        description: "Service de lavage intérieur et extérieur pour véhicules.",
        pinned: true,
        providerId: "user-1",
        serviceType: ServiceType.APPOINTMENT,
        basePriceCents: 2500,
        categoryId: "cat-1",
        subcategoryId: "sub-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: fakeUsers[0],
        // ✅ NEW LOCATION
        location: {
            lat: 48.842,
            lng: 2.321,
            country: "FR",
            city: "PARIS",
            district: "PARIS-15",
            street: "MONTPARNASSE"
        },

        iconId: "icn-1",
        icone: fakeIcones[0],
        images: "/Entretien.jpg",

        category: fakeCategories[0],
        subcategory: fakeSubcategories[0],

        appointments: [],
        orderItems: [],
        userLinks: [],
    },

    {
        id: "srv-2",
        title: "Entretien de jardin",
        description: "Tonte, arrosage et entretien complet de votre jardin.",
        pinned: false,
        providerId: "user-1",
        serviceType: ServiceType.APPOINTMENT,
        basePriceCents: 4000,
        categoryId: "cat-1",
        subcategoryId: "sub-2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: fakeUsers[0],
        location: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },

        iconId: "icn-2",
        icone: fakeIcones[1],
        images: "/Entretien.jpg",

        category: fakeCategories[0],
        subcategory: fakeSubcategories[1],

        appointments: [],
        orderItems: [],
        userLinks: [],
    },

    {
        id: "srv-3",
        title: "Peinture murale intérieure",
        description: "Rénovation et peinture des murs intérieurs avec finitions pro.",
        pinned: false,
        providerId: "user-1",
        serviceType: ServiceType.ORDER,
        basePriceCents: 7500,
        categoryId: "cat-1",
        subcategoryId: "sub-1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: fakeUsers[1],

        location: {
            lat: 45.760,
            lng: 4.858,
            country: "FR",
            city: "LYON",
            district: "LYON-3",
            street: "PART-DIEU"
        },

        iconId: "icn-3",
        icone: fakeIcones[2],
        images: "/Entretien.jpg",

        category: fakeCategories[0],
        subcategory: fakeSubcategories[0],

        appointments: [],
        orderItems: [],
        userLinks: [],
    },

    {
        id: "srv-4",
        title: "Livraison express locale",
        description: "Livraison rapide de colis en zone urbaine (20 km).",
        pinned: false,
        providerId: "user-2",
        serviceType: ServiceType.PRODUCT,
        basePriceCents: 1500,
        categoryId: "cat-2",
        subcategoryId: "sub-3",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: fakeUsers[1],

        location: {
            lat: 44.847,
            lng: -0.573,
            country: "FR",
            city: "BORDEAUX",
            district: "BORDEAUX-CENTRE",
            street: "CHARTRONS"
        },

        iconId: "icn-4",
        icone: fakeIcones[3],
        images: "/Entretien.jpg",

        category: fakeCategories[1],
        subcategory: fakeSubcategories[2],

        appointments: [],
        orderItems: [],
        userLinks: [],
    },

    {
        id: "srv-5",
        title: "Maintenance informatique",
        description: "Diagnostic et réparation d’ordinateurs à domicile ou en entreprise.",
        pinned: false,
        providerId: "user-2",
        serviceType: ServiceType.APPOINTMENT,
        basePriceCents: 6500,
        categoryId: "cat-2",
        subcategoryId: "sub-4",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: fakeUsers[1],

        location: {
            lat: 44.870,
            lng: -0.550,
            country: "FR",
            city: "BORDEAUX",
            district: "BORDEAUX-NORD",
            street: "BACALAN"
        },

        iconId: "icn-5",
        icone: fakeIcones[4],
        images: "/Entretien.jpg",

        category: fakeCategories[1],
        subcategory: fakeSubcategories[3],

        appointments: [],
        orderItems: [],
        userLinks: [],
    },

    {
        id: "srv-6",
        title: "Formation bureautique",
        description: "Cours personnalisés sur Excel, Word et PowerPoint.",
        pinned: false,
        providerId: "user-2",
        serviceType: ServiceType.MIXED,
        basePriceCents: 12000,
        categoryId: "cat-1",
        subcategoryId: "sub-4",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: fakeUsers[0],

        location: {
            lat: 43.604,
            lng: 1.444,
            country: "FR",
            city: "TOULOUSE",
            district: "TOULOUSE-CENTRE",
            street: "CAPITOLE"
        },

        iconId: "icn-6",
        icone: fakeIcones[5],
        images: "/Entretien.jpg",

        category: fakeCategories[1],
        subcategory: fakeSubcategories[3],

        appointments: [],
        orderItems: [],
        userLinks: [],
    },

    {
        id: "srv-7",
        title: "Formation bureautique",
        description: "Cours personnalisés sur Excel, Word et PowerPoint.",
        pinned: false,
        providerId: "user-2",
        serviceType: ServiceType.MIXED,
        basePriceCents: 12000,
        categoryId: "cat-1",
        subcategoryId: "sub-4",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        provider: fakeUsers[0],

        location: {
            lat: 43.604,
            lng: 1.444,
            country: "FR",
            city: "TOULOUSE",
            district: "TOULOUSE-CENTRE",
            street: "CAPITOLE"
        },

        iconId: "icn-6",
        icone: fakeIcones[5],
        images: "/Entretien.jpg",

        category: fakeCategories[1],
        subcategory: fakeSubcategories[3],

        appointments: [],
        orderItems: [],
        userLinks: [],
    },
];


// ===============================
// 📅 FAKE APPOINTMENTS
// ===============================

export const fakeAppointments: Appointment[] = [
    {
        id: "apt-1",
        serviceId: "srv-1",
        providerId: "user-1",
        clientId: "user-2",
        client: fakeUsers[1],
        transactionId: undefined,
        scheduledAt: "2025-11-05T09:00:00.000Z",
        time: "09h00",
        durationMins: 45,
        priceCents: 2500,
        status: AppointmentStatus.PENDING,
        providerNotes: "Client souhaite un nettoyage intérieur approfondi.",
        service: fakeServices[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "apt-2",
        serviceId: "srv-2",
        providerId: "user-1",
        clientId: "user-2",
        client: fakeUsers[1],
        transactionId: undefined,
        scheduledAt: "2025-11-06T14:30:00.000Z",
        time: "14h30",
        durationMins: 60,
        priceCents: 4000,
        status: AppointmentStatus.CONFIRMED,
        providerNotes: "Jardin de 50m², prévoir outils.",
        service: fakeServices[1],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "apt-3",
        serviceId: "srv-5",
        providerId: "user-2",
        clientId: "user-1",
        client: fakeUsers[0],
        transactionId: undefined,
        scheduledAt: "2025-11-07T11:00:00.000Z",
        time: "11h00",
        durationMins: 90,
        priceCents: 6500,
        status: AppointmentStatus.REJECTED,
        providerNotes: "Client indisponible — reprogrammation demandée.",
        service: fakeServices[4],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "apt-4",
        serviceId: "srv-6",
        providerId: "user-2",
        clientId: "user-1",
        client: fakeUsers[0],
        transactionId: undefined,
        scheduledAt: "2025-11-08T10:00:00.000Z",
        time: "10h00",
        durationMins: 120,
        priceCents: 12000,
        status: AppointmentStatus.COMPLETED,
        providerNotes: "Cours sur Excel – niveau intermédiaire.",
        service: fakeServices[5],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },

    {
        id: "apt-5",
        serviceId: "srv-3",
        providerId: "user-1",
        clientId: "user-2",
        client: fakeUsers[1],
        transactionId: undefined,
        scheduledAt: "2025-11-09T15:45:00.000Z",
        time: "15h45",
        durationMins: 120,
        priceCents: 7500,
        status: AppointmentStatus.CANCELLED,
        providerNotes: "Travaux reportés pour raison météo.",
        service: fakeServices[2],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

