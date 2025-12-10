"use client";

import Image from "next/image";

const footerNav = [
    { key: "home", label: "Accueil", icon: "/home.svg" },
    { key: "history", label: "Historique", icon: "/price.svg" },
    { key: "support", label: "Support", icon: "/aide.svg" },
    { key: "settings", label: "Paramètres", icon: "/service.svg" },
];

// Home.tsx
import { useState } from "react";
import Header from "./Header";
import { Lock } from "lucide-react";
import MySlider from "./Slider";

export default function Home() {
    const [activeTab, setActiveTab] = useState("Accueil");
    const tabs = footerNav; // Visible uniquement si activé

    return (
        <div className="min-h-screen bg-[#f8f8f8] text-black relative overflow-hidden">
            {/* Header */}
            <Header tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="w-full flex justify-center px-4 md:px-0">
                <div className="relative overflow-hidden w-full max-w-5xl">
                    <MySlider />
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-cover"></div>

            {/* Main Content */}
            <main className="relative z-10 flex flex-col items-center text-center px-6 mt-16">
                <div className="w-16 h-16 rounded-full border flex items-center justify-center mb-6">
                    <Lock size={32} />
                </div>

                <h1 className="text-3xl md:text-5xl font-semibold leading-tight max-w-2xl">
                    La clé de votre <span className="font-black">sérénité financière</span> arrive bientôt
                </h1>

                <p className="text-gray-600 mt-4 max-w-md">
                    Restez connectés et abonnez‑vous à nos réseaux sociaux pour être les premiers à recevoir la clé.
                </p>

                {/* Email Form */}
                <div className="flex flex-col md:flex-row gap-3 mt-8 w-full max-w-lg">
                    <input
                        type="email"
                        placeholder="Entrez votre adresse email"
                        className="w-full rounded-full border px-4 py-3 text-sm focus:outline-none"
                    />
                    <button className="bg-black text-white px-6 py-3 rounded-full text-sm">
                        Découvrir en premier →
                    </button>
                </div>

                {/* Socials */}
                <div className="flex gap-4 mt-10 opacity-70">
                    <span>🔗</span>
                    <span>📘</span>
                    <span>📸</span>
                    <span>🎵</span>
                    <span>💼</span>
                </div>
            </main>
        </div>
    );
}
