"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type AlertType = "success" | "warning" | "info" | "error";

interface AlertTosterProps {
    message: string;
    type?: AlertType;
    duration?: number; // durée avant fermeture auto
    onClose?: () => void;
}

export default function AlertToster({
    message,
    type = "success",
    duration = 4000,
    onClose,
}: AlertTosterProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const colors = {
        success: {
            bg: "from-green-100 to-green-50 border-green-300",
            icon: <CheckCircle className="h-5 w-5 text-green-600" />,
        },
        warning: {
            bg: "from-yellow-100 to-yellow-50 border-yellow-300",
            icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
        },
        info: {
            bg: "from-[#155e75]/20 to-[#155e75]/10 border-[#155e75]/50",
            icon: <Info className="h-6 w-6 text-[#155e75]" />,
        },
        error: {
            bg: "from-red-100 to-red-50 border-red-300",
            icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
        },
    }[type];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 12 }}
                    className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]" >
                    <div
                        className={`relative bg-gradient-to-r ${colors.bg} border rounded-xl shadow-lg px-5 py-3 min-w-[300px] max-w-[90vw] flex items-center gap-3`}
                    >
                        {/* Icon */}
                        <div className="flex-shrink-0">{colors.icon}</div>

                        {/* Message */}
                        <p className="text-sm font-medium text-gray-800 flex-1 text-center">
                            {message}
                        </p>

                        {/* Bouton fermer “chapeau” */}
                        <button onClick={() => { setVisible(false); onClose?.(); }}
                            className="absolute -top-3 right-3 p-1.5 rounded-full bg-white shadow border hover:bg-[#b07b5e] hover:text-white transition-all duration-300 hover:scale-105">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
