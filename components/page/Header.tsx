"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MessageCircleMore, Store } from "lucide-react";
import AlertPlayer from "./AlertPlayer";
import Link from "next/link";
import { getUserName } from "@/app/middleware";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [gain, setGain] = useState(10000000);
    const [unreadMessages, setUnreadMessages] = useState(3);
    const [userName, setUserName] = useState<string | null>(null);

    // ✅ Tableau d'images à faire défiler
    const images = [
        "/avatars/user1.png",
        "/avatars/user2.png",
        "/avatars/user3.png",
        "/avatars/user4.png",
    ];

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 🔄 Changer l'image toutes les 1 seconde
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 1000);

        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        let mounted = true;

        (async () => {
            const user = await getUserName();
            if (mounted) setUserName(user);
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <>
            <div className="flex items-center justify-between w-full px-6 pt-6 pb-3 shrink-0">
                {/* ALERT PLAYER — toujours affiché */}
                <AlertPlayer autoPlay={open} />

                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-[#b07b5e33] rounded-full flex items-center justify-center overflow-hidden relative">
                        {images.map((img, index) => (
                            <Image key={img} src={img} alt="Avatar" width={44} height={44} className={` object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out  ${index === currentImageIndex ? "opacity-100" : "opacity-0"}  `} />))} </div>

                    <div>
                        <p className="text-sm text-gray-500 leading-tight">Salut, 👋</p>
                        <p className="font-semibold text-gray-800 text-sm"> {userName || "TDLLEZIE"}</p>
                    </div>
                </div>

                {/* Section actions à droite */}
                <div className="flex items-center gap-3">
                    {/* 💰 Bouton Boutique avec lien */}
                    <Link href="/boutique">
                        <div className="flex gap-1 items-center px-3 py-1.5 rounded-full transition-all duration-200 bg-slate-50 pr-8 shadow-sm hover:bg-slate-100 cursor-pointer">
                            <Store className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-bold tabular-nums tracking-wide text-slate-800">
                                Boutique
                            </span>
                        </div>
                    </Link>

                    {/* 🔹 Bouton + avec badge */}
                    <button onClick={() => setOpen(true)} className="relative bg-[#b07b5e] p-2.5 rounded-full hover:bg-gray-200 transition" >
                        <MessageCircleMore className="w-4 h-4 text-white animate-bounce" />
                        {unreadMessages > 0 && (
                            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                {unreadMessages}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}