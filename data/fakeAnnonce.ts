// fakeAnnonce.ts
import { Annonce, Amenity, categoriesAnnonce } from "@/types/interfaces";
import { fakeUsers } from "./fakeServices";

// ================= CATÉGORIES DISPONIBLES =================
export const LiestcategoriesAnnonce: categoriesAnnonce[] = [
    { id: "1", value: "Appartement", label: "Appartement" },
    { id: "2", value: "Maison", label: "Maison" },
    { id: "3", value: "Villa", label: "Villa" },
    { id: "4", value: "Studio", label: "Studio" },
    { id: "5", value: "Chambre", label: "Chambre" },
    { id: "6", value: "Bureau", label: "Bureau" },
    { id: "7", value: "Terrain", label: "Terrain" },
    { id: "8", value: "Autre", label: "Autre" },
];

// ================= ÉQUIPEMENTS DISPONIBLES =================
export const availableAmenities: Amenity[] = [
    { id: "1", label: "Wi-Fi", icon: "immo/wifi.svg" },
    { id: "2", label: "Parking", icon: "immo/parking_grey.svg" },
    { id: "3", label: "Télévision", icon: "immo/tv.svg" },
    { id: "4", label: "Climatisation", icon: "immo/air-conditioning.svg" },
    { id: "5", label: "Cuisine équipée", icon: "immo/mini-bar.svg" },
    { id: "6", label: "Cafetière", icon: "immo/coffee.svg" },
    { id: "7", label: "Salle de sport", icon: "immo/gym.svg" },
    { id: "8", label: "Piscine", icon: "immo/pool.svg" },
    { id: "9", label: "Jacuzzi", icon: "immo/jacuzzi.svg" },
    { id: "10", label: "Terrasse", icon: "immo/terrace.svg" },
    { id: "11", label: "Jardin", icon: "immo/garden_grey.svg" },
    { id: "12", label: "Animaux acceptés", icon: "immo/pets.svg" },
    { id: "13", label: "Chauffage", icon: "immo/heating.svg" },
    { id: "14", label: "Lave-linge", icon: "immo/washing-machine.svg" },
    { id: "15", label: "Sèche-linge", icon: "immo/dryer.svg" },
    { id: "16", label: "Petit-déjeuner inclus", icon: "immo/breakfast.svg" },
    { id: "17", label: "Room service", icon: "immo/room-service.svg" },
    { id: "18", label: "Spa", icon: "immo/spa.svg" },
    { id: "19", label: "Sauna", icon: "immo/sauna.svg" },
    { id: "20", label: "Barbecue", icon: "immo/bbq.svg" },
    { id: "21", label: "Ascenseur", icon: "immo/appartements_grey.svg" },
    { id: "22", label: "Garde", icon: "immo/security.svg" },
    { id: "23", label: "Buanderie", icon: "immo/concierge.svg" },
    { id: "24", label: "Garage", icon: "immo/garage.svg" },
    { id: "25", label: "Eau chaude", icon: "immo/heating.svg" },
    { id: "26", label: "Home cinema", icon: "immo/home-cinema.svg" },
    { id: "27", label: "Minibar", icon: "immo/mini-bar.svg" },
    { id: "28", label: "Balcon", icon: "immo/terrace.svg" },
    { id: "29", label: "Vue mer", icon: "immo/sea-view.svg" },
    { id: "30", label: "Vue montagne", icon: "immo/mountain-view.svg" },
    { id: "31", label: "Cheminée", icon: "immo/fireplace.svg" },
    { id: "32", label: "Bureau", icon: "immo/desk.svg" },
    { id: "33", label: "Salle de réunion", icon: "immo/meeting-room.svg" },
];

