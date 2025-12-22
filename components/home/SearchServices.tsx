"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import Image from "next/image";
import { Service, User, UserLocation } from "@/types/interfaces";
import ServiceDetails from "../forms/ServiceDetails";
import MyModal from "../modal/MyModal";
import { filterServices, listServices } from "@/services/allService";
import { searchSubcategoriesByName } from "@/services/categoryService";
import Erreurs from "../page/Erreurs";
import { getMyData } from "@/services/securityService";
import { MessagesData } from "./Messages";
import { askForUserLocation } from "@/services/location";


function truncateText(text: string, maxLength = 50) {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "...";
}

export default function SearchServices() {

    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 6;

    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [open, setOpen] = useState(false);
    const [service, setServices] = useState<Service[]>([]);
    const [totalPages, setTotalPages] = useState(0);

    // États pour les suggestions
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);

    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [users, setusersData] = useState<User | null>(null)
    const [userLocation, setUserLocation] = useState<UserLocation | null | undefined>(null)
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [msg, setMsg] = useState<MessagesData[]>([]);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");

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
        const user = await getMyData()

        if (user.statusCode === 200 && user.data) {
            setusersData(user.data)
            setUserLocation(user.data?.location)
        } else if (user.statusCode === 401) {
            askForLocation();

        }

    }
    // ✅ useEffect après tous les useState
    useEffect(() => { getUserinfosBySecurity() }, [])

    // Charger les services initialement
    const getAllServices = async () => {

        setIsLoading(true);

        try {
            const response = await listServices(page + 1, itemsPerPage);
            if (response.statusCode === 200 && response.data) {
                setServices(response.data.data);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
                setIsLoading(false);
            } else {
                console.log("error", response.message);
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des services:", error);
            setIsLoading(false);
        }
    };

    // Charger initialement
    useEffect(() => {
        getAllServices();
    }, []);

    // Charger les services paginés
    useEffect(() => {
        if (!search.trim()) {
            loadServicesForPage();
        }
    }, [page]);

    const loadServicesForPage = async () => {
        setIsLoading(true);
        try {
            const response = await listServices(page + 1, itemsPerPage);
            if (response.statusCode === 200 && response.data) {
                setServices(response.data.data);
                setTotalPages(Math.ceil(response.data.total / itemsPerPage));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des services:", error);
            setIsLoading(false);
        }
    };

    // Récupérer les suggestions de noms de services
    const getServiceNameSuggestions = async (query: string): Promise<string[]> => {
        if (!query.trim() || query.length < 2) return [];

        try {
            setIsSearchingSuggestions(true);
            const response = await searchSubcategoriesByName(query);
            if (response?.data) {
                // Extraire les noms des services de la réponse
                const apiData = Array.isArray(response.data) ? response.data : response.data.data || [];
                // Récupérer les noms (titles/names) des services
                const serviceNames = apiData.map((item: any) => item.name || item.title || '').filter((name: string) => name.trim() !== '').slice(0, 5); // Limiter à 5 suggestions
                setIsSearchingSuggestions(false);
                return serviceNames;
            }
            setIsSearchingSuggestions(false);
            return [];
        } catch (error) {
            console.error("Erreur lors de la récupération des suggestions:", error);
            setIsSearchingSuggestions(false);
            return [];
        }
    };

    // Gestion de la saisie dans l'input
    const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setSelectedSuggestionIndex(-1);

        // Annuler le timeout précédent
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.trim().length === 0) {
            setShowSuggestions(false);
            setSuggestions([]);
            return;
        }

        // Afficher les suggestions après 2 caractères
        if (value.trim().length >= 4) {
            searchTimeoutRef.current = setTimeout(async () => {
                const serviceSuggestions = await getServiceNameSuggestions(value);
                setSuggestions(serviceSuggestions);
                setShowSuggestions(serviceSuggestions.length > 0);
            }, 300);

        } else {
            setShowSuggestions(false);
        }
    };

    // Sélectionner une suggestion
    const handleSelectSuggestion = (suggestion: string) => {
        setSearch(suggestion);
        setShowSuggestions(false);
        setSuggestions([]);
        inputRef.current?.focus();
    };

    // Recherche principale (uniquement par bouton)
    const handleSearchClick = async () => {
        if (!search.trim()) {
            // Si recherche vide, charger tous les services
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
                location: users?.location || undefined,
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
    };

    // Recherche avec la touche Entrée
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    };

    // Effacer la recherche
    const handleClearSearch = async () => {
        setSearch("");
        setShowSuggestions(false);
        setSuggestions([]);
        inputRef.current?.focus();
        setPage(0);
        await getAllServices();
    };

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

    // Sélection d'un service
    const handleSelectService = (data: Service) => {
        setSelectedService(data);
        setOpen(true);
    };


    return (
        <div className="w-full max-w-full">

            <div className="relative w-full mt-4" ref={suggestionsRef}>
                <div className="flex flex-row gap-3 w-full items-center">
                    {/* 🔹 Wrapper relatif pour l’input */}
                    <div className="relative w-full">
                        <input type="text" ref={inputRef} value={search} onChange={handleSearchInput} onKeyDown={handleKeyDown} onFocus={() => { if (search.length >= 2 && suggestions.length > 0) { setShowSuggestions(true); } }} placeholder="Ex: plomberie, ménage, jardinage..." className="w-full rounded-lg border px-4 py-2 pr-10 text-sm md:text-base focus:outline-none" disabled={isLoading} />
                        {/* ❌ Bouton réinitialiser DANS l’input */}
                        {search && (
                            <button onClick={handleClearSearch} type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"  >
                                <X className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* 🔍 Bouton recherche */}
                    <button type="button" onClick={handleSearchClick} disabled={isLoading} className="bg-brand-secondary  hover:bg-brand-primary text-white flex items-center justify-center px-3 md:px-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base whitespace-nowrap disabled:opacity-50" >
                        {/* 📱 Mobile : icône */}
                        <span className="md:hidden">
                            <Search className="w-4 h-4" />
                        </span>

                        {/* 🖥 Desktop : texte */}
                        <span className="hidden md:inline">
                            {isLoading ? "Recherche..." : "Rechercher →"}
                        </span>
                    </button>
                </div>


                {(isSearchingSuggestions || suggestions.length > 0) && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow">
                        {isSearchingSuggestions && (
                            <div className="p-3 text-sm text-gray-400">   Recherche de services...  </div>
                        )}

                        {!isSearchingSuggestions && suggestions.length > 0 &&
                            suggestions.map((item, index) => (
                                <button key={index} onClick={() => handleSelectSuggestion(item)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${index === selectedSuggestionIndex ? "bg-gray-100" : ""}`}>
                                    {item}
                                </button>
                            ))}
                    </div>
                )}

            </div>


            {/* 🧩 Grille des services */}
            <div className="w-full mt-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : service.length > 0 ? (
                    <>
                        {/* Grille responsive */}
                        {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-3">
                            {service.map((service) => (
                                <div key={service.id} onClick={() => handleSelectService(service)} className={`bg-white rounded-lg p-4 border border-[#b07b5e]/80 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col items-center text-center ${selectedService?.id === service.id ? "ring-2 ring-[#a06a50]" : ""} `} >
                                    <div className="w-16 h-16 mb-2 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {service.iconUrl ? (
                                            <Image src={service.iconUrl} alt={service.title} width={40} height={40} className={`object-contain transition ${selectedService?.id === service.id ? "brightness-200 invert" : ""}`} unoptimized />
                                        ) : (
                                            <span className="text-gray-400 text-sm">?</span>
                                        )}
                                    </div>

                                    <h3 className="font-medium text-gray-800 text-sm md:text-[13px] leading-tight mb-1 line-clamp-2">
                                        {truncateText(service.title, 50)}
                                    </h3>
                                </div>
                            ))}
                        </div> */}


                        {/* Grille responsive */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-3">
                            {Array.from({ length: 12 }).map((_, index) => {
                                // On prend le service existant ou un objet par défaut
                                const currentService = service[0] || { id: index, title: "Service exemple", iconUrl: "" }

                                return (
                                    <div  key={index} onClick={() => handleSelectService(currentService)} className={`bg-white rounded-lg p-4 border border-[#b07b5e]/80 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col items-center text-center ${selectedService?.id === currentService.id ? "ring-2 ring-[#a06a50]" : ""}`} >
                                        {/* Image */}
                                        <div className="w-16 h-16 mb-2 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {currentService.iconUrl ? (
                                                <Image  src={currentService.iconUrl}  alt={currentService.title}  width={40}  height={40}  className={`object-contain transition ${selectedService?.id === currentService.id ? "brightness-200 invert" : ""}`}  unoptimized  />
                                            ) : (
                                                <span className="text-gray-400 text-sm">?</span>
                                            )}
                                        </div>

                                        {/* Texte */}
                                        <h3 className="font-medium text-gray-800 text-sm md:text-[13px] leading-tight mb-1 line-clamp-2">
                                            {truncateText(currentService.title, 50)}
                                        </h3>
                                    </div>
                                )
                            })}
                        </div>

                    </>
                ) : (
                    <div className="text-center py-8">
                        <Erreurs />
                        <p className="text-sm text-gray-600 mt-2">
                            Aucun service trouvé {search.trim() ? `pour "${search}"` : ""}
                        </p>
                        {search.trim() && (
                            <button onClick={handleClearSearch} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm" >
                                Afficher tous les services
                            </button>
                        )}
                    </div>
                )}
            </div>


            {/* 📄 Pagination */}
            {totalPages > 1 && (
                <Pagination page={page} onPageChange={setPage} itemsPerPage={itemsPerPage} totalItems={totalPages * itemsPerPage} />
            )}

            {selectedService && (
                <MyModal open={open} onClose={() => setOpen(false)}>
                    <ServiceDetails service={selectedService} onClose={() => setOpen(false)} />
                </MyModal>
            )}

        </div>
    );
}
