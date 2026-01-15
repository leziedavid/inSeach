"use client";

import { LogIn, Plus, Search, X } from "lucide-react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import Image from "next/image";
import { Service, User, UserLocation } from "@/types/interfaces";
import ServiceDetails from "../forms/ServiceDetails";
import MyModal from "../modal/MyModal";
import { filterServices, listServices } from "@/services/allService";
import { searchSubcategoriesByName } from "@/services/categoryService";
import { getMyData } from "@/services/securityService";
import { MessagesData } from "./Messages";
import ModalDelete from "./ModalDelete";
import { useRouter } from "next/navigation";
import Erreurs from "./Erreurs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchPrestations from "./SearchPrestations";
import { handleLocationRequest } from "@/utils/locationHandler";

function truncateText(text: string, maxLength = 50) {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "...";
}

type ServiceTab = "recherche" | "nouveau-service";

export default function SearchServices() {
    const [activeTab, setActiveTab] = useState<ServiceTab>("recherche");
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 6;

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [open, setOpen] = useState(false);
    const [service, setServices] = useState<Service[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [auth, setAuth] = useState(false);
    const router = useRouter();

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [users, setusersData] = useState<User | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null | undefined>(null);
    const [msg, setMessages] = useState<MessagesData[]>([]);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");

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

    const getUserinfosBySecurity = useCallback(async () => {
        const user = await getMyData();

        if (user.statusCode === 200 && user.data) {
            setusersData(user.data);
            setUserLocation(user.data?.location);
        } else if (user.statusCode === 401) {
            handleLocationUtility();
        }
    }, [handleLocationUtility]);

    // ✅ Charger les infos utilisateur une seule fois
    useEffect(() => {
        getUserinfosBySecurity();
    }, [getUserinfosBySecurity]);

    // ✅ Fonction pour charger tous les services
    const getAllServices = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await listServices(page + 1, itemsPerPage);
            if (response.statusCode === 200 && response.data) {
                setServices(response.data.data);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
            } else {
                console.log("error", response.message);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des services:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, itemsPerPage]);

    // Charger initialement
    useEffect(() => {
        getAllServices();
    }, [page]); // ✅ Dépendance simplifiée

    // ✅ Récupérer les suggestions avec useCallback
    const getServiceNameSuggestions = useCallback(async (query: string): Promise<string[]> => {
        if (!query.trim() || query.length < 2) return [];

        try {
            setIsSearchingSuggestions(true);
            const response = await searchSubcategoriesByName(query);
            if (response?.data) {
                const apiData = Array.isArray(response.data) ? response.data : response.data.data || [];
                const serviceNames = apiData.map((item: any) => item.name || item.title || '').filter((name: string) => name.trim() !== '').slice(0, 5);
                return serviceNames;
            }
            return [];
        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions:", error);
            return [];
        } finally {
            setIsSearchingSuggestions(false);
        }
    }, []);

    // ✅ Gestion de la saisie avec useCallback
    const handleSearchInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setSelectedSuggestionIndex(-1);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.trim().length === 0) {
            setShowSuggestions(false);
            setSuggestions([]);
            return;
        }

        if (value.trim().length >= 4) {
            searchTimeoutRef.current = setTimeout(async () => {
                const serviceSuggestions = await getServiceNameSuggestions(value);
                setSuggestions(serviceSuggestions);
                setShowSuggestions(serviceSuggestions.length > 0);
            }, 300);
        } else {
            setShowSuggestions(false);
        }
    }, [getServiceNameSuggestions]);

    // ✅ Sélectionner une suggestion avec useCallback
    const handleSelectSuggestion = useCallback((suggestion: string) => {
        setSearch(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
        inputRef.current?.focus();
    }, []);

    // ✅ Recherche principale avec useCallback
    const handleSearchClick = useCallback(async () => {
        if (!search.trim()) {
            setShowSuggestions(false);
            setPage(0);
            await getAllServices();
            return;
        }

        setIsLoading(true);
        setShowSuggestions(false);
        setPage(0);

        try {
            const Payload = {
                page: 1,
                limit: itemsPerPage,
                label: search,
                location: users?.location || userLocation || undefined,
            };

            const response = await filterServices(Payload);

            if (response.statusCode === 200 && response.data) {
                setServices(response.data.data);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
            } else {
                await getAllServices();
            }
        } catch (error) {
            console.error("Erreur lors de la recherche:", error);
            await getAllServices();
        } finally {
            setIsLoading(false);
        }
    }, [search, users, getAllServices, itemsPerPage]);

    // ✅ Gestion des touches avec useCallback
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showSuggestions && suggestions.length > 0) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedSuggestionIndex(prev =>
                        prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedSuggestionIndex(prev =>
                        prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedSuggestionIndex >= 0) {
                        handleSelectSuggestion(suggestions[selectedSuggestionIndex]);
                    } else {
                        handleSearchClick();
                    }
                    break;
                case 'Escape':
                    setShowSuggestions(false);
                    break;
            }
        } else if (e.key === 'Enter') {
            handleSearchClick();
        }
    }, [showSuggestions, suggestions, selectedSuggestionIndex, handleSelectSuggestion, handleSearchClick]);

    // ✅ Effacer la recherche avec useCallback
    const handleClearSearch = useCallback(async () => {
        setSearch("");
        setShowSuggestions(false);
        setSuggestions([]);
        inputRef.current?.focus();
        setPage(0);
        await getAllServices();
    }, [getAllServices]);

    // Fermer les suggestions en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ✅ Sélection d'un service avec useCallback
    const handleSelectService = useCallback((data: Service) => {
        if (!users?.id) {
            setAuth(true);
        } else {
            setAuth(false);
            setSelectedService(data);
            setOpen(true);
        }
    }, [users?.id]);

    const handleAuth = useCallback(async () => {
        setAuth(false);
        router.push("/welcome");
    }, [router]);

    // ✅ Mémoriser le composant de recherche avec useMemo
    const ServiceSearchView = useMemo(() => (
        <>
            <div className="relative w-full mt-4" ref={suggestionsRef}>
                <div className="flex flex-row gap-3 w-full items-center">
                    <div className="relative w-full">

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500"  >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>

                        <input type="text" ref={inputRef} value={search} onChange={handleSearchInput} onKeyDown={handleKeyDown}
                            onFocus={() => { if (search.length >= 2 && suggestions.length > 0) { setShowSuggestions(true); } }}
                            placeholder="Rechercher un services,Ex: plomberie, ménage, jardinage ..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border rounded-md  text-sm md:text-base  text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700  transition "
                            disabled={isLoading} />
                        {search && (
                            <button onClick={handleClearSearch} type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"  >
                                <X className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    <button type="button" onClick={handleSearchClick} disabled={isLoading} className="bg-brand-secondary hover:bg-brand-primary text-white flex items-center justify-center px-3 md:px-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base whitespace-nowrap disabled:opacity-50" >
                        <span className="md:hidden">
                            <Search className="w-4 h-4" />
                        </span>
                        <span className="hidden md:inline">
                            {isLoading ? "Recherche..." : "Rechercher →"}
                        </span>
                    </button>
                </div>

                {(isSearchingSuggestions || showSuggestions) && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow">
                        {isSearchingSuggestions && (
                            <div className="p-3 text-sm text-gray-400">Recherche de services...</div>
                        )}

                        {!isSearchingSuggestions && suggestions.map((item, index) => (
                            <button key={index} onClick={() => handleSelectSuggestion(item)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${index === selectedSuggestionIndex ? "bg-gray-100" : ""}`} >
                                {item}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full mt-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : service.length > 0 ? (
                    <>

                        <div className="grid grid-cols-3 auto-rows-auto gap-x-2 gap-y-8">
                            {/* Titre */}
                            <div className="col-span-3">
                                <h1 className="mt-4 -mb-4 text-lg font-medium text-left text-slate-800">
                                    Quel service cherchez-vous ?
                                </h1>
                            </div>

                            {/* Services */}
                                {service.map((service) => (
                                    <div key={service.id} onClick={() => handleSelectService(service)} className="relative rounded-xl transition-all duration-200 overflow-hidden mb-10 bg-cover ">
                                        <div className="flex flex-col items-center mt-4 mb-4 ">
                                            {/* Icône */}
                                            <div className={` flex justify-center items-center w-14 h-14 rounded-full bg-slate-100 cursor-pointer transition-all duration-200 hover:scale-[1.05] hover:shadow-lg hover:shadow-slate-100/70 ${selectedService?.id === service.id ? "ring-2 ring-[#a06a50]" : ""}`}>
                                                {service.iconUrl ? (
                                                    <Image  src={service.iconUrl} alt={service.title}  width={32}  height={32}  className="object-contain"  />
                                                    ) : (
                                                    <span className="text-gray-400 text-sm">?</span>
                                                )}
                                            </div>

                                            {/* Label */}
                                            <div className="mt-2 text-center">
                                                <p className="text-[0.8rem] font-medium text-slate-700"> {truncateText(service.title, 50)}  </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        
                    </>
                ) : (
                    <div className="text-center py-8">
                        <Erreurs />
                        <p className="text-sm text-gray-600 mt-2">
                            Aucun service trouvé {search.trim() ? `pour "${search}"` : ""}
                        </p>
                        {search.trim() && (
                            <button onClick={handleClearSearch} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm"  >
                                Afficher tous les services
                            </button>
                        )}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination
                    page={page}
                    onPageChange={setPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalPages * itemsPerPage}
                />
            )}
        </>
    ), [search, isLoading, service, selectedService, totalPages, page, suggestions, showSuggestions, isSearchingSuggestions, selectedSuggestionIndex, handleSearchInput, handleKeyDown, handleClearSearch, handleSearchClick, handleSelectSuggestion, handleSelectService]);

    return (
        <div className="w-full max-w-full">
            {users?.roles?.includes("ADMIN") || users?.roles?.includes("PROVIDER") ? (
                <div className="space-y-6">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ServiceTab)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted p-1">

                            {/* Recherche */}
                            <TabsTrigger value="recherche" className=" flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold sm:py-3 sm:gap-3 sm:text-base "  >
                                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="sm:hidden">Recherche</span>
                                <span className="hidden sm:inline">Rechercher un service</span>
                            </TabsTrigger>

                            {/* Nouveau service */}
                            <TabsTrigger value="nouveau-service" className=" flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold sm:py-3 sm:gap-3 sm:text-base " >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span className="sm:hidden">Nouveau</span>
                                <span className="hidden sm:inline">Mes services</span>
                            </TabsTrigger>

                        </TabsList>

                        <TabsContent value="recherche" className="mt-6 sm:mt-8">
                            {ServiceSearchView}
                        </TabsContent>

                        <TabsContent value="nouveau-service" className="mt-6 sm:mt-8">
                            <SearchPrestations />
                        </TabsContent>
                    </Tabs>
                </div>



            ) : (
                ServiceSearchView
            )}

            {selectedService && (
                <MyModal open={open} onClose={() => setOpen(false)}>
                    <ServiceDetails service={selectedService} onClose={() => setOpen(false)} />
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