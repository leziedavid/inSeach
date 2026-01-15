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

export default function SearchPrestations() {

    const [open, setOpen] = useState(false);
    const [selectedServices, setSelectedServices] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
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
        <div className="w-full max-w-full">

            <div className="relative w-full mt-4" >
                {/* En-tête */}

                <div className="mb-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-sm font-bold text-gray-900"> Mes services</h1>
                        <div className="w-23 h-1 bg-[#b07b5e] mt-2"></div>
                    </div>
                    {/* Bouton + */}
                    <button onClick={() => {
                        setSelectedServices(null)
                        setOpen(true)
                    }}
                        className="flex items-center gap-2 bg-[#b07b5e] px-4 py-2.5 rounded-full hover:bg-[#9c6b52] transition shadow-md">
                        <Plus className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white whitespace-nowrap"> Nouveau service </span>
                    </button>

                </div>

            </div>


            {/* 🧩 Grille des services */}
            <div className="w-full mt-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Spinner />
                    </div>
                ) : serviceList.length > 0 ? (
                    <>


                        <div className="grid grid-cols-3 auto-rows-auto gap-x-2 gap-y-8">
                            {serviceList.map((service, index) => (
                                <div key={service.id} className="relative rounded-xl transition-all duration-200 overflow-hidden mb-10 bg-cover ">
                                    <div className="flex flex-col items-center mt-4 mb-4 ">
                                        {/* Icône */}
                                        <div className="flex justify-center items-center w-14 h-14 rounded-full bg-slate-100 cursor-pointer transition-all duration-200 hover:scale-[1.05] hover:shadow-lg hover:shadow-slate-100/70 ">
                                            {service.iconUrl ? (
                                                <Image src={service.iconUrl} alt={service.title} width={40} height={40} className="object-contain" />
                                            ) : (
                                                <span className="text-gray-400 text-sm">?</span>
                                            )}
                                        </div>

                                        {/* Label */}
                                        <div className="mt-2 text-center">
                                            <p className="text-[0.8rem] font-medium text-slate-700"> {truncateText(service.title, 50)}  </p>
                                        </div>

                                        {/* Actions icons - en haut à droite */}
                                        <div className="flex items-center space-x-2">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => handlePin(service.id)} >
                                                {service.pinned ? <PinIcon size={18} color="#155e75" /> : <PinIcon size={18} />}
                                            </button>

                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => clicEdit(service)} >
                                                <EditIcon size={16} color="#b07b5e" />
                                            </button>

                                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" onClick={() => handleDelete(service)} >
                                                <TrashIcon size={16} color="#ff0000ff" />
                                            </button>
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
                            Aucun service trouvé
                        </p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination page={page} onPageChange={setPage} itemsPerPage={itemsPerPage} totalItems={totalPages} />
                </div>
            )}

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
