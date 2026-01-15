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
import RendezVousAnnonce from "@/components/home/RendezVousAnnonce";

export enum Historytype {
    RDV = "services",
    HISTO = "historique",
    ORDERS = "commandes",
    ANNONCE = "annonces"
}

export default function Page() {
    const [activeTab, setActiveTab] = useState("home");
    const [users, setusersData] = useState<User | null>(null);
    const [off, setOff] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>(" Chargement...");
    const [active, setActive] = useState<Historytype>(Historytype.RDV)
    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    const [userRole, setUserRole] = useState<Role | null>(null);

    // Définition des onglets visibles selon le rôle Transactions Commandes
    const getVisibleTabs = () => {
        switch (userRole) {
            case Role.PROVIDER:
                return [
                    { key: Historytype.RDV, label: "Rendez-vous", isVisible: true },
                    { key: Historytype.ANNONCE, label: "Mes annonces", isVisible: true },
                    { key: Historytype.ORDERS, label: "Mes commandes", isVisible: true },
                    { key: Historytype.HISTO, label: "Transactions", isVisible: true }
                ];
            case Role.CLIENT:
                return [
                    { key: Historytype.RDV, label: "Mes rendez-vous", isVisible: true },
                    { key: Historytype.ANNONCE, label: "Mes annonces", isVisible: true },
                    { key: Historytype.ORDERS, label: "Mes commandes", isVisible: true },
                    { key: Historytype.HISTO, label: "Transactions", isVisible: true }

                ];
            case Role.SELLER:
                return [
                    { key: Historytype.ORDERS, label: "Mes commandes", isVisible: true },
                    { key: Historytype.HISTO, label: "Transactions", isVisible: true }
                ];
            default:
                return [];
        }
    };

    const visibleTabs = getVisibleTabs();

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
                    setUserRole(user.data.roles);
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

    // Fonction pour changer d'onglet
    const changeTabs = (tab: Historytype) => {
        setActive(tab);
    };

    return (
        <>
            {!isLoading ? (
                <>
                    <HomeHeader off={off} activeTab={activeTab} onTabChange={setActiveTab} userId={users?.id} />

                    <div className="min-h-screen bg-[#f8f8f8] text-black relative overflow-x-hidden flex flex-col">
                        {/* Header users */}

                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-cover"></div>

                        {/* ✅ CONTENU POUR UTILISATEUR NON AUTHENTIFIÉ */}
                        <div className="relative z-10 flex flex-col w-full px-3 mt-6 mb-32 lg:px-6 lg:items-center">

                            {/* Composant actif avec scroll horizontal */}
                            <div className="w-full max-w-full px-2 mt-2 pb-4 overflow-x-auto md:mt-6 md:px-4 lg:max-w-2xl lg:mx-auto">
                                <div className="min-w-0">

                                    {/* PRIX AFFICHER UNIQUEMENT SI LE ROLE EST PROVIDER */}
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
                                                <button
                                                    onClick={() => setIsRechargeOpen(true)}
                                                    className="mt-1 inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-900 hover:bg-slate-200"
                                                >
                                                    Recharger mon compte
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Onglets - Afficher uniquement si PROVIDER */}
                                    {visibleTabs.length > 0 && (
                                        <div className=" w-full mt-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] ">
                                            <div className="flex gap-1.5 w-max mx-auto rounded-full bg-gray-200 p-1 text-xs sm:text-sm">
                                                {visibleTabs.map((tab) => (
                                                    <button key={tab.key} onClick={() => changeTabs(tab.key)} className={cn("px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-medium transition", "text-[11px] sm:text-sm whitespace-nowrap", active === tab.key ? "bg-[#b07b5e] text-white" : "text-gray-700 hover:text-black")}  >
                                                        {tab.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Contenu des onglets */}
                                    {active === Historytype.RDV && (
                                        <div className="w-full mt-4 rounded-2xl p-0">
                                            <RendezVous type={active} />
                                            <AppointmentCalendar />
                                        </div>
                                    )}

                                    {active === Historytype.HISTO && (
                                        <>
                                            <div className="w-full mt-4 rounded-2xl p-0">
                                                <HistoryCard />

                                                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                                                    <div className="flex items-center justify-between px-4 py-2.5">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-gray-600" />
                                                            <span className="text-sm text-gray-800">Tiche comptable</span>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-[#a06a50] hover:text-blue-700 text-xs px-2 py-1 h-auto"
                                                        >
                                                            Consulter
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Vous pouvez ajouter d'autres onglets ici */}
                                    {active === Historytype.ORDERS && (
                                        <div className="w-full mt-4 rounded-2xl p-0">
                                            <p>Contenu des commandes</p>
                                        </div>
                                    )}

                                    {active === Historytype.ANNONCE && (
                                        <div className="w-full mt-4 rounded-2xl p-0">
                                            <p>Contenu des annonces</p>
                                            <RendezVousAnnonce type={active} />
                                        </div>
                                    )}

                                    {/* Modal Recharge */}
                                    <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />

                                </div>
                            </div>

                        </div>

                        <SocialFollow />
                    </div>
                </>
            ) : (
                <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 bg-cover bg-center">
                    {isLoading && <FullPageLoader status={status} />}
                </div>
            )}
        </>
    );
}