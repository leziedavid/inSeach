"use client";

import React, { useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ServiceCategorys from "@/components/admin/ServiceCategory";
import ServiceSubcategorys from "@/components/admin/ServiceSubcategory";
import { CloudDownload } from "lucide-react";

export default function Page() {
    const [activeTab, setActiveTab] = useState<"category" | "subcategory">("category");
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
            console.log("Fichier sélectionné :", file.name);
            // Ici tu peux ajouter la logique pour lire/traiter le fichier
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-full mx-auto px-4 py-1">
                <div className="w-full p-4">
                    {/* Tabs */}
                    <div className="flex flex-wrap sm:flex-nowrap border-gray-300 mb-4 gap-2 items-center overflow-x-auto">
                        {/* Tabs */}
                        <button
                            className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium transition-all ${activeTab === "category"
                                    ? "border-b-2 border-[#b07b5e] text-[#b07b5e]"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setActiveTab("category")}
                        >
                            Catégories
                        </button>
                        <button
                            className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium transition-all ${activeTab === "subcategory"
                                    ? "border-b-2 border-[#b07b5e] text-[#b07b5e]"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                            onClick={() => setActiveTab("subcategory")}
                        >
                            Sous-catégories
                        </button>

                        {/* Bouton Export responsive */}
                        <button
                            className="px-3 py-2 sm:px-4 sm:py-1 flex items-center justify-center font-medium text-white bg-green-800 hover:bg-[#9c6a53] transition-all border rounded-full"
                            onClick={handleFileClick}
                        >
                            {/* Afficher texte sur grand écran, icône sur petit */}
                            <span className="hidden sm:inline">Exporter un fichier</span>
                            <CloudDownload className="w-4 h-4 sm:hidden" />
                        </button>

                        {/* Affichage du nom du fichier choisi */}
                        {selectedFileName && (
                            <span className="ml-2 text-green-600 font-medium truncate max-w-[150px] sm:max-w-[300px]">
                                {selectedFileName}
                            </span>
                        )}

                        {/* Input file caché */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={handleFileChange}
                        />
                    </div>


                    {/* Contenu des tabs */}
                    <div className="mt-4">
                        {activeTab === "category" && <ServiceCategorys />}
                        {activeTab === "subcategory" && <ServiceSubcategorys />}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
