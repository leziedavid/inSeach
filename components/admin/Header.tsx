"use client";

import { HelpCircle, Settings, SidebarIcon, Sparkles, User } from 'lucide-react';
import React from 'react';
import { LogoInSeach } from '../home/LogoInSeach';

// Types
interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
}

// Header Component
const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
    return (
        <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center gap-3">
                
                <button onClick={onToggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Toggle sidebar" >
                    <SidebarIcon />
                </button>
                <div className="flex items-center gap-2">
                    <LogoInSeach size={18} colorFrom="#b07b5e" colorTo="#155e75" iconColor="#b07b5e" isOpen={isSidebarOpen} />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Aide"  >
                    <HelpCircle size={20} className="text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Paramètres"
                >
                    <Settings size={20} className="text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Profil"
                >
                    <User size={20} className="text-gray-600" />
                </button>
            </div>
        </header>
    );
};


export default Header;