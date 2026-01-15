"use client";

import { useEffect, useState, useRef } from "react";
import { Smartphone, X } from "lucide-react";
import { isMobile } from "@/utils/isMobile";
import { toast } from "sonner";

export const InstallPrompt = () => {
    
    const [shown, setShown] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const startYRef = useRef(0);

    // Support PWA - beforeinstallprompt
    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            (window as any).deferredPrompt = e;
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    useEffect(() => {
        if (!isMobile() || shown) return;

        const timer = setTimeout(() => {
            toast.custom(
                (t) => {
                    const dismiss = () => {
                        if (!containerRef.current) return;
                        containerRef.current.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                        containerRef.current.style.transform = "translateY(100%)";
                        containerRef.current.style.opacity = "0";
                        setTimeout(() => toast.dismiss(t), 300);
                    };

                    // ✅ Animation d'entrée après le montage
                    setTimeout(() => {
                        if (containerRef.current) {
                            containerRef.current.style.transform = "translateY(0)";
                            containerRef.current.style.opacity = "1";
                        }
                    }, 50);

                    return (
                        <div
                            ref={containerRef}
                            className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 pr-10 bg-white text-brand-primary rounded-xl shadow-lg w-full max-w-md cursor-pointer touch-pan-y"
                            style={{
                                transform: "translateY(100%)",
                                opacity: 0,
                                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease",
                                wordBreak: "break-word",
                            }}
                            onTouchStart={handleTouchStart}
                            onTouchMove={(e) => handleTouchMove(e, dismiss)}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* ✅ Bouton X en haut à droite */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dismiss();
                                }}
                                className="absolute top-2 right-2 p-1.5 text-brand-secondary hover:bg-brand-primary/10 rounded-lg transition-colors active:scale-95"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icône et texte */}
                            <div className="flex items-center gap-3 flex-1">
                                <div className="p-2 bg-brand-primary/10 rounded-lg backdrop-blur-sm">
                                    <Smartphone className="w-5 h-5 flex-shrink-0 text-brand-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-sm leading-snug text-brand-primary">
                                        Installez notre application
                                    </p>
                                    <p className="text-xs leading-snug mt-1 text-brand-primary/80">
                                        Accès plus rapide et notifications
                                    </p>
                                </div>
                            </div>

                            {/* Bouton Installer */}
                            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const event = (window as any).deferredPrompt;
                                        if (event) {
                                            event.prompt();
                                            event.userChoice.then((choiceResult: any) => {
                                                console.log("Choice:", choiceResult.outcome);
                                                if (choiceResult.outcome === 'accepted') {
                                                    console.log('User accepted the install prompt');
                                                }
                                            });
                                        } else {
                                            // Fallback pour iOS ou navigateurs non supportés
                                            console.log("Installation PWA non supportée sur ce navigateur");
                                        }
                                        dismiss();
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 bg-brand-secondary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary/90 active:scale-95 transition-all shadow-sm">
                                    Installer
                                </button>
                            </div>
                        </div>
                    );
                },
                {
                    duration: 8000,
                    position: "bottom-center",
                }
            );
            setShown(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, [shown]);

    // ===== Swipe pour dismiss =====
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        startYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>, dismiss: () => void) => {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startYRef.current;

        if (containerRef.current && diff > 0) {
            // Seulement si on swipe vers le bas
            containerRef.current.style.transition = "none";
            containerRef.current.style.transform = `translateY(${diff}px)`;
            containerRef.current.style.opacity = `${Math.max(0, 1 - diff / 150)}`;
        }

        if (diff > 100) {
            dismiss();
        }
    };

    const handleTouchEnd = () => {
        if (containerRef.current) {
            containerRef.current.style.transition = "transform 0.3s ease, opacity 0.3s ease";
            containerRef.current.style.transform = "translateY(0)";
            containerRef.current.style.opacity = "1";
        }
    };

    return null;
};