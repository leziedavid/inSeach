"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/interfaces";

import { Table } from "@/components/table/tables/table";
import { UserColumns } from "@/components/table/columns/tableColumns";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { fakeUsers } from "@/data/fakeServices";
import { getAllUsers } from "@/services/securityService";

export default function Page() {
    const [users, setUsers] = useState<User[]>(fakeUsers);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);


    // nous allos aller chcher tous les users via security
    const fetchUsers = async () => {
        setIsReady(true);
        const response = await getAllUsers(currentPage, limit);
        if (response.statusCode === 200 && response.data) {
            setUsers(response.data.data);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.page); // ✅ pas besoin de faire un setTimeout
        } else {
            console.error("Erreur lors du chargement des users :", response.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    },
    [currentPage, limit]);


    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (item: User) => { };

    const handleUpdate = (user: User) => { };

    const handleDeleteMultiple = (user: User[]) => {
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
            <div className="max-w-full mx-auto">
                {/* Ici ton composant de liste de users */}
                <div className="w-full p-4">
                    <h1 className="text-3xl font-bold mb-2">Gestion des users</h1>
                </div>

                <div className="w-full p-4">
                    <Table<User>
                        data={users.slice((currentPage - 1) * limit, currentPage * limit)}
                        columns={UserColumns()}
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
