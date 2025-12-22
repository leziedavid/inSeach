"use client";

import { useEffect, useState } from "react";
import { Menu, UserRound, X, Store } from "lucide-react";
import Link from "next/link";
import { LogoInSeach } from "./LogoInSeach";
import { User } from "@/types/interfaces";
import { getMyData } from "@/services/securityService";
import Image from "next/image";
import { getUserId, getUserName } from "@/app/middleware";
import QrCodeLogo from "./QrCodeLogo";
import { usePathname } from "next/navigation";


interface TabItem {
    key: string;
    label: string;
    icon: string;
    href?: string;
}

interface HeaderProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    off?: boolean;
    userId?: string;
}

export default function HomeHeader({ activeTab, onTabChange, off, userId }: HeaderProps) {

    /* ------------------------- STATE MANAGEMENT ------------------------- */
    const [unreadMessages, setUnreadMessages] = useState(3);
    const [userName, setUserName] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [users, setUsersData] = useState<User | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const pathname = usePathname();

    const images = [
        "/avatars/user1.png",
        "/avatars/user2.png",
        "/avatars/user3.png",
        "/avatars/user4.png",
    ];

    /* ------------------------- TABS CONFIGURATION ------------------------- */
    const tabs = [
        { key: "terms", label: "Conditions générales", icon: "/home.svg", href: "/terms" },
        { key: "privacy-policy", label: "Politique de confidentialité", icon: "/price.svg", href: "/privacy-policy" },
    ];

    const authTabs = [
        { key: "home", label: "Accueil", icon: "/home.svg", href: "/" },
        { key: "history", label: "Historique", icon: "/price.svg", href: "/history" },
        { key: "support", label: "Support", icon: "/aide.svg", href: "/support" },
        { key: "settings", label: "Paramètres", icon: "/service.svg", href: "/settings" },
    ];

    /* ------------------------- EFFECTS ------------------------- */
    // 🔄 ANIMATION AVATAR
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    const isActive = (href?: string) => {
        if (!href) return false;
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };



    return (
        <>
            {/* ================= HEADER AUTH ================= */}
            {off ? (
                <>
                    <header className="w-full flex items-center justify-between px-6 py-4 relative bg-[#f8f8f8]">
                        {/* LEFT USER SECTION */}

                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 bg-[#b07b5e33] rounded-full flex items-center justify-center overflow-hidden relative">
                                {images.map((img, index) => (
                                    <Image key={img} src={img} alt="Avatar" width={44} height={44} className={`object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-500 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`} />
                                ))}
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 leading-tight">Salut, 👋</p>
                                <p className="font-semibold text-gray-800 text-sm">{userName || "TDLLEZIE"}</p>
                            </div>
                        </div>

                        {/* ✅ TABS DESKTOP - CORRIGÉ */}

                        {/* ✅ TABS DESKTOP - URL BASED */}
                        {authTabs.length > 0 && (
                            <nav className="hidden md:flex gap-6">
                                {authTabs.map((tab) => {
                                    const active = isActive(tab.href);
                                    return (
                                        <Link href={tab.href || "/"} key={tab.key} className={` flex items-center gap-2 text-sm font-medium transition-all px-3 py-1 rounded-full ${active ? "bg-[#b07b5e] text-white" : "text-gray-400 hover:text-black"} `} >
                                            <Image src={tab.icon} alt={tab.label} width={20} height={20} />
                                            {tab.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}

                        {/* RIGHT ACTIONS */}
                        <div className="flex items-center gap-3">
                            {userId && (
                                <QrCodeLogo user={userId} />
                            )}
                            <Link href="/boutique">
                                <div className="flex gap-1 items-center px-3 py-1.5 rounded-full transition-all duration-200 bg-slate-50 shadow-sm hover:bg-slate-100 cursor-pointer">
                                    <Store className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-bold tabular-nums tracking-wide text-slate-800">
                                        Boutique
                                    </span>
                                </div>
                            </Link>

                            <button onClick={() => setOpen(true)} className="relative bg-[#b07b5e] p-2.5 rounded-full transition hover:bg-[#9a6b4f]"  >
                                <Image src="/notification1.svg" alt="Notifications" width={26} height={26} />
                                {unreadMessages > 0 && (
                                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {unreadMessages}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* MOBILE FLOATING BUTTON */}
                        <button className={`md:hidden fixed bottom-6 left-6 p-3 rounded-full z-50 shadow-lg transition-all ${open ? "bg-black text-white" : "bg-[#b07b5e] text-white"}`} onClick={() => setOpen(!open)}  >
                            {open ? <X size={22} /> : <Image src="/menu.svg" alt="Menu" width={26} height={26} />}
                        </button>

                        {/* MOBILE BOTTOM MENU */}
                        {open && (
                            <div className="md:hidden fixed bottom-20 left-0 w-full px-4 z-50 flex justify-center">
                                <div className="bg-white shadow-xl rounded-3xl p-4 w-[90%] flex flex-col gap-4 border">
                                    {authTabs.map((tab) => {
                                        const active = isActive(tab.href);
                                        return (
                                            <Link  href={tab.href || "/"}  key={tab.key}  onClick={() => {  onTabChange?.(tab.key);  setOpen(false);  }} className={`flex items-center gap-3 text-lg font-medium px-4 py-3 rounded-2xl transition-all ${active ? "bg-[#b07b5e] text-white"  : "text-gray-700 bg-gray-100 hover:bg-gray-200"  } `} >
                                                <Image  src={tab.icon}   alt={tab.label}  width={26}  height={26}  className={active ? "brightness-0 invert" : ""}  />
                                                {tab.label}
                                            </Link>
                                        );
                                    })}

                                </div>
                            </div>
                        )}

                    </header>
                </>
            ) : (
                <>
                    {/* ================= HEADER USER (NON AUTHENTIFIÉ) ================= */}
                    <header className={`w-full flex items-center justify-between px-6 py-4 relative pl-14 md:pl-6 transition-all duration-300 bg-[#f8f8f8] ${open ? "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto" : "opacity-100"}`}  >
                        <LogoInSeach />

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex gap-6">
                            {tabs.map((tab) => (
                                <Link key={tab.key} href={tab.href || "/"} className="text-sm font-medium text-gray-400 hover:text-black transition-all" >
                                    {tab.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link href="/welcome" className="flex md:hidden bg-brand-secondary text-white p-2 rounded-full">
                                <UserRound size={20} />
                            </Link>

                            <Link href="/welcome" className="hidden md:flex items-center gap-2 bg-brand-secondary text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-brand-primary transition" >
                                <UserRound size={20} /> Connexion →
                            </Link>
                        </div>
                    </header>

                    {/* MOBILE MENU BUTTON */}
                    <button className="md:hidden fixed left-4 top-4 bg-brand-primary hover:bg-brand-secondary text-white p-2 rounded-full z-50 transition" onClick={() => setOpen(!open)} >
                        {open ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* MOBILE DRAWER */}
                    <div className={`md:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 transform transition-transform duration-300 ease-out ${open ? "translate-y-0" : "-translate-y-full"}`} >
                        <div className="pt-20 px-6 flex flex-col gap-6">
                            {tabs.map((tab) => (
                                <Link key={tab.key} href={tab.href || "/"} className="text-lg font-medium text-gray-500 hover:text-black transition" onClick={() => setOpen(false)} >
                                    {tab.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}