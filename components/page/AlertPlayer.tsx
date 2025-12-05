"use client";

import { useState, useEffect } from "react";
import { X, Play, ArrowRight } from "lucide-react";

// ============================
// INTERFACE ALERT
// ============================
export interface AlertData {
    id: string;
    type: "text" | "audio";
    title: string;
    message?: string;
    audioUrl?: string;
    linkText?: string;
    linkHref?: string;
    onClick?: () => void;
}

// ============================
// FAKE DATA (fallback)
// ============================
const defaultAlerts: AlertData[] = [
    {
        id: "1",
        type: "text",
        title: "Problème technique",
        message:
            "Nous rencontrons un petit problème technique. Merci de votre patience pendant la résolution du souci.",
    },
    {
        id: "3",
        type: "text",
        title: "Vérification d’identité requise",
        message:
            "Merci d’ajouter votre pièce d’identité pour pouvoir proposer des services.",
        linkText: "Cliquez ici",
        linkHref: "/verification-identite",
    },
    {
        id: "2",
        type: "audio",
        title: "Annonce vocale",
        audioUrl: "/audio/alerte.mp3",
    },
];

interface AlertPlayerProps {
    alerts?: AlertData[];
    autoPlay?: boolean; // ✅ Nouvelle prop pour lancer automatiquement ou attendre le clic
}

export default function AlertPlayer({ alerts, autoPlay = false }: AlertPlayerProps) {
    const [allAlerts, setAllAlerts] = useState<AlertData[]>(alerts?.length ? alerts : defaultAlerts);
    const [visibleIndex, setVisibleIndex] = useState(autoPlay ? 0 : -1); // si autoPlay false, on attend le clic

    // Trier les alertes (texte d'abord, audio ensuite)
    useEffect(() => {
        const sorted = [...(alerts?.length ? alerts : defaultAlerts)].sort((a, b) =>  a.type === "text" && b.type === "audio" ? -1 : 1);
        setAllAlerts(sorted);
        if (autoPlay) setVisibleIndex(0);
        }, [alerts, autoPlay]);

    const visibleAlert = allAlerts[visibleIndex];

    const handleClose = () => {
        if (visibleIndex < allAlerts.length - 1) {
            setVisibleIndex((prev) => prev + 1);
        } else {
            setAllAlerts([]);
            setVisibleIndex(-1);
        }
    };

    // 🔥 Fermeture automatique après 20 secondes si autoPlay activé
    useEffect(() => {

        if (!visibleAlert || !autoPlay) return;
        const timer = setTimeout(() => { handleClose(); }, 20000);

        return () => clearTimeout(timer);
    }, [visibleAlert, autoPlay]);

    if (visibleIndex === -1 || !visibleAlert) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 animate-fade-in">
            {/* === BOUTON CLOSE === */}
            <div className="absolute -top-3 right-8 z-10">
                <button
                    onClick={handleClose}
                    className="p-2 rounded-full bg-white shadow-md border border-gray-200 hover:bg-[#b07b5e] hover:text-white transition-all duration-300 hover:scale-105"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* === ALERT TEXTE === */}
            {visibleAlert.type === "text" && (
                <div className="relative bg-gradient-to-r from-slate-100 to-slate-50 rounded-xl p-4 shadow-lg border border-gray-200 animate-fade-in">
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">{visibleAlert.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{visibleAlert.message}</p>

                    {visibleAlert.linkText && (
                        visibleAlert.onClick ? (
                            <button
                                onClick={visibleAlert.onClick}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#b07b5e] hover:text-[#8e5f48] transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                                {visibleAlert.linkText}
                            </button>
                        ) : visibleAlert.linkHref ? (
                            <a
                                href={visibleAlert.linkHref}
                                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#b07b5e] hover:text-[#8e5f48] transition-all"
                            >
                                <ArrowRight className="w-4 h-4" />
                                {visibleAlert.linkText}
                            </a>
                        ) : null
                    )}
                </div>
            )}

            {/* === ALERT AUDIO === */}
            {visibleAlert.type === "audio" && (
                <div className="relative bg-white rounded-xl border-2 border-slate-200 p-4 shadow-lg animate-fade-in">
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

                    {visibleAlert.audioUrl && (
                        <audio controls src={visibleAlert.audioUrl} className="mt-3 w-full" />
                    )}
                </div>
            )}
        </div>
    );
}
