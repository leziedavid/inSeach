"use client";

import React, { useState, useEffect } from "react";

import { Table } from "@/components/table/tables/table";
import { AmenityColumns, UserColumns } from "@/components/table/columns/tableColumns";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
import { Plus } from "lucide-react";
import MyModal from "@/components/modal/MyModal";
import ModalDelete from "@/components/home/ModalDelete";
import { useAlert } from "@/contexts/AlertContext";
import { Amenity } from "@/types/interfaces";
import { createAmenity, paginateAmenities, updateAmenity } from "@/services/annonceAmenityService";
import AmenityForm from "@/components/forms/AmenityForm";
import { is } from "date-fns/locale";

export default function Page() {
    const [amenity, setAmenity] = useState<Amenity[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [open, setOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [selectedAmenity, setSelectAmenity] = useState<Amenity | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showAlert } = useAlert();


    // nous allos aller chcher tous les users via security
    const fetchAmenity = async () => {
        setIsReady(true);
        const response = await paginateAmenities( currentPage, limit);
        if (response.statusCode === 200 && response.data) {
            setAmenity(response.data.data);
            setTotalItems(response.data.total);
            setCurrentPage(response.data.page); // ← pas besoin de faire un setTimeout
        }

    };

    useEffect(() => {
        fetchAmenity();
    },
        [currentPage, limit]);


    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (item: Amenity) => {
        console.log("delete", item);
        setSelectedId(item.id);
        setIsModalOpen(true);
    };

    const handleUpdate = (item: Amenity) => {
        setSelectAmenity(item);
        console.log("update", item);
        setOpen(true);
    };

    const handleDeleteMultiple = (item: Amenity[]) => {
        console.log("🧹 Supprimer plusieurs:", item);
    };


    const addAndOpenModal = (item: Amenity | null) => {
        console.log("addAndOpenModal", item);
        setOpen(true);
    };


const handleSubmit = async (formData: FormData) => {
    try {
        // 🔹 UPDATE
        if (selectedAmenity?.id) {
            // ⚠️ l'id est déjà dans l'URL → on l'enlève du FormData
            formData.delete("id");
            const res = await updateAmenity(selectedAmenity.id, formData);
            if (res.statusCode === 200) {
                fetchAmenity();
                setIsSubmitting(false);
                setOpen(false);
                showAlert(  "L’équipement a été modifié avec succès",  "success",  2000);
            }
            return;
        }

        // 🔹 CREATE
        const res = await createAmenity(formData);

        if (res.statusCode === 201) {
            fetchAmenity();
            setIsSubmitting(false);
            setOpen(false);
            showAlert( "L’équipement a été créé avec succès",  "success",  2000 );
        }

    } catch (error) {
        console.error(  "Erreur lors de la création/mise à jour de l’amenity :",  error );
        showAlert( "Une erreur est survenue lors de la création/mise à jour de l’équipement", "error",  2000);
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
                        Gestion des Équipements d'annonce
                    </h1>

                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" onClick={() => { addAndOpenModal(null); setOpen(true); }} >
                        <Plus className="w-4 h-4" />
                        Ajouter un équipement
                    </button>
                </div>

                <div className="w-full p-4">
                    <Table<Amenity>
                        data={amenity}
                        columns={AmenityColumns()}
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
                    <AmenityForm initialData={selectedAmenity || undefined} onSubmit={handleSubmit} onClose={() => setOpen(false)} isSubmitting={isSubmitting} />
                </MyModal>

                <ModalDelete isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} itemId={selectedId} title="Supprimer ce service ?" />

            </div>
        </AdminLayout>
    );
}
