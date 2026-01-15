"use client";

import React, { useState, useEffect } from "react";
import { ServiceSubcategory } from "@/types/interfaces";
import { fakeSubcategories } from "@/data/fakeServices";

import { Table } from "@/components/table/tables/table";
import { ServiceSubcategoryColumns } from "@/components/table/columns/tableColumns";
import { paginateSubcategories } from "@/services/categoryService";

export default function ServiceSubcategorys() {

    const [services, setServices] = useState<ServiceSubcategory[]>(fakeSubcategories);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // paginateSubcategories
    const getPaginatedSubcategories = async () => {
        setIsReady(true); // afficher le loader
        const response = await paginateSubcategories(currentPage, limit);
        if (response.statusCode === 200 && response.data) {
            setServices(response.data.data);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.page); // ✅ pas besoin de faire un setTimeout

        } else {
            console.error("Erreur lors du chargement des sous-catégories :", response.message);
        }
    };

    useEffect(() => {
        getPaginatedSubcategories();
    }, [currentPage, limit]);

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (item: ServiceSubcategory) => { };

    const handleUpdate = (user: ServiceSubcategory) => { };

    const handleDeleteMultiple = (user: ServiceSubcategory[]) => {
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
            {/* Ici ton composant de liste de services */}
            <div className="w-full p-4">
                <h1 className="text-3xl font-bold mb-2">Gestion des services</h1>
            </div>

            <div className="w-full p-4">
                <Table<ServiceSubcategory>
                    data={services}
                    columns={ServiceSubcategoryColumns()}
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
