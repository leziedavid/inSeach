"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { X, Trash2,LogIn } from "lucide-react";

interface ModalDeleteProps {
    isOpen: boolean; // état du modal
    onClose: () => void; // fonction pour fermer
    onConfirm: (id: string) => void; // fonction de suppression du parent
    itemId: string; // id de l'élément à supprimer
    title?: string; // titre à afficher (optionnel)
    message?: string; // message de confirmation
    cancelText?: string; // texte du bouton annuler
    confirmText?: string; // texte du bouton confirmer
    confirmIcon?: ReactNode; // icône du bouton confirmer
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
    isOpen,
    onClose,
    onConfirm,
    itemId,
    title = "Confirmer la suppression",
    message = "Êtes-vous sûr de vouloir supprimer cet élément ?",
    cancelText = "Annuler",
    confirmText = "Valider",
    confirmIcon = <Trash2 className="w-4 h-4" />, }) => {
    const [show, setShow] = useState(isOpen);

    // Gère l'animation d'entrée/sortie
    useEffect(() => {
        if (isOpen) setShow(true);
    }, [isOpen]);

    const handleClose = () => {
        setShow(false);
        setTimeout(() => onClose(), 300);
    };

    if (!isOpen && !show) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 transition-opacity ${show ? "opacity-100" : "opacity-0" }`}  onClick={handleClose}  >
            <div className={`bg-white rounded-2xl w-full max-w-md p-6 shadow-xl transform transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"  }`} onClick={(e) => e.stopPropagation()} >
                {/* En-tête */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <p className="text-sm text-gray-700 mb-6">{message}</p>

                {/* Boutons */}
                <div className="flex justify-end space-x-3">
                    <button  onClick={handleClose}  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition" >
                        {cancelText}
                    </button>
                    <button  onClick={() => onConfirm(itemId)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1" >
                        {confirmIcon}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDelete;
