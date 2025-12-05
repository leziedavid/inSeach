"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface PaginationDotsProps {
    page: number; // page actuelle (1-based)
    totalItems: number; // total des éléments
    onPageChange: (page: number) => void;
    className?: string;
    color?: string;
    itemsPerPage?: number;
}

export default function PaginationDots({
    page,
    totalItems,
    onPageChange,
    className = "",
    color = "#155e75",
    itemsPerPage = 10,
}: PaginationDotsProps) {

    // 🔥 Calcul réel du nombre de pages
    const computedTotalPages = Math.ceil(totalItems / itemsPerPage);

    const prevPage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (page > 1) onPageChange(page - 1);
    };

    const nextPage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (page < computedTotalPages) onPageChange(page + 1);
    };

    if (computedTotalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-4 mt-4 select-none ${className}`}>
            <button
                type="button"
                onClick={prevPage}
                disabled={page === 1}
                aria-label="Page précédente"
                className={`p-2 rounded-full border transition 
                ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 active:scale-95"}`}
            >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex gap-2 relative min-w-[80px] justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-2"
                    >
                        {Array.from({ length: computedTotalPages }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300"
                                animate={{
                                    scale: page === index + 1 ? 1.4 : 1,
                                    backgroundColor: page === index + 1 ? color : "#D1D5DB",
                                }}
                                onClick={() => onPageChange(index + 1)}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <button
                type="button"
                onClick={nextPage}
                disabled={page === computedTotalPages}
                aria-label="Page suivante"
                className={`p-2 rounded-full border transition 
                ${page === computedTotalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 active:scale-95"}`}
            >
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
}
