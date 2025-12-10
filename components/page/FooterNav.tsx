"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
import Image from "next/image";

const footerNav = [
    { key: "home", label: "Accueil", icon:"/home.svg" },
    { key: "history", label: "Historique",icon: "/price.svg" },
    { key: "support", label: "Support", icon:"/aide.svg" },
    { key: "settings", label: "Paramètres", icon:"/service.svg" },
];



interface FooterNavProps {
    onTabChange?: (tab: string) => void
}

export default function FooterNav({ onTabChange }: FooterNavProps) {

    const [active, setActive] = useState("home");
    const [menuOpen, setMenuOpen] = useState(false);


    const handleTabClick = (key: string) => {
        setActive(key)
        onTabChange?.(key)
    }


    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    // const handleTabClick = useCallback((key: string) => {
    //     setActive(key);
    // }, []);

    return (
        <>
            {/* ===== VERSION MOBILE ===== */}

            {/* Bouton pour ouvrir le menu - visible SEULEMENT quand menu fermé */}
            <AnimatePresence>
                {!menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.0 }}
                        className="fixed bottom-4 left-4 md:hidden z-[100]" >
                        <button onClick={openMenu} className="bg-[#b07b5e] text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-[#9a6a50] active:scale-95 transition-all" aria-label="Ouvrir le menu" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Menu mobile en bas - style bottom navigation */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.0 }}
                        className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.1)] rounded-t-[2rem] z-[90] md:hidden"
                    >
                        {/* Bouton fermer */}
                        <button onClick={closeMenu} className="absolute -top-14 left-4 bg-[#b07b5e] text-white p-4 rounded-full shadow-lg flex items-center justify-center hover:bg-[#9a6a50] active:scale-95 transition-all" aria-label="Fermer le menu"  >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>

                        {/* Items de navigation */}
                        <div className="flex justify-around  py-4 px-2">
                            {footerNav.map((item) => (
                                <button key={item.key} onClick={() => handleTabClick(item.key)} className={`flex flex-col items-center transition-colors ${active === item.key ? "text-[#b07b5e]" : "text-gray-500"}`}>
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <Image src={item.icon} alt={item.label} width={20} height={20} />
                                    </div>
                                    <span className="text-xs font-bold mt-1">{item.label}</span>
                                </button>
                            ))}
                        </div>

                    </motion.nav>
                )}
            </AnimatePresence>

            {/* ===== VERSION DESKTOP ===== */}
            <nav className="hidden md:flex justify-center bg-white py-3 shadow-md rounded-b-[2rem] border-b-2 border-gray-200 mb-2">
                <div className="flex justify-between w-[85%] max-w-[280px] mx-auto space-x-3 px-3">
                    {footerNav.map((item) => (
                        <button key={item.key} onClick={() => handleTabClick(item.key)} className={`flex flex-col items-center transition-colors ${active === item.key ? "text-[#b07b5e]" : "text-gray-500 hover:text-gray-700"}`} >
                            <div className="w-6 h-6 flex items-center justify-center">
                                <Image src={item.icon} alt={item.label} width={20} height={20} />
                            </div>
                            <span className="text-xs font-bold mt-1">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

        </>
    );
}