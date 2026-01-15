"use client";

import React, { useRef, useState } from "react";
import ServiceCategorys from "@/components/admin/ServiceCategory";
import ServiceSubcategorys from "@/components/admin/ServiceSubcategory";
import { CloudDownload } from "lucide-react";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";

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
            <div className="max-w-full mx-auto">
                <div className="w-full p-4">
                    {/* Tabs */}

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 overflow-x-auto mb-4 px-1 sm:px-0">

                        {/* Tabs */}
                        <button  className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-200 ${activeTab === "category"  ? "bg-[#f0e5db] text-[#b07b5e] shadow-inner" : "text-gray-500 hover:bg-gray-100"  }`}  onClick={() => setActiveTab("category")}  >
                            Catégories
                        </button>

                        <button  className={`px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium rounded-full transition-all duration-200 ${activeTab === "subcategory"  ? "bg-[#f0e5db] text-[#b07b5e] shadow-inner"  : "text-gray-500 hover:bg-gray-100"   }`}    onClick={() => setActiveTab("subcategory")}  >
                            Sous-catégories
                        </button>

                        {/* Bouton Export responsive */}
                        <button  className="flex items-center justify-center px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base font-medium text-white bg-green-700 hover:bg-green-800 rounded-full transition-all duration-200 shadow-md whitespace-nowrap"  onClick={handleFileClick} >
                            <span className="hidden sm:inline">Exporter un fichier</span>
                            <CloudDownload className="w-4 h-4 sm:hidden" />
                        </button>

                        {/* Affichage du nom du fichier choisi */}
                        {selectedFileName && (
                            <span className="ml-2 text-green-600 font-medium truncate max-w-[120px] sm:max-w-[250px]">
                                {selectedFileName}
                            </span>
                        )}
                        {/* Input file caché */}
                        <input  type="file"  ref={fileInputRef}   className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={handleFileChange} />
                    </div>

                    {/* Contenu des tabs */}
                    <div className="">
                        {activeTab === "category" && <ServiceCategorys />}
                        {activeTab === "subcategory" && <ServiceSubcategorys />}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
