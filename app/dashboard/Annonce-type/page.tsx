"use client";

import React, { useState, useEffect } from "react";
import { AnnonceType } from "@/types/interfaces";

import { Table } from "@/components/table/tables/table";
import { AnnonceTypeColumns } from "@/components/table/columns/tableColumns";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { Plus } from "lucide-react";
import MyModal from "@/components/modal/MyModal";
import ModalDelete from "@/components/home/ModalDelete";
import { MessagesData } from "@/components/home/Messages";
import { useAlert } from "@/contexts/AlertContext";
import {createAnnonceTypeBatch, paginateAnnonceTypes, updateAnnonceType } from "@/services/annonceTypeService";
import AnnonceTypeForm, { AnnonceTypeFormValues } from "@/components/forms/AnnonceTypeForm";

export default function Page() {
    const [types, categoriesTypes] = useState<AnnonceType[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [SelectTypes, setSelectTypes] = useState<AnnonceType | null>(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [msg, setMsg] = useState<MessagesData[]>([]);
    const { showAlert } = useAlert();


    // nous allos aller chcher tous les users via security
    const fetchCategories = async () => {
        setIsReady(true);
        const response = await paginateAnnonceTypes();
        if (response.statusCode === 200 && response.data) {
            categoriesTypes(response.data.data);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.page); // ← pas besoin de faire un setTimeout
        } else {
            console.error("Erreur lors du chargement des categories :", response.message);
        }

    };

    useEffect(() => {
        fetchCategories();
    },
        [currentPage, limit]);


    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (item: AnnonceType) => {
        console.log("delete", item);
        setSelectedId(item.id);
        setIsModalOpen(true);
    };

    const handleUpdate = (item: AnnonceType) => {
        setSelectTypes(item);
        console.log("update", item);
        setIsUpdate(true);
        setOpen(true);
    };

    const handleDeleteMultiple = (item: AnnonceType[]) => {
        console.log("🧹 Supprimer plusieurs:", item);
    };


    const addAndOpenModal = (item: AnnonceType | null) => {
        console.log("addAndOpenModal", item);
        setOpen(true);
    };


    const handleSubmit = async (data: AnnonceTypeFormValues) => {
        const category = data.types[0]; // récupère l'objet unique

        try {
            if (category.id) {
                // TypeScript sait maintenant que category.id est défini
                const res = await updateAnnonceType(category.id, category);
                if (res.statusCode === 200) {
                    fetchCategories();
                    setIsUpdate(false);
                    setOpen(false);
                    showAlert('La catégorie a été modifiée avec succès', 'success', 2000);
                }
            } else {
                // Création batch
                const res = await createAnnonceTypeBatch(data.types);
                if (res.statusCode === 201) {
                    fetchCategories();
                    setIsUpdate(false);
                    setOpen(false);
                    showAlert('Les catégories ont été créées avec succès', 'success', 2000);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la création/mise à jour de la catégorie :", error);
            showAlert('Une erreur est survenue lors de la création/mise à jour de la catégorie', 'error', 2000);
        }
    };


    const handleConfirmDelete = (id: string) => {
        console.log("Supprimer l'élément avec id :", id);
        setIsModalOpen(false);
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
                <div className="w-full p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Gestion des types d'annonce
                    </h1>

                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" onClick={() => { addAndOpenModal(null); setOpen(true); }} >
                        <Plus className="w-4 h-4" />
                        Ajouter un type
                    </button>
                </div>



                <div className="w-full p-4">
                    <Table<AnnonceType>
                        data={types}
                        columns={AnnonceTypeColumns()}
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



                <MyModal open={open} onClose={() => setOpen(false)}>
                    <AnnonceTypeForm initialData={SelectTypes || undefined} onSubmit={handleSubmit} isUpdate={isUpdate} />
                </MyModal>

                <ModalDelete isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} itemId={selectedId} title="Supprimer ce service ?" />

            </div>
        </AdminLayout>
    );
}



// export enum AnnonceType {
//     VENTE = 'Vente',                          // Vente de biens immobiliers (maisons, appartements, terrains)
//     LOCATION = 'Location',                    // Location longue durée (appartements, maisons)
//     RESIDENCE_MEUBLEE = 'Résidence meublée', // Location courte durée ou meublée
//     HÔTEL = 'Hôtel / Hébergement',           // Pour hôtels, auberges ou maisons d’hôtes
//     BUREAUX_COMMERCE = 'Bureaux & Commerce', // Locaux commerciaux, bureaux, boutiques
//     TERRAIN = 'Terrain',                      // Vente ou location de terrains
//     COLOCATION = 'Colocation',                // Chambres en colocation
//     GARAGE_PARKING = 'Garage / Parking',      // Places de parking, garages à louer ou vendre
//     AUTRE = 'Autre',                          // Tout autre type d’annonce immobilière spécifique
// }
