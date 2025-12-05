"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmsModalProps {
    open?: boolean;
    onClose?: () => void;
    message: string;
    action?: string;
    id?: string | number;
    type?: "success" | "error" | "info";
    className?: string;
    onAction?: (id?: string | number) => void; // ✅ ajout de la prop
}

export default function SmsModal({
    open = false,
    onClose,
    message,
    action,
    id,
    type = "info",
    className,
    onAction, // ✅ récupère la prop
}: SmsModalProps) {
    const [isOpen, setIsOpen] = React.useState(open);
    const startY = React.useRef<number | null>(null);
    const deltaY = React.useRef<number>(0);

    React.useEffect(() => setIsOpen(open), [open]);

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    // ✅ Fonction appelée au clic sur le bouton d’action
    const handleAction = () => {
        onAction?.(id); // exécute la fonction parent
        handleClose(); // ferme automatiquement le modal
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        if (startY.current !== null) {
            deltaY.current = e.touches[0].clientY - startY.current;
        }
    };
    const handleTouchEnd = () => {
        if (deltaY.current > 100) handleClose();
        startY.current = null;
        deltaY.current = 0;
    };

    const getColor = () => {
        switch (type) {
            case "success":
                return "bg-green-50 text-green-700 border border-green-200";
            case "error":
                return "bg-red-50 text-red-700 border border-red-200";
            default:
                return "bg-blue-50 text-blue-700 border border-blue-200";
        }
    };

    const emoji = {
        success: "✅",
        error: "⚠️",
        info: "💬",
    }[type];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Contenu modal */}
                    <motion.div
                        className={cn(
                            "fixed z-50 bottom-0 left-0 w-full rounded-t-2xl bg-white dark:bg-neutral-900 shadow-xl p-6",
                            "sm:top-1/2 sm:left-1/2 sm:w-auto sm:max-w-md sm:rounded-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:bottom-auto",
                            "max-h-[90vh] overflow-y-auto",
                            className
                        )}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* Bouton fermer */}
                        <div className="absolute top-2 right-4">
                            <button
                                onClick={handleClose}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>

                        {/* Barre draggable mobile */}
                        <div className="mx-auto mt-1 mb-3 w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 sm:hidden" />

                        {/* Contenu principal */}
                        <div className={cn("flex items-center gap-3 p-4 rounded-lg", getColor())}>
                            <span className="text-2xl">{emoji}</span>
                            <p className="text-base font-medium">{message}</p>
                        </div>

                        {/* Bouton d’action */}
                        {action && (
                            <div className="mt-6">
                                <button onClick={handleAction} className={cn( "w-full py-2.5 rounded-xl font-semibold text-white transition", type === "success" ? "bg-green-600 hover:bg-green-700"  : type === "error"  ? "bg-red-600 hover:bg-red-700"  : "bg-blue-600 hover:bg-blue-700" )}  >
                                    {action}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
