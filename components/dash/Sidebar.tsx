"use client";

import { Home, Users, MessageSquare, BarChart3, Settings } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white h-screen border-r px-4 py-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-10">Datafit</h1>

            <nav className="space-y-5 flex-grow">
                <div className="flex items-center gap-3 text-gray-700 font-medium">
                    <Home size={20} /> Overview
                </div>
                <div className="flex items-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <Users size={20} /> Customer
                </div>
                <div className="flex items-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <BarChart3 size={20} /> Marketing
                </div>
                <div className="flex items-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <MessageSquare size={20} /> Support Analytic
                </div>
                <div className="flex items-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <Settings size={20} /> Chat
                </div>
            </nav>

            <div className="mt-auto flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                <Image
                    src="/avatar.png"
                    alt="user"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div>
                    <p className="text-sm font-medium">John Smith</p>
                    <p className="text-xs text-gray-500">john.s@mail.com</p>
                </div>
            </div>
        </aside>
    );
}
