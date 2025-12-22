"use client";

import Image from "next/image";

// Home.tsx
import { useState } from "react";
import Header from "./Header";
import MySlider from "./Slider";
import CardTabs from "./CardTabs";
import Calendars from "./Calendars";
import Support from "./Support";
import Setting from "./Setting";
import History from "./History";
import WhatsAppButton from "./WhatsAppButton";

export default function Home() {


    const footerNav = [
        { key: "home", label: "Accueil", icon: "/home.svg" },
        { key: "history", label: "Historique", icon: "/price.svg" },
        { key: "support", label: "Support", icon: "/aide.svg" },
        { key: "settings", label: "Paramètres", icon: "/service.svg" },
    ];


    const [activeTab, setActiveTab] = useState("home");
    const tabs = footerNav;
    return (
        <>

            <div className="min-h-screen bg-[#f8f8f8] text-black relative overflow-hidden " >

                {/* Header */}
                <Header tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="w-full flex justify-center px-1 md:px-0">
                    <div className="relative overflow-hidden w-full max-w-5xl">
                        {activeTab === "home" && <MySlider />}

                        <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar " >
                            {activeTab === "home" && <CardTabs />}
                            {activeTab === "history" && <History />}
                            {activeTab === "support" && <Support />}
                            {activeTab === "settings" && <Setting />}
                        </div>
                    </div>

                </div>

                {/* Footer petit */}
                <div className="text-center text-[9px] sm:text-[10px] bg-[#f8f8f8] text-gray-500 space-y-0.5 pt-2 mt-8">
                    <p>Version 1.0.0</p>
                    <div className="text-gray-400">
                        &copy; 2025 inSeach. Tous droits réservés.
                    </div>
                </div>

                <WhatsAppButton />
            </div>

        </>

    );
}
