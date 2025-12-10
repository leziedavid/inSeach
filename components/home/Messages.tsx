"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Play, ArrowRight } from "lucide-react";

// ============================
// INTERFACE
// ============================
export interface MessagesData {
    id: string;
    type: "text" | "audio";
    title: string;
    message?: string;
    audioUrl?: string;
    linkText?: string;
    linkHref?: string;
    onClick?: () => void;
}

interface MessagesPlayerProps {
    onCloseMsg: () => void;
    msg?: MessagesData[];
}

export default function MessagesPlayer({ onCloseMsg, msg }: MessagesPlayerProps) {
    const [allMessages, setAllMessages] = useState<MessagesData[]>([]);
    const [visibleIndex, setVisibleIndex] = useState(0);

    // ============================
    // Load & sort messages
    // ============================
    useEffect(() => {
        if (!msg || msg.length === 0) {
            // Ne ferme qu'au premier rendu — pas en boucle
            setAllMessages([]);
            setVisibleIndex(0);
            return;
        }

        const sorted = [...msg].sort((a, b) =>
            a.type === "text" && b.type === "audio" ? -1 : 1
        );

        setAllMessages(sorted);
        setVisibleIndex(0);
    }, [msg]);

    const visibleMessage = allMessages[visibleIndex];

    // ============================
    // CLOSE LOGIC
    // ============================
    const handleClose = useCallback(() => {
        if (visibleIndex < allMessages.length - 1) {
            setVisibleIndex((prev) => prev + 1);
            return;
        }

        // Dernier message → fermeture parent
        onCloseMsg();
        setAllMessages([]);
    }, [visibleIndex, allMessages.length, onCloseMsg]);

    // ============================
    // ESC key to close
    // ============================
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleEsc);

        return () => window.removeEventListener("keydown", handleEsc);
    }, [handleClose]);

    // ============================
    // Nothing to show → return null
    // ============================
    if (!visibleMessage) return null;

    return (
        <div
            className="relative w-full max-w-md mx-auto mt-3 transition-all duration-300 ease-in-out animate-fade-in"
        >
            {/* Close Button */}
            <div className="absolute -top-3 right-4 z-10">
                <button
                    onClick={handleClose}
                    className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-[#b07b5e] hover:text-white transition-all duration-300 hover:scale-105"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* ============================ */}
            {/* TEXT MESSAGE */}
            {/* ============================ */}
            {visibleMessage.type === "text" && (
                <div className="relative bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-3 shadow-lg border border-gray-200 overflow-hidden">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                        {visibleMessage.title}
                    </h3>

                    <p className="text-sm text-slate-700 leading-relaxed">
                        {visibleMessage.message}
                    </p>

                    {/* Link / Button */}
                    {visibleMessage.linkText && (
                        visibleMessage.onClick ? (
                            <button
                                onClick={visibleMessage.onClick}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#b07b5e] hover:text-[#8e5f48] transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                                {visibleMessage.linkText}
                            </button>
                        ) : visibleMessage.linkHref ? (
                            <a
                                href={visibleMessage.linkHref}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#b07b5e] hover:text-[#8e5f48] transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                                {visibleMessage.linkText}
                            </a>
                        ) : null
                    )}
                </div>
            )}

            {/* ============================ */}
            {/* AUDIO MESSAGE */}
            {/* ============================ */}
            {visibleMessage.type === "audio" && (
                <div className="relative bg-white rounded-xl border-2 border-slate-200 p-3 shadow-lg">
                    <div className="flex items-center gap-3">
                        <button className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#b07b5e] hover:bg-[#9a6d54] rounded-full transition-all shadow-sm hover:scale-105">
                            <Play className="w-5 h-5 text-white ml-0.5" />
                        </button>

                        <div className="flex-1 min-w-0">
                            <div className="bg-[#b07b5e33] h-2 rounded-full overflow-hidden">
                                <div className="w-3/5 h-full bg-[#b07b5e] animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {visibleMessage.audioUrl && (
                        <audio controls src={visibleMessage.audioUrl} className="mt-3 w-full" />
                    )}
                </div>
            )}
        </div>
    );
}
