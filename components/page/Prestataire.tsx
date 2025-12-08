"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { Service } from "@/types/interfaces";
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import FormServices from "../forms/FormServices";
import fakeUsers from "@/data/fakeUsers";
import MyModal from "../modal/MyModal";
import { fakeCategories, fakeSubcategories } from "@/data/fakeServices";

interface PrestataireProps {
    services: Service[];
}

function truncateText(text: string, maxLength = 50) {

    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "...";
}

export default function Prestataire({ services }: PrestataireProps) {

    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 5;
    const [sponsoredIds, setSponsoredIds] = useState<string[]>([]); // ✅ Services sponsorisés
    // Pagination
    const totalPages = Math.ceil(services.length / itemsPerPage);
    const visibleItems = services.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    // Sélection
    const handleSelectService = (id: string) => {
        setSelectedService(id);
    };

    // Édition
    const clicEdit = (service: Service) => {
        setSelectedServices(service);
        setOpen(true);
    };

    // Suppression
    const handleDelete = (service: Service) => {
        console.log("🗑️ Suppression demandée pour :", service.title);
    };

    // ✅ Toggle sponsorisé par service
    const toggleSponsored = (id: string) => {
        setSponsoredIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    return (

        <div className="relative w-full mb-8 mt-4">
            {/* En-tête */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-bold text-gray-900">Mes services</h1>
                    <div className="w-32 h-1 bg-[#b07b5e] mt-2"></div>
                </div>

                {/* Bouton + */}
                <button onClick={() => { setSelectedServices(null); setOpen(true); }} className="bg-[#b07b5e] p-2.5 rounded-full hover:bg-[#a06a50] transition shadow-md" >
                    <Plus className="w-3 h-3 text-white" />
                </button>
            </div>

            {/* Liste */}
            <div className="flex flex-col space-y-3">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : visibleItems.length > 0 ? (
                    visibleItems.map((service) => {
                        const isSponsored = sponsoredIds.includes(service.id);
                        return (
                            <div key={service.id} className="flex items-center justify-between bg-white hover:bg-gray-100 transition rounded-xl p-3 shadow-sm" >
                                {/* Bloc gauche */}
                                <div onClick={() => handleSelectService(service.id)} className="flex items-center gap-3 cursor-pointer"  >
                                    <div
                                        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${selectedService === service.id ? "bg-[#a06a50]" : "bg-white border border-gray-200"}`} >
                                        {service.icone?.iconUrl ? (
                                            <Image src={service.icone.iconUrl} alt={service.icone.name} width={28} height={28} className={`object-contain ${selectedService === service.id ? "brightness-200 invert" : ""}`}  unoptimized/>
                                        ) : (
                                            <span className={`text-sm font-semibold ${selectedService === service.id ? "text-white" : "text-gray-500"}`} >
                                                ?
                                            </span>
                                        )}
                                    </div>

                                    {/* Nom du service + Badge */}
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-gray-900">
                                            {truncateText(service.title)}
                                        </span>

                                        {/* ✅ Petit badge sponsorisé */}
                                        <button onClick={(e) => { e.stopPropagation(); toggleSponsored(service.id); }} className={`text-[10px] mt-1 px-2 py-[2px] rounded-full font-semibold tracking-tight transition-all ${isSponsored ? "bg-[#a06a50] text-white min-w-[68px] text-center" : "bg-gray-300 text-gray-700 hover:bg-[#c6b0a3] min-w-[68px] text-center"}`} >
                                            {isSponsored ? "✔︎" : "☆ Sponsoriser"}
                                        </button>

                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button onClick={() => clicEdit(service)} className="p-2 rounded-full hover:bg-gray-200 transition">
                                        <SquarePen className="w-5 h-5 text-[#b07b5e]" />
                                    </button>

                                    <button onClick={() => handleDelete(service)} className="p-2 rounded-full hover:bg-red-100 transition" >
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        Aucun service trouvé
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-2">

                    <Pagination
                        page={page}
                        onPageChange={setPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalPages} />
                </div>
            )}

            {/* Modal */}
            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile">
                <FormServices
                    onClose={() => setOpen(false)}
                    user={fakeUsers[0]}
                    allCategories={fakeCategories}
                    allSubcategories={fakeSubcategories}
                    mode={selectedServices ? "edit" : "create"}
                    initialData={selectedServices}
                    OnGetAllServices={() => { }}
                />
            </MyModal>
        </div>

    );
}
