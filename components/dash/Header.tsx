"use client";

import { Search, Bell, Settings } from "lucide-react";

export default function Header() {
    return (
        <header className="w-full flex items-center justify-between p-4 bg-white border-b">
            <div>
                <h2 className="text-xl font-semibold">Overview</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-gray-100 pl-10 pr-4 py-2 rounded-lg text-sm outline-none"
                    />
                    <Search className="absolute top-2 left-2 text-gray-400" size={18} />
                </div>

                <Bell size={20} className="text-gray-700" />
                <Settings size={20} className="text-gray-700" />
            </div>
        </header>
    );
}
