"use client";

import { memo } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Icone } from "@/types/interfaces";

interface SelectedIconDisplayProps {
    iconId: string;
    icones: Icone[];
    onEdit: () => void;
}

const SelectedIconDisplay = memo(({ iconId, icones, onEdit }: SelectedIconDisplayProps) => {
    const icon = icones.find((i) => i.id === iconId);
    if (!icon) return null;

    return (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Image
                src={icon.iconUrl}
                alt={icon.name}
                width={32}
                height={32}
                className="object-contain"
            />

            <span className="font-medium text-gray-700 flex-1">{icon.name}</span>

            <button
                type="button"
                onClick={onEdit}
                className="text-[#b07b5e] hover:text-[#155e75] transition-colors p-2 rounded-lg hover:bg-white"
            >
                <Pencil className="w-5 h-5" />
            </button>
        </div>
    );
});

SelectedIconDisplay.displayName = "SelectedIconDisplay";
export default SelectedIconDisplay;
