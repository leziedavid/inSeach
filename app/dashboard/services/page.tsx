"use client";

import React, { useState, useEffect } from "react";
import { Service } from "@/types/interfaces";
import { Table } from "@/components/table/tables/table";
import { ServiceColumns } from "@/components/table/columns/tableColumns";
import { listServices } from "@/services/allService";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { fakeServices } from "@/data/fakeServices";

export default function Page() {
    const [services, setServices] = useState<Service[]>(fakeServices);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // nous allos aller chcher tous les users via security
    const fetchServices = async () => {
        setIsReady(true);
        const response = await listServices(currentPage, limit);
        if (response.statusCode === 200 && response.data) {
            setServices(response.data.data);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.page); // ✅ pas besoin de faire un setTimeout
            
        } else {
            console.error("Erreur lors du chargement des services :", response.message);
        }
    };

    useEffect(() => {
        fetchServices();
    },  [currentPage, limit]);


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
