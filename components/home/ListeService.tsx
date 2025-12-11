"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Service, ServiceCategory, ServiceSubcategory, User } from "@/types/interfaces";
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import FormServices from "../forms/FormServices";
import MyModal from "../modal/MyModal";
import { fakeCategories, fakeSubcategories, fakeUsers } from "@/data/fakeServices";
import { listCategories, listSubcategories } from "@/services/categoryService";
import { getMyInfo } from "@/services/securityService";
import { getByUserId } from "@/services/allService";
import { EditIcon, PinIcon, TrashIcon } from "./IconSvg";
import Erreurs from "./Erreurs";
import ModalDelete from "./ModalDelete";

interface ServicesProps {
    services: Service[];
}

function truncateText(text: string, maxLength = 50) {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "...";
}

export default function ListeServices({ services }: ServicesProps) {

    const [open, setOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 5;
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [serviceSubcategories, setServiceSubcategories] = useState<ServiceSubcategory[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [totalPages, setTotalPages] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState("");



    // Pagination items visibles
    const visibleItems = serviceList.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

    // Récupération des services
    const getAllServices = async () => {
        setIsLoading(true);
        const response = await getByUserId(page, itemsPerPage);
        if (response.statusCode === 200 && response.data) {
            setServiceList(response.data.data);
            setTotalPages(response.data.total);
        } else {
            console.error("Erreur récupération services:", response.message);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getAllServices();
    }, [page]);

    // Récupération catégories, sous-catégories et info utilisateur
    useEffect(() => {
        const fetchCategories = async () => {
            const res = await listCategories();
            if (res.statusCode === 200) setServiceCategories(res.data);
        };
        const fetchSubcategories = async () => {
            const res = await listSubcategories();
            if (res.statusCode === 200) setServiceSubcategories(res.data);
        };
        const fetchUserInfo = async () => {
            try {
                const user = await getMyInfo();
                if (user.statusCode === 200) setUserInfo(user.data || null);
            } catch (err) {
                console.error("Erreur récupération utilisateur:", err);
            }
        };

        fetchCategories();
        fetchSubcategories();
        fetchUserInfo();
    }, []);

    // Édition d'un service
    const clicEdit = (service: Service) => {
        setSelectedServices(service);
        setOpen(true);
    };

    // Suppression
    const handleDelete = (service: Service) => {
        setSelectedId(service.id);
        setIsModalOpen(true);
        console.log("🗑️ Suppression demandée pour :", service.title);
    };

    const handleConfirmDelete = (id: string) => {
        console.log("Supprimer l'élément avec id :", id);
        // ici appeler ton API ou fonction du parent
        setIsModalOpen(false);
    };


    // Pin service
    const handlePin = (id: string) => {
        console.log("Pin clicked:", id);
    };

    return (
        <div className="w-full mx-auto p-1 flex flex-col gap-6">
            {/* En-tête */}
            <div className="mb-2 flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-bold text-gray-900">Mes services</h1>
                    <div className="w-23 h-1 bg-[#b07b5e] mt-2"></div>
                </div>

                {/* Bouton + */}
                <button
                    onClick={() => { setSelectedServices(null); setOpen(true); }}
                    className="bg-[#b07b5e] p-2.5 rounded-full hover:bg-gray-200 transition shadow-md"
                >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Liste */}
            <div className="flex flex-col space-y-2">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : serviceList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-3">
                        {visibleItems.map((service) => (
                            <div
                                key={service.id} // ✅ clé unique
                                className="bg-white rounded-lg p-4 border border-[#b07b5e]/80 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col items-center text-center relative"
                            >


                                {/* Image */}
                                <div className="w-16 h-16 mb-2 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                    {service.iconUrl ? (
                                        <Image
                                            src={service.iconUrl}
                                            alt={service.title}
                                            width={40}
                                            height={40}
                                            className="object-contain transition"
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


                                {/* Actions icons - en haut à droite */}
                                <div className="flex items-center space-x-2">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        onClick={() => handlePin(service.id)}
                                    >
                                        {service.pinned
                                            ? <PinIcon size={18} color="#155e75" />
                                            : <PinIcon size={18} />
                                        }
                                    </button>

                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        onClick={() => clicEdit(service)}
                                    >
                                        <EditIcon size={16} color="#b07b5e" />
                                    </button>

                                    <button
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                        onClick={() => handleDelete(service)}
                                    >
                                        <TrashIcon size={16} color="#ff0000ff" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center py-8">
                        <Erreurs />
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination page={page} onPageChange={setPage} itemsPerPage={itemsPerPage} totalItems={totalPages} />
                    </div>
                )}
            </div>


            <ModalDelete isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} itemId={selectedId} title="Supprimer ce service ?" />

            {/* Modal */}
            <MyModal open={open} onClose={() => setOpen(false)} mode="mobile">
                <FormServices
                    onClose={() => setOpen(false)}
                    user={userInfo || fakeUsers[0]}
                    allCategories={serviceCategories || fakeCategories}
                    allSubcategories={serviceSubcategories || fakeSubcategories}
                    mode={selectedServices ? "edit" : "create"}
                    initialData={selectedServices}
                    OnGetAllServices={getAllServices}
                />
            </MyModal>
        </div>
    );
}
