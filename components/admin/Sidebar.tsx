"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Settings, PieChart, MessageSquare, Bell, Image, CloudUpload, ArrowLeftRight, CalendarArrowUp, ClipboardClock, HandPlatter } from 'lucide-react';
import { LogoInSeach } from '../home/LogoInSeach';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface MenuItem {
    id: number;
    title: string;
    icon: React.ReactNode;
    url: string;
    alwaysShowIcon?: boolean; // si true, apparaît même menu plié
}

// Menu dynamique  alwaysShowIcon: true
const menuData: MenuItem[] = [
    { id: 1, title: "Tableau de bord", icon: <Home size={18} />, url: "/dashboard/overview" },
    { id: 2, title: "Utilisateurs", icon: <Users size={18} />, url: "/dashboard/users" },
    { id: 3, title: "Services", icon: <FileText size={18} />, url: "/dashboard/services" },
    { id: 4, title: "Service categories", icon: <HandPlatter size={18} />, url: "/dashboard/serviceCategories" },
    { id: 5, title: "Appointments", icon: <ClipboardClock size={18} />, url: "/dashboard/appointments" },
    { id: 6, title: "Transactions", icon: <ArrowLeftRight size={18} />, url: "/dashboard/transactions" },
    { id: 7, title: "Orders", icon: <CalendarArrowUp size={18} />, url: "/dashboard/Orders" },
    { id: 8, title: "icones", icon: <Image size={18} />, url: "/dashboard/icones" },
    { id: 9, title: "Sliders", icon: <Image size={18} />, url: "/dashboard/sliders" },
    { id: 10, title: "Alertes", icon: <Bell size={18} />, url: "/dashboard/alerts" },
    { id: 11, title: "Messages", icon: <MessageSquare size={18} />, url: "/dashboard/messages" },
    { id: 12, title: "Rapports", icon: <PieChart size={18} />, url: "/dashboard/reports" },
    { id: 13, title: "FileManagers", icon: <CloudUpload size={18} />, url: "/dashboard/fileManagers" },
    { id: 14, title: "Paramètres", icon: <Settings size={18} />, url: "/dashboard/settings", },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay mobile */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={onClose} aria-hidden="true" />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-gray-200  transform transition-all duration-300 z-30 overflow-y-auto scrollbar-none ${isOpen ? 'w-72 translate-x-0' : 'w-0 lg:w-16 -translate-x-full lg:translate-x-0'} `}>

                <div className="flex flex-col h-full ">
                    {/* Logo */}
                    {isOpen && (
                        <div className="p-4 border-b border-gray-200">
                            <LogoInSeach size={18} colorFrom="#b07b5e" colorTo="#155e75" iconColor="#b07b5e" isOpen={isOpen} />
                        </div>
                    )}

                    {/* Menu Items */}
                    <nav className={`flex-1 overflow-y-auto px-2 mt-2`}>
                        {menuData.map((item) => {
                            const isActive = pathname.startsWith(item.url);
                            // si menu réduit et que l'item n'est pas marqué alwaysShowIcon, ne pas afficher le texte
                            const showItem = isOpen || item.alwaysShowIcon;

                            return (
                                <Link key={item.id} href={item.url} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${isActive ? 'bg-[#b07b5e] text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}  ${!showItem ? 'justify-center' : ''}`} >
                                    {item.icon} {showItem && <span>{item.title}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / Profil */}
                    <div className={`border-t border-gray-200 p-4`}>
                        <Link  href="/logout"  className={`w-full flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 py-2 px-3 rounded-lg transition-colors ${!isOpen ? 'justify-center' : ''}`} >
                            <Settings size={16} />
                            {isOpen && <span>Déconnexion</span>}
                        </Link>
                    </div>
                </div>

            </aside>
        </>
    );
};

export default Sidebar;
