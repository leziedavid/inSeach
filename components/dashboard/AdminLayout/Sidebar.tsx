"use client";

import {
    LayoutDashboard,
    ListTodo,
    Calendar,
    BarChart3,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    X,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar({ mobileMenuOpen, toggleMobileMenu }: { mobileMenuOpen: boolean, toggleMobileMenu: () => void }) {
    return (
        <>
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-[#F8F9F7] border-r px-6 py-6 flex flex-col">
                <SidebarContent />
            </aside>

            {/* Sidebar Mobile Modal */}
            <div
                className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={toggleMobileMenu}
            />

            <aside
                className={`fixed bottom-0 left-0 w-full bg-[#F8F9F7] z-40 md:hidden transform transition-transform duration-300 ${mobileMenuOpen ? "translate-y-0" : "translate-y-full"
                    } rounded-t-xl px-6 py-6 h-[80%] flex flex-col`}
            >
                <div className="flex justify-end mb-4">
                    <button onClick={toggleMobileMenu} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <SidebarContent />
            </aside>
        </>
    );
}

function SidebarContent() {
    return (
        <>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-full bg-brand-primary" />
                <span className="font-bold text-lg">Admin</span>
            </div>

            {/* Menu */}
            <div className="text-xs text-gray-400 mb-3">MENU</div>
            <nav className="space-y-2">
                <MenuItem icon={<LayoutDashboard />} label="Dashboard" active />
                <MenuItem icon={<ListTodo />} label="Tasks" badge="12+" />
                <MenuItem icon={<Calendar />} label="Calendar" />
                <MenuItem icon={<BarChart3 />} label="Analytics" />
                <MenuItem icon={<Users />} label="Team" />
            </nav>

            {/* General */}
            <div className="mt-10 text-xs text-gray-400 mb-3">GENERAL</div>
            <nav className="space-y-2">
                <MenuItem icon={<Settings />} label="Settings" />
                <MenuItem icon={<HelpCircle />} label="Help" />
                <MenuItem icon={<LogOut />} label="Logout" />
            </nav>
        </>
    );
}

function MenuItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string }) {
    return (
        <div
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
        ${active ? "bg-brand-primary text-white" : "text-gray-600 hover:bg-gray-100"}`}
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-medium">{label}</span>
            </div>
            {badge && (
                <span className="text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
        </div>
    );
}
