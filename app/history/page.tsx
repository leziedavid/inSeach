"use client";

import { useEffect, useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import SocialFollow from "@/components/home/SocialFollow";
import { getMyData } from "@/services/securityService";
import { Role, User } from "@/types/interfaces";
import FullPageLoader from "@/components/home/FullPageLoader";
import { cn } from "@/lib/utils";
import RendezVous from "@/components/home/RendezVous";
import AppointmentCalendar from "@/components/home/AppointmentCalendar";
import RechargeModal from "@/components/modal/RechargeModal";
import { HistoryCard } from "@/components/home/HistoryCard";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";



type TabKey = "rdv" | "histo" | "SERVICES";

interface VisibleTab {
    key: TabKey;
    label: string;
    isVisible: boolean;
}

export default function Page() {
    const [activeTab, setActiveTab] = useState("home");
    const [users, setusersData] = useState<User | null>(null);
    const [off, setOff] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>(" Chargement...");
    const [active, setActive] = useState<TabKey | null>("rdv")
    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    const [userRole, setUserRole] = useState<Role>(Role.USER);


    const visibleTabs: VisibleTab[] = [
        { key: "rdv", label: "Rendez-vous", isVisible: true },
        { key: "histo", label: "Historique", isVisible: true },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const init = async () => {
            try {
                const user = await getMyData();

                if (user.statusCode === 200 && user.data) {
                    setusersData(user.data);
                    setUserRole(user?.data.roles);
                    setOff(true);
                    setIsLoading(false);
                } else {
                    setusersData(null);
                    setOff(false);
                    setIsLoading(false);
                }
            } catch (e) {
                setusersData(null);
                setOff(false);
                setIsLoading(false);
            }
        };

        init();
    }, []);


    return (
        <>

            {!isLoading ? (
                <>
                    <HomeHeader off={off} activeTab={activeTab} onTabChange={setActiveTab} userId={users?.id} />

                    <div className="min-h-screen bg-[#f8f8f8] text-black relative overflow-x-hidden flex flex-col">
                        {/* Header users */}

                        {/* <pre>{JSON.stringify(currentUser, null, 2)}</pre> */}

                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-cover"></div>

                        {/* ✅ CONTENU POUR UTILISATEUR NON AUTHENTIFIÉ */}
                        <div className="relative z-10 flex flex-col items-center px-6 mt-6 mb-32 w-full">

                            {/* Composant actif avec scroll horizontal */}
                            <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mt-2 md:mt-6 px-2 md:px-4 overflow-x-auto pb-4">

                                {/* PRIX AFICHIER UNIQUEMENT SI LE ROLE EST PROVIDER */}
                                {userRole === Role.PROVIDER && (
                                    <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-lg">
                                        {/* ICON */}
                                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-cyan-600" >
                                                <rect width={14} height={20} x={5} y={2} rx={2} ry={2} />
                                                <path d="M12 18h.01" />
                                            </svg>
                                        </div>

                                        {/* TEXTE */}
                                        <div className="flex-1 text-left">
                                            <h3 className="font-bold text-slate-800">Wallet 1000 ₣</h3>
                                            <button onClick={() => setIsRechargeOpen(true)} className="mt-1 inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-900 hover:bg-slate-200"  >
                                                Recharger mon compte
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {userRole === Role.PROVIDER && (
                                    <div className="w-full flex justify-center items-center mt-4">
                                        <div className="flex gap-2 rounded-full bg-gray-200 p-1 text-sm md:text-base">
                                            {visibleTabs.map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => setActive(tab.key)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-full font-medium transition",
                                                        active === tab.key
                                                            ? "bg-brand-primary text-white"
                                                            : "text-gray-700 hover:text-black"
                                                    )}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {active === "rdv" && (
                                    <div className="w-full mt-4 rounded-2xl p-0">
                                        <RendezVous />
                                        <AppointmentCalendar />
                                    </div>
                                )}

                                {activeTab === "histo" && (
                                    <>
                                        <div className="w-full mt-4 rounded-2xl p-0">
                                            <HistoryCard />

                                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">

                                                <div className="flex items-center justify-between px-4 py-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-gray-600" />
                                                        <span className="text-sm text-gray-800">Tiche comptable</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-[#a06a50] hover:text-blue-700 text-xs px-2 py-1 h-auto"  >
                                                        Consulter
                                                    </Button>
                                                </div>
                                            </div>

                                        </div>

                                    </>

                                )}

                                {/* Modal Recharge */}
                                <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />

                            </div>

                        </div>

                        <SocialFollow />
                    </div >

                </>
            ) : (

                <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 bg-cover bg-center" >
                    {isLoading && <FullPageLoader status={status} />}
                </div>

            )}

        </>
    );
}