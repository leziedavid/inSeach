"use client";

import React, { useState, useEffect } from "react";
import { ServiceCategory } from "@/types/interfaces";
import { fakeCategories } from "@/data/fakeServices";
import { Table } from "@/components/table/tables/table";
import { ServiceCategoryColumns } from "@/components/table/columns/tableColumns";

export default function ServiceCategorys() {
    const [services, setServices] = useState<ServiceCategory[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // Simuler le chargement
    useEffect(() => {
        setIsReady(false); // afficher le loader
        const timer = setTimeout(() => {
            setServices(fakeCategories);
            setTotalItems(fakeCategories.length);
            setIsReady(true); // masquer le loader
        }, 1500); // délai simulé (1,5 sec)

        return () => clearTimeout(timer); // cleanup si composant démonté
    }, []);

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (item: ServiceCategory) => { };

    const handleUpdate = (user: ServiceCategory) => { };

    const handleDeleteMultiple = (user: ServiceCategory[]) => {
        console.log("🧹 Supprimer plusieurs:", user);
    };

    if (!isReady) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <div className="loader border-4 border-b-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-auto px-4 py-12">
            {/* Ici ton composant de liste de services */}
            <div className="w-full p-4">
                <h1 className="text-3xl font-bold mb-2">Gestion des services</h1>
            </div>

            <div className="w-full p-4">
                <Table<ServiceCategory>
                    data={services.slice((currentPage - 1) * limit, currentPage * limit)}
                    columns={ServiceCategoryColumns()}
                    enableMultiple={true}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    onDeleteMultiple={handleDeleteMultiple}
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                />
            </div>
        </div>
    );
}
