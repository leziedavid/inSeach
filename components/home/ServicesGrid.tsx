"use client";

import { Search, X, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import Image from "next/image";
import { AuthUser, Service, User, UserLocation } from "@/types/interfaces";
import ServiceDetails from "../forms/ServiceDetails";
import MyModal from "../modal/MyModal";
import { filterServices, listServices } from "@/services/allService";
import { searchSubcategoriesByName } from "@/services/categoryService";
import { getUserInfos } from "@/app/middleware";
import Erreurs from "../page/Erreurs";

// Props du composant
interface ServicesGridProps {
    services: Service[];
}

function truncateText(text: string, maxLength = 50) {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "...";
}

export default function ServicesGrid({ services }: ServicesGridProps) {

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
    const [users, setUsers] = useState<AuthUser | null>(null)
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

    // ✅ useEffect après tous les useState
    useEffect(() => {
        getUserInfos().then(setUsers)
    }, [])

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
        <div className="w-full mx-auto p-4 flex flex-col gap-6">
            {/* En-tête */}
            <div className="mb-2 flex items-center justify-between mt-2">

                <div>
                    <h1 className="text-sm font-bold text-gray-900">Quel service cherchez-vous ?</h1>
                    <div className="w-50 h-1 bg-[#b07b5e] mt-2"></div>
                </div>

                <button className="bg-[#b07b5e] p-2.5 rounded-full hover:bg-[#a06a50] transition shadow-md">
                    <Search className="w-3 h-3 text-white" />
                </button>

            </div>

            {/* 🔍 Zone de recherche avec suggestions */}
            <div className="relative w-full mb-2" ref={suggestionsRef}>

                <div className="flex space-x-2 items-center">
                    {/* Input avec icône */}
                    <div className="relative flex-1">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Rechercher un service..."
                            value={search}
                            onChange={handleSearchInput}
                            onKeyDown={handleKeyDown}
                            onFocus={() => { if (search.length >= 2 && suggestions.length > 0) { setShowSuggestions(true);  }  }}
                            className="w-full p-2 text-sm border border-r-1 border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#155e7533] pl-9 focus:border-gray-100"
                            style={{ fontSize: "16px" }}/>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

                        {search && (
                            <button onClick={handleClearSearch}  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full transition">
                                <X className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Bouton de recherche */}
                    <button type="button" onClick={handleSearchClick} disabled={isLoading} className="flex items-center justify-center px-4 bg-[#155e75] text-white rounded-lg hover:bg-[#0f4c5b] transition border border-[#155e75] border-l-0 disabled:opacity-50 disabled:cursor-not-allowed" style={{ height: "calc(2.25rem + 4px)", lineHeight: "normal" }} >
                        {isLoading ? <Spinner /> : <Search className="w-4 h-4" />}
                    </button>
                </div>

                {showSuggestions && (

                    <div className="absolute z-50 w-full mt-1 bg-gray-50 backdrop-blur-sm  shadow-xs hide-scrollbar">
                        {isSearchingSuggestions ? (
                            <div className="p-4 flex items-center justify-center">
                                <Spinner />
                                <span className="ml-2 text-sm text-gray-300">Recherche de services...</span>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <>
                                <div className="p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-gray-800"> Suggestions de services </span>
                                        <span className="text-xs text-gray-800">
                                            {suggestions.length} service{suggestions.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs text-[#b07b5e] p-3"> Cliquez sur une suggestion </span>

                                <div className="max-h-50 overflow-y-auto bg-transparent">
                                    {suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                            onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                            className={`w-full text-left p-3 hover:bg-[#155e75]/50 transition-colors flex items-center justify-between ${index === selectedSuggestionIndex ? 'bg-white' : ''}`} >
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm font-medium text-gray-800 truncate">
                                                    {suggestion}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />
                                        </button>
                                    ))}
                                </div>

                            </>
                        ) : (
                            <div className="p-4 text-center">
                                {/* <p className="text-sm text-gray-300">Aucun suggestion correspondant</p> */}
                                <button onClick={handleSearchClick} className="mt-2 text-xs bg-[#155e75] hover:bg-[#0f4c5b] text-white px-3 py-1 rounded transition" >
                                    Rechercher
                                </button>
                            </div>
                        )}
                    </div>

                )}
            </div>

            {/* 🧩 Grille des services */}
            <div className="w-full">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : service.length > 0 ? (
                    <>
                        {/* Grille responsive */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">
                            {service.map((service) => (
                                <div
                                    key={service.id}
                                    onClick={() => handleSelectService(service)}
                                    className={`bg-white rounded-lg p-4 border border-[#b07b5e]/80 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col items-center text-center ${selectedService?.id === service.id ? "ring-2 ring-[#a06a50]" : ""} `} >
                                    {/* Image */}
                                    <div className="w-16 h-16 mb-2 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                        {service.iconUrl ? (
                                            <Image
                                                src={service.iconUrl}
                                                alt={service.title}
                                                width={40}
                                                height={40}
                                                className={`object-contain transition ${selectedService?.id === service.id ? "brightness-200 invert" : ""}`}
                                                unoptimized
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">?</span>
                                        )}
                                    </div>

                                    {/* Texte */}
                                    <h3 className="font-medium text-gray-800 text-sm md:text-[13px] leading-tight mb-1 line-clamp-2">
                                        {truncateText(service.title, 50)}
                                    </h3>
                                </div>
                            ))}
                        </div>

                        {/* Info nombre de services */}
                        <div className="text-center text-xs text-gray-500 mb-2">
                            {search.trim() ? `${service.length} service${service.length > 1 ? "s" : ""} trouvé${service.length > 1 ? "s" : ""}` : `${service.length} service${service.length > 1 ? "s" : ""} disponible${service.length > 1 ? "s" : ""}`}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <Erreurs />
                        <p className="text-sm text-gray-600 mt-2">
                            Aucun service trouvé {search.trim() ? `pour "${search}"` : ""}
                        </p>
                        {search.trim() && (
                            <button
                                onClick={handleClearSearch}
                                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm"
                            >
                                Afficher tous les services
                            </button>
                        )}
                    </div>
                )}
            </div>


            {/* 📄 Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={page}
                    onPageChange={setPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalPages * itemsPerPage} />
            )}

            {selectedService && (
                <MyModal open={open} onClose={() => setOpen(false)}>
                    <ServiceDetails service={selectedService} onClose={() => setOpen(false)} />
                </MyModal>
            )}
        </div>
    );
}