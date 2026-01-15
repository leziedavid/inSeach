"use client";

import React, { useState, useEffect } from "react";
import { ServiceCategory } from "@/types/interfaces";
import { Table } from "@/components/table/tables/table";
import { ServiceCategoryColumns } from "@/components/table/columns/tableColumns";
import { fakeCategories } from "@/data/fackeSimules";
import { paginateCategories } from "@/services/categoryService";

export default function ServiceCategorys() {

    const [category, setCategory] = useState<ServiceCategory[]>(fakeCategories);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // paginateCategories
    const getPaginatedCategories = async () => {
        setIsReady(true); // afficher le loader
        const response = await paginateCategories(currentPage, limit);
        if (response.statusCode === 200 && response.data) {
            setCategory(response.data.data);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.page); // ✅ pas besoin de faire un setTimeout

        } else {
            console.error("Erreur lors du chargement des categories :", response.message);
        }
    };

    useEffect(() => {
        getPaginatedCategories();
    }, [currentPage, limit]);


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
        <div className="max-w-full mx-auto">
            {/* Ici ton composant de liste de Category */}
            <div className="w-full p-4">
                <h1 className="text-3xl font-bold mb-2">Gestion des Category</h1>
            </div>

            <div className="w-full p-4">
                <Table<ServiceCategory>
                    data={category}
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
