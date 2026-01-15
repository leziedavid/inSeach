"use client";

import { Star, Home, Building, Eye,Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "../pagination/Paginations";
import { Spinner } from "../forms/spinner/Loader";
import { Amenity, Annonce, User, UserLocation } from "@/types/interfaces";
import ModalDelete from "./ModalDelete";
import MyModal from "../modal/MyModal";
import { MessagesData } from "./Messages";
import { askForUserLocation } from "@/services/location";
import { getMyData } from "@/services/securityService";
import { PinIcon, EditIcon, TrashIcon } from "lucide-react"; // Ajout des icônes manquantes
import AnnonceForm from "../forms/AnnonceForm";
import { toast } from "sonner";
import { createAnnonce, getMyAllAnnonces, updateAnnonce } from "@/services/annonceService";

export default function AnnonceServices() {
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10; // Changé pour correspondre au design
    const [annonces, setAnnonces] = useState<Annonce[]>([]);
    const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [users, setusersData] = useState<User | null>(null);
    const [SelectAnnonce, setSelectAnnonce] = useState<Annonce | null>(null);
    const [open, setOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<UserLocation | null | undefined>(null);
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [msg, setMsg] = useState<MessagesData[]>([]);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState("");


    const fetchAllAnnonce = async () => {
        const response = await getMyAllAnnonces( page, itemsPerPage);
        if (response.statusCode === 200 && response.data) {
            setAnnonces(response.data.data);
            setTotalPages(response.data.total);
        }
    };

    useEffect(() => {
        fetchAllAnnonce();
    }, [page]);


    // Fonctions pour les boutons d'action
    const handlePin = (serviceId: string) => {
        // Logique pour épingler/désépingler
        console.log("Pin service:", serviceId);
        // Implémentez votre logique ici
    };

    const clicEdit = (service: Annonce) => {
        setSelectAnnonce(service);
        setOpen(true);
        console.log("Edit service:", service);
    };

    const askForLocation = async () => {
        setIsLocLoading(true);

        const result = await askForUserLocation();
        switch (result.status) {
            case "success":
                setUserLocation(result.location);
                setDisplayLocation(
                    `${result.location?.city} – ${result.location?.street}`
                );
                setMsg([]);
                break;

            case "permission-denied":
                setMsg([
                    {
                        id: "geo-001",
                        type: "text",
                        title: "📍 Localisation obligatoire",
                        message:
                            "Notre application nécessite votre localisation pour fonctionner correctement.",
                        linkText: "Activer la localisation",
                        onClick: askForLocation,
                    },
                ]);
                break;

            case "network-error":
                setMsg([
                    {
                        id: "geo-002",
                        type: "text",
                        title: "📍 Oups une erreur s'est produite",
                        message: "Erreur de réseau, veuillez réessayer.",
                        linkText: "Relancer",
                        onClick: askForLocation,
                    },
                ]);
                break;

            default:
                setMsg([
                    {
                        id: "geo-003",
                        type: "text",
                        title: "🚨 Erreur inattendue",
                        message: "Une erreur est survenue. Vérifiez votre réseau.",
                        linkText: "Réessayer",
                        onClick: askForLocation,
                    },
                ]);
        }
        setIsLocLoading(false);
    };

    const getUserinfosBySecurity = async () => {
        const user = await getMyData();

        if (user.statusCode === 200 && user.data) {
            setusersData(user.data);
            setUserLocation(user.data?.location);
        } else if (user.statusCode === 401) {
            askForLocation();
        }
    };

    // ✅ useEffect après tous les useState
    useEffect(() => {
        getUserinfosBySecurity();
    }, []);

    // Charger les annonces initialement
    useEffect(() => {
        fetchAllAnnonce();
    }, []);

    // Mettre à jour les annonces filtrées
    useEffect(() => {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Afficher toutes les annonces (pas de filtrage par recherche)
        setFilteredAnnonces(annonces.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(annonces.length / itemsPerPage));
    }, [page, annonces]);


    // Formater le prix
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: " ₣",
            minimumFractionDigits: 0,
        }).format(price);
    };

    // Vérifier si meublé
    const isFurnished = (amenities: Amenity[]): boolean => {
        return amenities.some(a =>
            a.label.toLowerCase().includes('meublé') ||
            a.label.toLowerCase().includes('furnished') ||
            a.label.toLowerCase().includes('équipée') ||
            a.label.toLowerCase().includes('cuisine')
        );
    };

    // Obtenir l'icône selon le type de propriété
    const getPropertyIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'villa':
            case 'maison':
                return <Home className="w-2 h-2" />;
            case 'appartement':
            case 'studio':
            case 'loft':
            case 'chambre':
                return <Building className="w-2 h-2" />;
            default:
                return <Home className="w-2 h-2" />;
        }
    };

    // Sélection d'un service
    const handleSelectAnnonce = (data: Annonce | null) => {
        setSelectAnnonce(data);
        setOpen(true);
    };

    //
    const handleSubmit = async (data: FormData) => {

        try {

            setIsLoading(true);
            let res;
            if (SelectAnnonce?.id) {
                res = await updateAnnonce(SelectAnnonce.id, data);
            } else {
                res = await createAnnonce(data);
            }

            if (res.statusCode === 201) {
                toast.success(res.message || (SelectAnnonce?.id ? 'Annonce mise à jour' : 'Annonce créée'));
                fetchAllAnnonce();
            } else {
                toast.error(res.message || 'Une erreur est survenue');
            }
            setOpen(false);
            setIsLoading(false);

        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            toast.error('Une erreur est survenue lors de la soumission');
            setOpen(false);
            setIsLoading(false);
        }
    };

    // Suppression
    const handleDelete = (item: Annonce) => {
        console.log("Delete service:", item);
        // Implémentez votre logique ici
        setSelectedId(item.id);
        setIsModalOpen(true);
        console.log("🗑️ Suppression demandée pour :", item.title);
    };

    const handleConfirmDelete = (id: string) => {
        console.log("Supprimer l'élément avec id :", id);
        // ici appeler ton API ou fonction du parent
        setIsModalOpen(false);
    };

    return (
        <div className="w-full max-w-full">

            <div className="relative w-full mt-4" >
                {/* En-tête */}
                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-sm font-bold text-gray-900"> Mes annonces</h1>
                        <div className="w-23 h-1 bg-[#b07b5e] mt-2"></div>
                    </div>
                    {/* Bouton + */}
                    <button onClick={() => { handleSelectAnnonce(null); setOpen(true); }}
                        className="flex items-center gap-2 bg-[#b07b5e] px-4 py-2.5 rounded-full hover:bg-[#9c6b52] transition shadow-md">
                        <Plus className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white whitespace-nowrap">
                            Nouvelle annonce
                        </span>
                    </button>

                </div>

            </div>

            {/* 🏠 Liste des annonces */}
            <div className="max-w-2xl mx-auto overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Spinner />
                    </div>
                ) : annonces.length > 0 ? (
                    <>
                        <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {annonces.map((annonce) => (
                                <div key={annonce.id} className="group rounded-lg transition overflow-hidden">
                                    {/* IMAGE */}
                                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">

                                        <Image fill className="object-cover group-hover:scale-110 transition duration-300" src={annonce.images[0] || "/astronaut-grey-scale.svg"} alt={annonce.title} />
                                        {/* OVERLAY */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
                                        {/* 👁 ICON CENTER */}
                                        <button onClick={() => handleSelectAnnonce(annonce)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <div className="p-2 sm:p-3 bg-white rounded-full shadow-lg">
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" />
                                            </div>
                                        </button>

                                        {/* BADGES */}
                                        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5">
                                            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] sm:text-xs">
                                                {getPropertyIcon(annonce.category.label)} {annonce.category.label}
                                            </span>

                                            {isFurnished(annonce.amenities) && (
                                                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs">
                                                    Meublé
                                                </span>
                                            )}
                                        </div>

                                        {/* LOGO */}
                                        <div className="absolute bottom-2 left-2 w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-lg shadow flex items-center justify-center overflow-hidden">
                                            <Image fill className="object-cover" src={annonce.images[0] || "/astronaut-grey-scale.svg"} alt={annonce.title} />
                                        </div>
                                    </div>

                                    {/* TEXT */}
                                    <div className="p-3 sm:p-4 space-y-1.5">
                                        <p className="font-medium text-xs sm:text-sm truncate">  {annonce.title}   </p>

                                        {annonce.review && (
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (<Star key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < annonce.review!.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />))}
                                            </div>
                                        )}

                                        <p className="font-semibold text-xs sm:text-sm">
                                            {annonce.price}
                                        </p>

                                        {/* BOUTONS D'ACTION */}
                                        <div className="flex items-center space-x-2 pt-2">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => handlePin(annonce.id)} title="Épingler" >
                                                {annonce.pinned ? (
                                                    <PinIcon size={18} color="#155e75" />
                                                ) : (
                                                    <PinIcon size={18} className="text-gray-600" />
                                                )}
                                            </button>

                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => clicEdit(annonce)} title="Modifier"  >
                                                <EditIcon size={16} color="#b07b5e" />
                                            </button>

                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => handleDelete(annonce)} title="Supprimer"  >
                                                <TrashIcon size={16} color="#ff0000" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Home className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucune annonce trouvée
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Aucune annonce disponible pour le moment.
                        </p>
                    </div>
                )}

                {/* 📄 Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        onPageChange={setPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalPages * itemsPerPage}
                    />
                )}

                <MyModal open={open} onClose={() => setOpen(false)}>
                    <AnnonceForm initialData={SelectAnnonce || undefined} onClose={() => setOpen(false)} user={users || null} fetchAll={fetchAllAnnonce} onSubmit={handleSubmit} isSubmitting={isLoading} />
                </MyModal>

                <ModalDelete isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} itemId={selectedId} title="Supprimer ce service ?" />

            </div>

        </div>
    );
}