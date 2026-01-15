"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import SidebarContent from "./SidebarContent";
import { Role } from "@/types/interfaces";
import { getUserRole } from "@/app/middleware";

interface SidebarProps {  mobileMenuOpen: boolean; toggleMobileMenu: () => void;}

export default function Sidebar({  mobileMenuOpen,  toggleMobileMenu,}: SidebarProps) {

    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRole = async () => {
            const userRole = await getUserRole();
            setRole(userRole);
            setLoading(false);
            console.log("role", userRole);
        };

        loadRole();
    }, []);


    return (
        <>

        {/* <pre>{JSON.stringify(role, null, 2)}</pre> */}
            {/* ===== Sidebar Desktop ===== */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#F8F9F7] border-r px-6 py-6 flex-col">
                <SidebarContent role={role} />
            </aside>

            {/* ===== Overlay Mobile ===== */}
            <div className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${   mobileMenuOpen  ? "opacity-100" : "opacity-0 pointer-events-none"  }`}  onClick={toggleMobileMenu} />

            {/* ===== Sidebar Mobile ===== */}
            <aside  className={`fixed bottom-0 left-0 w-full bg-[#F8F9F7] z-40 md:hidden transform transition-transform duration-300 ${   mobileMenuOpen  ? "translate-y-0"  : "translate-y-full"  } rounded-t-xl px-6 py-6 h-[80%] flex flex-col`}>
                <div className="flex justify-end mb-4">
                    <button  onClick={toggleMobileMenu}  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"  aria-label="Close menu"  >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent role={role} />
            </aside>
        </>
    );
}
