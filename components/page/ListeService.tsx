"use client"


import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Service, ServiceCategory, ServiceSubcategory, User } from "@/types/interfaces";
import { Spinner } from "../forms/spinner/Loader";
import Pagination from "../pagination/Paginations";
import FormServices from "../forms/FormServices";
import MyModal from "../modal/MyModal";
import { fakeCategories, fakeSubcategories, fakeUsers } from "@/data/fakeServices";
import { EditIcon, PinIcon, TrashIcon } from "./IconSvg";
import Erreurs from "./Erreurs";
import { listCategories, listSubcategories } from "@/services/categoryService";
import { getMyInfo } from "@/services/securityService";
import { getByUserId } from "@/services/allService";

interface ServicesProps {
    services: Service[];
}

function truncateText(text: string, maxLength = 50) {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + "...";
}

export default function ListeServices({ services }: ServicesProps) {

    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const itemsPerPage = 5;

    // Pagination
    const visibleItems = services.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [serviceSubcategories, setServiceSubcategories] = useState<ServiceSubcategory[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [service, setServices] = useState<Service[]>([]);
    const [totalPages, setTotalPages] = useState(0);


    const getAllServices = async () => {
        setIsLoading(true);
        const response = await getByUserId(page,itemsPerPage);
        if (response.statusCode === 200 && response.data) {
            setServices(response.data.data);
            setTotalPages(response.data.total);
            console.log("data", response.data);
            setIsLoading(false);
        } else {
            console.log("error", response.message);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getAllServices();
    }, [page]);



    // nous allons aller chercher les categorie
    const geServiceCategories = async () => {
        const response = await listCategories();
        if (response.statusCode == 200) {
            setServiceCategories(response.data);
            console.log("data", response.data);
        } else {
            console.log("error", response.message);
        }
    };

    const getServiceSubcategories = async () => {
        const response = await listSubcategories();
        if (response.statusCode == 200) {
            setServiceSubcategories(response.data);
            console.log("data", response.data);
        } else {
            console.log("error", response.message);
        }
    };

    const getUserInfo = async () => {
        try {
            const user = await getMyInfo();
            if (user.statusCode == 200) {
                setUserInfo(user.data || null);
                console.log("data", user.data);
            } else {
                console.log("error", user.message);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des informations utilisateur :", err);
        }
    };

    useEffect(() => {
        geServiceCategories();
        getServiceSubcategories();
        getUserInfo();
    }, []);


    // Édition
    const clicEdit = (service: Service) => {
        setSelectedServices(service);
        setOpen(true);
    };

    // Suppression
    const handleDelete = (service: Service) => {
        console.log("🗑️ Suppression demandée pour :", service.title);
    };

    const handlePin = async (id: string) => {
        console.log("Pin clicked:", id);
        // ton API ou logique ici...
    };

    return (
        <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-6">
            {/* En-tête */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-sm font-bold text-gray-900">Mes services</h1>
                    <div className="w-23 h-1 bg-[#b07b5e] mt-2"></div>
                </div>

                {/* Bouton + */}
                <button onClick={() => { setSelectedServices(null); setOpen(true); }} className="bg-[#b07b5e] p-2.5 rounded-full hover:bg-gray-200 transition shadow-md" >
                    <Plus className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Liste */}
            <div className="flex flex-col space-y-2">

                <div className="space-y-4">

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Spinner />
                        </div>
                    ) : service.length > 0 ? (

                        service.map((service, index) => {
                            return (
                                <div key={index} className="flex items-center  justify-between bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition">

                                    <div className="flex items-start space-x-3 flex-1">
                                        {/* <pre>{JSON.stringify(service, null, 2)}</pre> */}

                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                            {service.iconUrl ? (
                                                <Image src={service.iconUrl} alt={service.icone?.name || "icon"} width={28} height={28} className={`object-contain ${selectedService === service.id ? "brightness-200 invert" : ""}`} unoptimized />
                                            ) : (
                                                <span className={`text-sm font-semibold ${selectedService === service.id ? "text-white" : "text-gray-500"}`} >
                                                    ?
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 ">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="font-medium text-gray-900 text-sm ">  {truncateText(service.title)}</h3>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Actions icons - alignées horizontalement */}
                                    <div className="flex items-center space-x-1 ml-3  transition-opacity">
                                        <button className="p-1 hover:bg-gray-200 rounded transition-colors" onClick={() => handlePin(service.id)}  >
                                            {service.pinned ? (<PinIcon size={18} color="#155e75" />) : (<PinIcon size={18} />)}
                                        </button>

                                        <button onClick={() => clicEdit(service)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                            <EditIcon size={16} color="#b07b5e" />
                                        </button>
                                        <button onClick={() => handleDelete(service)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                                            <TrashIcon size={16} color="#ff0000ff" />
                                        </button>
                                    </div>

                                </div>

                            );
                        })
                    ) : (
                        <div className="flex justify-center py-1">
                            <Erreurs />
                        </div>
                    )}

                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            page={page}
                            onPageChange={setPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalPages}
                        />
                    </div>
                )}

            </div>

            {/* Modal fakeUsers[0] */}
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
};
