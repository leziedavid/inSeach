"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

interface PaginationDotsProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    color?: string;
}

export default function PaginationDots({
    page,
    totalPages,
    onPageChange,
    className = "",
    color = "#155e75",
}: PaginationDotsProps) {
    const prevPage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (page > 0) onPageChange(page - 1);
    };

    const nextPage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (page < totalPages - 1) onPageChange(page + 1);
    };

    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-center gap-4 mt-2 select-none ${className}`}>
            <button
                type="button"
                onClick={prevPage}
                disabled={page === 0}
                aria-label="Page précédente"
                className={`p-2 rounded-full border transition ${page === 0 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 active:scale-95"}`}
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
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                                animate={{
                                    scale: i === page ? 1.4 : 1,
                                    backgroundColor: i === page ? color : "#D1D5DB",
                                }}
                            />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <button
                type="button"
                onClick={nextPage}
                disabled={page === totalPages - 1}
                aria-label="Page suivante"
                className={`p-2 rounded-full border transition ${page === totalPages - 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100 active:scale-95"}`}
            >
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
}
