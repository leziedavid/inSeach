"use client";

import { useEffect, useState, memo } from "react";
import Image from "next/image";
import Pagination from "../../pagination/Paginations";
import { listIcons } from "@/services/iconsService";
import { Icone } from "@/types/interfaces";

interface IconSelectorProps {
    selectedIcon: string;
    onSelectIcon: (iconId: string) => void;
    page?: number;           // page initiale
    limit?: number;          // nombre d'icônes par page
    onIconsLoaded?: (icons: Icone[]) => void; // callback quand icônes chargées
}

const IconSelector = memo(({ selectedIcon, onSelectIcon, page = 0, limit = 8, onIconsLoaded }: IconSelectorProps) => {
    const [icones, setIcones] = useState<Icone[]>([]);
    const [currentPage, setCurrentPage] = useState(page);
    const [totalPages, setTotalPages] = useState(0);

    const fetchIcons = async (pageNum: number, pageLimit: number) => {
        try {
            const response = await listIcons(pageNum, pageLimit);

            if (response.statusCode === 200 && response.data) {
                setIcones(response.data.data);
                setTotalPages(response.data.total);

                // Callback pour parent si besoin
                if (onIconsLoaded) onIconsLoaded(response.data.data);
            }
        } catch (err) {
            console.error("Erreur icônes :", err);
        }
    };

    // Charger les icônes au montage et quand page change
    useEffect(() => {
        fetchIcons(currentPage, limit);
    }, [currentPage, limit]);

    return (
        <div>

            <div className="grid grid-cols-4 gap-2 text-center">
                {icones.map((icon) => (
                    <button
                        key={icon.id}
                        type="button"
                        onClick={() => onSelectIcon(icon.id)}
                        className={`flex flex-col items-center p-2 border rounded-lg transition-all ${selectedIcon === icon.id
                                ? "border-[#b07b5e] bg-[#b07b5e]/10 shadow-sm"
                                : "border-gray-200 hover:border-[#b07b5e]/40 hover:shadow-sm"
                            }`}
                    >
                        <Image
                            src={icon.iconUrl}
                            alt={icon.name}
                            width={32}
                            height={32}
                            className="mb-2 object-contain"
                        />
                    </button>
                ))}
            </div>

            <Pagination
                page={page}
                onPageChange={setCurrentPage}
                itemsPerPage={limit}
                totalItems={totalPages} />

        </div>
    );
});

IconSelector.displayName = "IconSelector";
export default IconSelector;
