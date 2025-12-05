"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Icone } from "@/types/interfaces";
import { fakeIcones } from "@/data/fakeServices";
import Image from "next/image";
import Pagination from "@/components/pagination/Paginations";

export default function Page() {
    const [icone, setIcone] = useState<Icone[]>([]);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isReady, setIsReady] = useState(false);

    const limit = 10; // nombre d'icônes par page
    const totalItems = icone.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Charger les icônes (simulé)
    useEffect(() => {
        setIsReady(false);
        const timer = setTimeout(() => {
            setIcone(fakeIcones);
            setIsReady(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleDelete = (id: string) => {
        setIcone((prev) => prev.filter((i) => i.id !== id));
        if (selectedIcon === id) setSelectedIcon(null);
    };

    const onSelectIcon = (id: string) => {
        setSelectedIcon(id);
    };

    // Pagination
    const paginatedIcons = icone.slice((currentPage - 1) * limit, currentPage * limit);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    if (!isReady) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="loader border-4 border-b-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-full mx-auto px-4 py-12">
                <div className="w-full p-4">
                    <h1 className="text-3xl font-bold mb-6">Gestion des icônes</h1>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-[1px]">
                        {paginatedIcons.map((icon) => (
                            <div  key={icon.id} className="relative flex flex-col items-center" >
                                {/* Avatar carré */}
                                <div
                                    onClick={() => onSelectIcon(icon.id)}
                                    className={`
                                    relative
                                    w-16 h-16          /* mobile */
                                    sm:w-18 sm:h-18    /* tablette */
                                    md:w-20 md:h-20    /* desktop */
                                    rounded-lg overflow-hidden cursor-pointer
                                    flex items-center justify-center
                                    border transition-all duration-200 ease-out group ${selectedIcon === icon.id  ? "border-[#b07b5e] ring-2 ring-[#b07b5e]/50 shadow scale-105"   : "border-gray-300 dark:border-gray-700 hover:scale-[1.02]"  }  `}
                                    title={icon.name}  >
                                    <Image src={icon.iconUrl} alt={icon.name} fill className="object-cover" />

                                    {/* Bouton supprimer */}
                                    <div  onClick={(e) => {  e.stopPropagation();  handleDelete(icon.id);   }}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full
                                            w-5 h-5 sm:w-6 sm:h-6
                                            flex items-center justify-center
                                            text-[10px]
                                            shadow-md border border-white
                                            hover:bg-red-600 active:scale-90
                                            transition-all z-30">  ×
                                    </div>
                                </div>

                                {/* Nom */}
                                <span className="text-[10px] sm:text-sm mt-[2px] truncate w-full text-center opacity-80 dark:text-gray-300">
                                    {icon.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            page={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
