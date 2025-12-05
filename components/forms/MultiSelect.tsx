"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
    data: { id: string; label: string }[];
    onSelect: (selected: string[] | string) => void;
    multiple?: boolean;
    placeholder?: string;
    className?: string;
    defaultValue?: string | string[];
    disabled?: boolean; // ✅ nouvelle prop
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    data,
    onSelect,
    multiple = false,
    placeholder = "Rechercher...",
    className,
    defaultValue,
    disabled = false, // ✅ valeur par défaut
}) => {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<string[]>(
        Array.isArray(defaultValue)
            ? defaultValue
            : defaultValue
                ? [defaultValue]
                : []
    );
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (defaultValue) {
            setSelected(
                Array.isArray(defaultValue) ? defaultValue : [defaultValue]
            );
        }
    }, [defaultValue]);

    const filteredData = useMemo(() => {
        if (!query.trim()) return data;
        return data.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );
    }, [data, query]);

    const handleSelect = (id: string) => {
        if (disabled) return; // 🚫 bloque toute interaction
        let newSelection: string[];

        if (multiple) {
            const alreadySelected = selected.includes(id);
            newSelection = alreadySelected
                ? selected.filter((s) => s !== id)
                : [...selected, id];
        } else {
            newSelection = [id];
            setIsOpen(false);
            setQuery("");
        }

        setSelected(newSelection);
        onSelect(multiple ? newSelection : newSelection[0]);
    };

    const removeSelected = (id: string, e: React.MouseEvent) => {
        if (disabled) return; // 🚫 empêche suppression
        e.stopPropagation();
        const newSelection = selected.filter((s) => s !== id);
        setSelected(newSelection);
        onSelect(multiple ? newSelection : "");
    };

    const toggleDropdown = (e?: React.MouseEvent) => {
        if (disabled) return; // 🚫 bloque ouverture
        e?.stopPropagation();
        setIsOpen((prev) => {
            const newState = !prev;
            if (newState) inputRef.current?.focus();
            return newState;
        });
    };

    // ✅ Ferme quand on clique à l’extérieur
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedItems = data.filter((item) => selected.includes(item.id));

    return (
        <div
            ref={containerRef}
            className={cn("w-full relative", className, disabled && "opacity-70")}
        >
            {/* Barre principale */}
            <div
                className={cn(
                    "flex items-center bg-gray-100 rounded-xl px-3 py-2 cursor-text relative transition",
                    disabled
                        ? "cursor-not-allowed bg-gray-200 border border-gray-300"
                        : "hover:bg-gray-50"
                )}
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(true);
                        inputRef.current?.focus();
                    }
                }}
            >
                <Search
                    className={cn(
                        "w-4 h-4 flex-shrink-0 mr-2",
                        disabled ? "text-gray-400" : "text-gray-500"
                    )}
                />

                <input
                    ref={inputRef}
                    type="text"
                    placeholder={selectedItems.length > 0 ? "" : placeholder}
                    value={query}
                    onChange={(e) => {
                        if (disabled) return;
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    disabled={disabled} // ✅ empêche saisie
                    className={cn(
                        "flex-1 bg-transparent text-sm placeholder:text-gray-400 focus:outline-none",
                        disabled ? "text-gray-500" : "text-gray-700"
                    )}
                    style={{ fontSize: "16px" }}
                />

                <button
                    type="button"
                    onClick={toggleDropdown}
                    disabled={disabled}
                    className={cn(
                        "absolute right-3 transition-colors flex-shrink-0",
                        disabled
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Liste déroulante */}
            {!disabled && isOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                    {filteredData.length > 0 ? (
                        <div className="py-2">
                            {filteredData.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleSelect(item.id)}
                                    className={cn(
                                        "px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-between",
                                        selected.includes(item.id) && "bg-[#b07b5e33]"
                                    )}
                                >
                                    <span className="text-sm text-gray-700">{item.label}</span>
                                    {selected.includes(item.id) && (
                                        <div className="w-2 h-2 bg-[#b07b5e] rounded-full" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            Aucun résultat trouvé
                        </div>
                    )}
                </div>
            )}

            {/* Sélections */}
            {selectedItems.length > 0 && (
                <div
                    className={cn(
                        "flex flex-wrap gap-2 mt-3",
                        selectedItems.length > 4 && "max-h-32 overflow-y-auto"
                    )}
                >
                    {selectedItems.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "flex items-center gap-1 px-3 py-1 rounded-full border text-gray-800",
                                "bg-[#b07b5e33] border-[#b07b5e55]",
                                disabled && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            <span className="text-xs whitespace-nowrap">
                                {item.label}
                            </span>
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={(e) => removeSelected(item.id, e)}
                                    className="flex-shrink-0 w-3 h-3 rounded-full hover:bg-[#b07b5e55] flex items-center justify-center"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
