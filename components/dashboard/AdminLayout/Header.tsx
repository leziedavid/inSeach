"use client";

import { Search, Bell, Mail, Menu, User, Settings, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header({ toggleMobileMenu }: { toggleMobileMenu: () => void }) {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Fermer le menu en cliquant à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-white px-4 md:px-8 py-4 flex items-center justify-between border-b">
            {/* Mobile Menu Icon */}
            <div className="md:hidden">
                <button
                    onClick={toggleMobileMenu}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>


            <div className="flex items-center gap-3 px-4 py-2 rounded-full w-full md:w-[420px] mx-4 md:mx-0">

            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* Icons visible seulement sur desktop */}
                <div className="hidden md:flex items-center gap-5">
                    <IconButton>
                        <Bell className="w-5 h-5" />
                    </IconButton>
                </div>

                {/* User Section */}
                <div className="relative" ref={userMenuRef}>
                    {/* User button - affiche seulement l'icône sur mobile */}
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 rounded-full p-1 md:p-0"
                    >
                        <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                        </div>

                        {/* Nom et email cachés sur mobile */}
                        <div className="hidden md:block text-sm text-left">
                            <div className="font-medium">Totok Michael</div>
                            <div className="text-gray-400 text-xs">
                                tmichael20@mail.com
                            </div>
                        </div>
                    </button>

                    {/* User Menu Popup */}
                    {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-40">
                            <div className="px-4 py-3 border-b md:hidden">
                                <div className="font-medium">Totok Michael</div>
                                <div className="text-gray-400 text-xs">
                                    tmichael20@mail.com
                                </div>
                            </div>

                            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left">
                                <User className="w-4 h-4" />
                                <span>Mon compte</span>
                            </button>

                            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left text-red-600">
                                <LogOut className="w-4 h-4" />
                                <span>Déconnexion</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function IconButton({ children }: { children: React.ReactNode }) {
    return (
        <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            {children}
        </button>
    );
}