// ================= DONNÉES D'ANNONCES =================
export const fakeAnnonce: Annonce[] = [
    {
        id: "1",
        title: "STUDIO EMIRATES STADIUM",
        category: { id: "1", value: "Studio", label: "Studio" },
        categoryId: "1",
        location: "Cocody Angré, Appart'hôtel Mavie's Home",
        price: 20000,
        rating: 4,
        capacity: 2,
        rooms: 1,
        beds: 1,
        certifiedAt: "17 Déc 2024",
        description: "Studio moderne meublé à Cocody Angré avec kitchenette et salle d'eau privative. Connexion Wi-Fi gratuite.",
        amenities: [
            { id: "1", label: "Wi-Fi", icon: "immo/wifi.svg" },
            { id: "2", label: "Climatisation", icon: "immo/air-conditioning.svg" },
            { id: "3", label: "Cuisine équipée", icon: "immo/mini-bar.svg" },
            { id: "4", label: "TV", icon: "immo/tv.svg" },
        ],
        images: ["/immo/imm1.jpeg", "/immo/imm2.jpeg", "/immo/imm3.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Studio", description: "Studio moderne meublé à Cocody Angré avec kitchenette et salle d'eau privative. Connexion Wi-Fi gratuite." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
    {
        id: "2",
        title: "APPARTEMENT MODERNE PLATEAU",
        category: { id: "2", value: "Appartement", label: "Appartement" },
        categoryId: "2",
        location: "Plateau, Immeuble Les Harmonies",
        price: 35000,
        rating: 5,
        capacity: 4,
        rooms: 3,
        beds: 2,
        certifiedAt: "15 Jan 2024",
        description: "Appartement spacieux et lumineux au cœur du Plateau. Vue imprenable sur la lagune.",
        amenities: [
            { id: "1", label: "Wi-Fi", icon: "immo/wifi.svg" },
            { id: "2", label: "Piscine", icon: "immo/pool.svg" },
            { id: "3", label: "Parking", icon: "immo/parking_grey.svg" },
            { id: "4", label: "Ascenseur", icon: "immo/appartements_grey.svg" },
        ],
        images: ["/immo/imm3.jpeg", "/immo/imm4.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Appartement", description: "Appartement spacieux et lumineux au cœur du Plateau. Vue imprenable sur la lagune." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
    {
        id: "3",
        title: "VILLA LUXE MARCORY",
        category: { id: "3", value: "Villa", label: "Villa" },
        categoryId: "3",
        location: "Marcory Résidence, Villa Les Palmiers",
        price: 80000,
        rating: 4,
        capacity: 6,
        rooms: 4,
        beds: 3,
        certifiedAt: "20 Fév 2024",
        description: "Magnifique villa avec jardin privatif et piscine. Quartier résidentiel calme et sécurisé.",
        amenities: [
            { id: "1", label: "Piscine", icon: "immo/pool.svg" },
            { id: "2", label: "Jardin", icon: "immo/garden_grey.svg" },
            { id: "3", label: "Garde", icon: "immo/security.svg" },
            { id: "4", label: "Buanderie", icon: "immo/concierge.svg" },
        ],
        images: ["/immo/imm2.jpeg", "/immo/imm3.jpeg", "/immo/imm4.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Villa", description: "Villa avec jardin privatif et piscine. Quartier résidentiel calme et sécurisé." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
    {
        id: "4",
        title: "CHAMBRE HÔTEL YOPOUGON",
        category: { id: "4", value: "Chambre", label: "Chambre" },
        categoryId: "4",
        location: "Yopougon Sicogi, Hôtel Le Comfort",
        price: 12000,
        rating: 3,
        capacity: 2,
        rooms: 1,
        beds: 1,
        certifiedAt: "10 Mar 2024",
        description: "Chambre confortable pour courts séjours. Proche des transports et commerces.",
        amenities: [
            { id: "1", label: "Wi-Fi", icon: "immo/wifi.svg" },
            { id: "2", label: "Petit déjeuner", icon: "immo/breakfast.svg" },
        ],
        images: ["/immo/imm1.jpeg", "/immo/imm2.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Chambre", description: "Chambre confortable pour courts séjours. Proche des transports et commerces." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
    {
        id: "5",
        title: "LOFT DESIGN TREICHVILLE",
        category: { id: "5", value: "Loft", label: "Loft" },
        categoryId: "5",
        location: "Treichville, Espace Artistique",
        price: 45000,
        rating: 4,
        capacity: 3,
        rooms: 1,
        beds: 2,
        certifiedAt: "05 Avr 2024",
        description: "Loft industriel transformé en espace de vie unique. Décoration soignée.",
        amenities: [
            { id: "1", label: "Wi-Fi", icon: "immo/wifi.svg" },
            { id: "2", label: "Terrasse", icon: "immo/terrace.svg" },
            { id: "3", label: "Home cinema", icon: "immo/tv.svg" },
        ],
        images: ["/immo/imm3.jpeg", "/immo/imm4.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Loft", description: "Loft industriel transformé en espace de vie unique. Décoration soignée." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
    {
        id: "6",
        title: "MAISON BINGERVILLE",
        category: { id: "6", value: "Maison", label: "Maison" },
        categoryId: "6",
        location: "Bingerville, Quartier Résidentiel",
        price: 55000,
        rating: 4,
        capacity: 5,
        rooms: 3,
        beds: 3,
        certifiedAt: "12 Mai 2024",
        description: "Maison traditionnelle rénovée avec charme. Grand jardin arboré.",
        amenities: [
            { id: "1", label: "Jardin", icon: "immo/garden_grey.svg" },
            { id: "2", label: "Garage", icon: "immo/garage.svg" },
            { id: "3", label: "Climatisation", icon: "immo/air-conditioning.svg" },
        ],
        images: ["/immo/imm4.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Maison", description: "Maison traditionnelle rénovée avec charme. Grand jardin arboré." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
    {
        id: "7",
        title: "APPART T2 RIVIERA",
        category: { id: "5", value: "Appartement", label: "Appartement" },
        categoryId: "5",
        location: "Riviera Palmeraie, Résidence Les Cocotiers",
        price: 28000,
        rating: 4,
        capacity: 3,
        rooms: 2,
        beds: 2,
        certifiedAt: "18 Juin 2024",
        description: "Appartement moderne dans résidence sécurisée avec piscine et espace fitness.",
        amenities: [
            { id: "1", label: "Piscine", icon: "immo/pool.svg" },
            { id: "2", label: "Salle de sport", icon: "immo/gym.svg" },
            { id: "3", label: "Wi-Fi", icon: "immo/wifi.svg" },
        ],
        images: ["/immo/imm1.jpeg", "/immo/imm2.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Appartement", description: "Appartement moderne dans résidence sécurisée avec piscine et espace fitness." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
    {
        id: "8",
        title: "STUDIO UNIVERSITAIRE",
        category: { id: "6", value: "Studio", label: "Studio" },
        categoryId: "6",
        location: "Cocody, près de l'Université",
        price: 15000,
        rating: 3,
        capacity: 1,
        rooms: 1,
        beds: 1,
        certifiedAt: "22 Juil 2024",
        description: "Studio économique idéal pour étudiants. Proche des facultés et des transports.",
        amenities: [
            { id: "1", label: "Wi-Fi", icon: "immo/wifi.svg" },
            { id: "2", label: "Eau chaude", icon: "immo/heating.svg" },
        ],
        images: ["/immo/imm1.jpeg", "/immo/imm2.jpeg"],
        typeId: "1",
        type: { id: "1", label: "Studio", description: "Studio économique idéal pour étudiants. Proche des facultés et des transports." },
        review: {
            id: "1",
            author: "Korotoum Bakayoko",
            rating: 4,
            comment: "Très beau studio surtout confortable !",
        },
        gpsLocation: {
            lat: 48.833,
            lng: 2.387,
            country: "FR",
            city: "PARIS",
            district: "PARIS-12",
            street: "BERCY"
        },
        provider: fakeUsers[0],
        providerId: "1"
    },
];

// Extraire toutes les catégories uniques des annonces
export const allCategoriesFromAnnonces = Array.from(
    new Set(fakeAnnonce.map(annonce => annonce.category))
);

// Extraire tous les équipements uniques des annonces
export const allAmenitiesFromAnnonces = Array.from(
    new Set(
        fakeAnnonce.flatMap(annonce =>
            annonce.amenities?.map(amenity => amenity.label) || []
        )
    )
);

// Fonction pour trouver une annonce par ID
export const findAnnonceById = (id: string): Annonce | undefined => {
    return fakeAnnonce.find(annonce => annonce.id === id);
};

