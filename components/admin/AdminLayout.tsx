"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
    children: React.ReactNode;
}

// AdminLayout Component
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header  onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;