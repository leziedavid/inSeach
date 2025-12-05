"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MyModalProps {
    open?: boolean;
    onClose?: () => void;
    children: React.ReactNode;
    className?: string;
    /**
     * mode="mobile"  👉 désactive le swipe pour fermer
     * mode="default" 👉 conserve le comportement normal
     */
    mode?: "mobile" | "default";
}

export default function MyModal({
    open = false,
    onClose,
    children,
    className,
    mode = "default",
}: MyModalProps) {
    const [isOpen, setIsOpen] = React.useState(open);
    const startY = React.useRef<number | null>(null);
    const deltaY = React.useRef<number>(0);

    React.useEffect(() => setIsOpen(open), [open]);

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    // === Swipe vers le bas pour fermer (désactivé en mode mobile)
    const handleTouchStart = (e: React.TouchEvent) => {
        if (mode === "mobile") return;
        startY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        if (mode === "mobile") return;
        if (startY.current !== null) {
            deltaY.current = e.touches[0].clientY - startY.current;
        }
    };
    const handleTouchEnd = () => {
        if (mode === "mobile") return;
        if (deltaY.current > 120) handleClose();
        startY.current = null;
        deltaY.current = 0;
    };

    // === Bloque le scroll du body quand ouvert
    React.useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* === Overlay === */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* === Modal principal === */}
                    <motion.div
                        className={cn(
                            "fixed z-[9999] flex flex-col w-full bg-white dark:bg-neutral-900 shadow-xl rounded-t-2xl",
                            "bottom-0 left-0 sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:rounded-2xl",
                            "max-h-[85vh] sm:max-h-[90vh] overflow-hidden",
                            className
                        )}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 260, damping: 26 }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {/* === Barre de drag (mobile uniquement) === */}
                        <div className="sm:hidden flex justify-center pt-2">
                            <div className="w-10 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        </div>

                        {/* === Contenu scrollable === */}
                        <div className="flex-1 overflow-y-auto px-5 pb-6 sm:pb-8 pt-3">
                            {children}
                        </div>
                    </motion.div>

                    {/* === Bouton X “en chapeau” (légèrement plus haut) === */}
                    <motion.button
                        onClick={handleClose}
                        className={cn(
                            "fixed z-[10000] p-2 rounded-full bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-gray-700",
                            "right-4 top-[calc(5vh-22px)] sm:top-[calc(50%-255px)]", // 🔼 légèrement plus haut
                            "hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        )}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </motion.button>
                </>
            )}
        </AnimatePresence>
    );
}
