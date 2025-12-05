"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Service } from "@/types/interfaces";
import { fakeServices } from "@/data/fakeServices";
import { Table } from "@/components/table/tables/table";
import { ServiceColumns } from "@/components/table/columns/tableColumns";

export default function Page() {
    const [services, setServices] = useState<Service[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // Simuler le chargement
    useEffect(() => {
        setIsReady(false); // afficher le loader
        const timer = setTimeout(() => {
            setServices(fakeServices);
            setTotalItems(fakeServices.length);
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

    const handleDelete = async (item: Service) => { };

    const handleUpdate = (user: Service) => { };

    const handleDeleteMultiple = (user: Service[]) => {
        console.log("🧹 Supprimer plusieurs:", user);
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
                {/* Ici ton composant de liste de services */}
                <div className="w-full p-4">
                    <h1 className="text-3xl font-bold mb-2">Gestion des services</h1>
                </div>

                <div className="w-full p-4">
                    <Table<Service>
                        data={services.slice((currentPage - 1) * limit, currentPage * limit)}
                        columns={ServiceColumns()}
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
        </AdminLayout>
    );
}
