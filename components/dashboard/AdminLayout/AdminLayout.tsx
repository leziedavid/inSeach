"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className="min-h-screen bg-[#F6F7F5]">
            <Sidebar mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />

            <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
                <Header toggleMobileMenu={toggleMobileMenu} />

                {/* Content */}
                <main className="p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
