"use client";

import { Search, X, Star, Home, Building, Eye, LogIn, Plus } from "lucide-react";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Pagination from "../pagination/Paginations";
import { Spinner } from "../forms/spinner/Loader";
import { fakeAnnonce } from "@/data/fakeAnnonce";
import { useRouter } from "next/navigation";
import { Amenity, Annonce, Role, User, UserLocation } from "@/types/interfaces";
import ModalDelete from "./ModalDelete";
import MyModal from "../modal/MyModal";
import AnnonceDetails from "./AnnonceDetails";
import { MessagesData } from "./Messages";
import { getMyData } from "@/services/securityService";
import SearchAnnonces from "./SearchAnnonces";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { filterAnnonces, getAllannonces } from "@/services/annonceService";
import { handleLocationRequest } from "@/utils/locationHandler";

type AdminTab = "nouvelle-annonce" | "recherche";

export default function AnnonceServices() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 3;
    const [annonces, setAnnonces] = useState<Annonce[]>(fakeAnnonce);
    const [totalPages, setTotalPages] = useState(0);
    const [auth, setAuth] = useState(false);
    const router = useRouter();
    const [users, setUsersData] = useState<User | null>(null);
    const [selectedAnnonce, setSelectedAnnonce] = useState<Annonce | null>(null);
    const [open, setOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<UserLocation | null | undefined>(null);
    const [msg, setMessages] = useState<MessagesData[]>([]);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");
    const [activeTab, setActiveTab] = useState<AdminTab>("recherche");
    const inputRef = useRef<HTMLInputElement>(null);

    // ✅ CORRECTION : Fonction utilitaire isolée (sans dépendances)
    const handleLocationUtility = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await handleLocationRequest();

            if (result.status === 'success') {
                setUserLocation(result.location);
                setDisplayLocation(result.displayLocation || '');
                setMessages([]);
            } else if (result.messages) {
                setMessages(result.messages);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la localisation:", error);
        } finally {
            setIsLoading(false);
        }
    }, []); // ✅ Pas de dépendances - fonction stable

    // ✅ CORRECTION : useEffect avec appel unique au montage
    useEffect(() => {
        let isMounted = true;

        const getUserinfosBySecurity = async () => {
            try {
                const user = await getMyData();

                if (!isMounted) return;

                if (user.statusCode === 200 && user.data) {
                    setUsersData(user.data);
                    setUserLocation(user.data?.location);
                } else if (user.statusCode === 401) {
                    await handleLocationUtility();
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
        };

        getUserinfosBySecurity();

        return () => {
            isMounted = false;
        };
    }, [handleLocationUtility]);

    // ✅ OPTIMISATION : Mémorisation de loadAnnonces avec dépendances correctes
    const loadAnnonces = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getAllannonces(page + 1, itemsPerPage);
            if (response.statusCode === 200 && response.data) {
                setAnnonces(response.data.data);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
            } else {
                console.error("Erreur:", response.message);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des annonces:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, itemsPerPage]);

    // ✅ OPTIMISATION : Chargement initial et au changement de page
    useEffect(() => {
        loadAnnonces();
    }, [loadAnnonces]);

    // ✅ OPTIMISATION : Recherche avec gestion d'erreur améliorée
    const handleSearchClick = useCallback(async () => {
        if (!searchTerm.trim()) {
            setPage(0);
            await loadAnnonces();
            return;
        }

        setIsLoading(true);
        setPage(0);

        try {
            const Payload = {
                page: 1,
                limit: itemsPerPage,
                label: searchTerm,
                location: users?.location || userLocation || undefined,
            };

            const response = await filterAnnonces(Payload);

            if (response.statusCode === 200 && response.data) {
                setAnnonces(response.data.data);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
            } else {
                await loadAnnonces();
            }
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            await loadAnnonces();
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, users?.location, userLocation, loadAnnonces, itemsPerPage]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleSearchClick();
            }
        },
        [handleSearchClick]
    );

    const handleClearSearch = useCallback(() => {
        setSearchTerm("");
        setPage(0);
        inputRef.current?.focus();
        // ✅ Recharge les annonces après effacement
        loadAnnonces();
    }, [loadAnnonces]);

    const isFurnished = useCallback((amenities: Amenity[]): boolean => {
        return amenities.some(a =>
            a.label.toLowerCase().includes('meublé') ||
            a.label.toLowerCase().includes('furnished') ||
            a.label.toLowerCase().includes('équipée') ||
            a.label.toLowerCase().includes('cuisine')
        );
    }, []);

    const getPropertyIcon = useCallback((category: string) => {
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
    }, []);

    const handleSelectAnnonce = useCallback((data: Annonce) => {
        if (!users?.id) {
            setAuth(true);
        } else {
            setAuth(false);
            setSelectedAnnonce(data);
            setOpen(true);
        }
    }, [users?.id]);

    const handleAuth = useCallback(async () => {
        setAuth(false);
        router.push("/welcome");
    }, [router]);

    // ✅ Mémoriser le composant de recherche
    const RechercheAnnonce = useMemo(() => (
        <div className="space-y-6">
            {/* 🔍 Barre de recherche */}
            <div className="relative w-full">
                <div className="flex gap-2">
                    <div className="flex flex-row gap-3 w-full items-center">
                        <div className="relative flex-1">

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500"  >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>

                            <input ref={inputRef}  type="text" value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)}  onKeyDown={handleKeyDown}
                                placeholder="Rechercher une annonce, une localisation...."
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border rounded-md  text-sm md:text-base  text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700  transition "
                                disabled={isLoading} inputMode="text" style={{ fontSize: '16px' }} />

                            {searchTerm && (
                                <button  onClick={handleClearSearch} type="button"  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"  >
                                    <X className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                            )}
                        </div>
                        <button type="button"  onClick={handleSearchClick}  disabled={isLoading}  className="bg-brand-secondary hover:bg-brand-primary text-white flex items-center justify-center px-3 md:px-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base whitespace-nowrap disabled:opacity-50"  >
                            <span className="md:hidden">
                                <Search className="w-4 h-4" />
                            </span>
                            <span className="hidden md:inline">
                                {isLoading ? "Recherche..." : "Rechercher →"}
                            </span>
                        </button>
                    </div>
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
                                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                                        <Image  fill   className="object-cover group-hover:scale-110 transition duration-300"   src={annonce.images[0] || "/astronaut-grey-scale.svg"}  alt={annonce.title} />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
                                        <button   onClick={() => handleSelectAnnonce(annonce)} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition" >
                                            <div className="p-2 sm:p-3 bg-white rounded-full shadow-lg">
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" />
                                            </div>
                                        </button>

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

                                        <div className="absolute bottom-2 left-2 w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-lg shadow flex items-center justify-center overflow-hidden">
                                            <Image  fill  className="object-cover"  src={annonce.images[0] || "/astronaut-grey-scale.svg"}    alt={annonce.title}   />
                                        </div>
                                    </div>

                                    <div className="p-3 sm:p-4 space-y-1.5">
                                        <p className="font-medium text-xs sm:text-sm truncate">{annonce.title}</p>
                                        {annonce.review && (
                                            <div className="flex items-center gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i}  className={`w-3 h-3 sm:w-4 sm:h-4 ${i < annonce.review!.rating  ? "text-yellow-400 fill-yellow-400"  : "text-gray-300"  }`} />
                                                ))}
                                            </div>
                                        )}
                                        <p className="font-semibold text-xs sm:text-sm">
                                            {annonce.price}
                                        </p>
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
                            {searchTerm.trim()
                                ? `Aucun résultat pour "${searchTerm}"`
                                : "Aucune annonce disponible pour le moment."}
                        </p>
                        {searchTerm.trim() && (
                            <button  onClick={handleClearSearch}  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"  >
                                Afficher toutes les annonces
                            </button>
                        )}
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination
                        page={page}
                        onPageChange={setPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalPages * itemsPerPage}
                    />
                )}
            </div>
        </div>
    ), [
        searchTerm,
        isLoading,
        annonces,
        totalPages,
        page,
        itemsPerPage,
        handleKeyDown,
        handleClearSearch,
        handleSearchClick,
        handleSelectAnnonce,
        getPropertyIcon,
        isFurnished,
    ]);

    return (
        <div className="w-full max-w-full">
            {users?.roles === Role.ADMIN || users?.roles === Role.PROVIDER ? (
                <div className="space-y-6">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) => setActiveTab(value as AdminTab)}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted p-1">
                            <TabsTrigger
                                value="recherche"
                                className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold whitespace-nowrap sm:py-3 sm:gap-3 sm:text-base"
                            >
                                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="sm:hidden">Recherche</span>
                                <span className="hidden sm:inline">Recherche d'annonces</span>
                            </TabsTrigger>

                            <TabsTrigger
                                value="nouvelle-annonce"
                                className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold whitespace-nowrap sm:py-3 sm:gap-3 sm:text-base"
                            >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="sm:hidden">Mes annonces</span>
                                <span className="hidden sm:inline">Gérer mes annonces</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="recherche" className="mt-6 sm:mt-8">
                            {RechercheAnnonce}
                        </TabsContent>

                        <TabsContent value="nouvelle-annonce" className="mt-6 sm:mt-8">
                            <SearchAnnonces />
                        </TabsContent>
                    </Tabs>
                </div>
            ) : (
                RechercheAnnonce
            )}

            {/* Modals communs */}
            {selectedAnnonce && (
                <MyModal open={open} onClose={() => setOpen(false)}>
                    <AnnonceDetails annonce={selectedAnnonce} onClose={() => setOpen(false)} />
                </MyModal>
            )}

            <ModalDelete
                isOpen={auth}
                onClose={() => setAuth(false)}
                onConfirm={handleAuth}
                itemId="0"
                title="Connexion requise"
                message="Vous devez vous connecter pour continuer. Voulez-vous vous connecter maintenant ?"
                cancelText="Annuler"
                confirmText="Se connecter"
                confirmIcon={<LogIn className="w-4 h-4" />}
            />
        </div>
    );
}