"use client";

// Header.tsx
import { useEffect, useState } from "react";
import { Menu, MessageCircleMore, Store, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getUserId, getUserName } from "@/app/middleware";
import QrCodeLogo from "./QrCodeLogo";

interface HeaderProps {
    tabs?: { key: string; label: string; icon: string }[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export default function Header({ tabs = [], activeTab, onTabChange }: HeaderProps) {
    const [open, setOpen] = useState(false);

    /* ------------------------- EXTRA FUNCTIONALITIES ADDED ------------------------- */
    const [gain, setGain] = useState(10000000);
    const [unreadMessages, setUnreadMessages] = useState(3);
    const [userName, setUserName] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    const images = [
        "/avatars/user1.png",
        "/avatars/user2.png",
        "/avatars/user3.png",
        "/avatars/user4.png",
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 🔄 ANIMATION AVATAR
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // 👤 FETCH USERNAME
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const userName = await getUserName();
                if (mounted) setUserName(userName);

                const userID = await getUserId();
                if (mounted) setUserId(userID);

            } catch {
                console.log("Error");
            }

        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <header className="w-full flex items-center justify-between px-6 py-4 relative">
            {/* LEFT USER SECTION (Added) */}
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#b07b5e33] rounded-full flex items-center justify-center overflow-hidden relative">
                    {images.map((img, index) => (
                        <Image
                            key={img}
                            src={img}
                            alt="Avatar"
                            width={44}
                            height={44}
                            className={`object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`} />
                    ))}
                </div>

                <div>
                    <p className="text-sm text-gray-500 leading-tight">Salut, 👋</p>
                    <p className="font-semibold text-gray-800 text-sm">{userName || "TDLLEZIE"}</p>
                </div>
            </div>

            {/* Tabs Desktop */}
            {tabs.length > 0 && (
                <nav className="hidden md:flex gap-6">
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => onTabChange && onTabChange(tab.key)} className={`flex items-center gap-2 text-sm font-medium transition-all ${activeTab === tab.key ? "text-black bg-gray-400 text-white px-3 py-1 rounded-full" : "text-gray-400 hover:text-black"}`} >
                            <Image src={tab.icon} alt={tab.label} width={20} height={20} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            )}

            {/* RIGHT ACTIONS — toujours visibles */}
            <div className="flex items-center gap-3">

                <QrCodeLogo user={userId} />

                <Link href="/boutique">
                    <div className="flex gap-1 items-center px-3 py-1.5 rounded-full transition-all duration-200 bg-slate-50 pr-8 shadow-sm hover:bg-slate-100 cursor-pointer">
                        <Store className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-bold tabular-nums tracking-wide text-slate-800">
                            Boutique
                        </span>
                    </div>
                </Link>

                <button onClick={() => setOpen(true)} className="relative bg-[#b07b5e] p-2.5 rounded-full transition" >
                    <MessageCircleMore className="w-4 h-4 text-white animate-bounce" />
                    {unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {unreadMessages}
                        </span>
                    )}
                </button>
            </div>


            {/* Mobile Floating Button */}
            {tabs.length > 0 && (
                <button className={`md:hidden fixed bottom-6 left-6 p-3 rounded-full z-50 shadow-lg ${open ? "bg-black text-white" : " bg-[#b07b5e] text-white"}`} onClick={() => setOpen(!open)} >
                    {open ? <X size={22} /> : <Image src="/menu.svg" alt="Service" width={26} height={26} />}
                </button>

            )}

            {/* Mobile Bottom Menu */}
            {open && (
                <div className="md:hidden fixed bottom-20 left-0 w-full px-4 z-50 flex justify-center">
                    <div className="bg-white shadow-xl rounded-3xl p-4 w-[90%] flex flex-col gap-4 border">
                        {tabs.map((tab) => (
                            <button key={tab.key}
                                onClick={() => { onTabChange && onTabChange(tab.key); setOpen(false); }}
                                className={`flex items-center gap-3 text-lg font-medium px-4 py-3 rounded-2xl ${activeTab === tab.key ? "bg-[#b07b5e] text-white" : "text-gray-700 bg-gray-100"}`}  >
                                <Image src={tab.icon} alt={tab.label} width={26} height={26} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </header>
    );
}
