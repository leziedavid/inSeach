"use client"

import { useState, ReactNode, useEffect } from "react"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import RendezVous from "./RendezVous"
import RechargeModal from "../modal/RechargeModal"
import { Button } from "../ui/button"
import AppointmentCalendar from "./AppointmentCalendar"
import { HistoryCard } from "./HistoryCard"
import { Role } from "@/types/interfaces"
import { getUserInfos } from "@/app/middleware"
import { Historytype } from "@/app/history/page"

export default function History() {

    const [activeTab, setActiveTab] = useState<Historytype>(Historytype.RDV)
    const [isRechargeOpen, setIsRechargeOpen] = useState(false);
    // Simuler le rôle connecté
    const [userRole, setUserRole] = useState<Role>(Role.USER);

    // get user role by mildelware
    const getUserRoles = async () => {
        const user = await getUserInfos();
        console.log("userRole", user)
        if (user)
            setUserRole(user?.roles);
    };

    useEffect(() => {
        getUserRoles();
    }, []);

    const changeTabs = (tab: Historytype) => {
        setActiveTab(tab)
    }

    return (


        <div className="w-full flex justify-center md:px-0">
            <div className="relative overflow-hidden w-full">

                <pre>{userRole} ok </pre>

                {/* Carte Wallet */}

                {/* PRIX AFICHIER UNIQUEMENT SI LE ROLE EST PROVIDER */}
                {userRole === Role.PROVIDER && (
                    <div className="flex items-center gap-3 bg-gray-10 p-4 rounded-lg">

                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone w-5 h-5 text-cyan-600"  >
                                <rect width={14} height={20} x={5} y={2} rx={2} ry={2} />
                                <path d="M12 18h.01" />
                            </svg>
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-slate-800">Wallet 1000 ₣</h3>
                            <button onClick={() => setIsRechargeOpen(true)} className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors  border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-700 text-xs mt-1" >
                                Recharger mon compte
                            </button>
                        </div>
                    </div>
                )}

                <div className="w-full">

                    {/* Onglets */}
                    {/* PRIX AFFICHER UNIQUEMENT SI LE ROLE EST PROVIDER */}
                    {userRole === Role.PROVIDER && (
                        <div className="flex bg-gray-80 dark:bg-gray-800 rounded-xl p-1 space-x-2">
                            <button onClick={() => changeTabs(Historytype.RDV)}
                                className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition", activeTab === Historytype.RDV ? "bg-[#b07b5e] dark:bg-gray-900 shadow-sm text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200")} >
                                Rendez-vous
                            </button>
                            <button onClick={() => changeTabs(Historytype.HISTO)} className={cn("flex-1 py-2 rounded-lg text-sm font-medium transition", activeTab === Historytype.HISTO ? "bg-[#b07b5e] dark:bg-gray-900 shadow-sm text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200")} >
                                Historique
                            </button>
                        </div>
                    )}

                    {/* Onglets pour CLIENT */}
                    {userRole === Role.CLIENT && (
                        <div className="flex bg-gray-80 dark:bg-gray-800 rounded-xl p-1 space-x-2">
                            <button onClick={() => changeTabs(Historytype.ORDERS)}>Mes commandes</button>
                            <button onClick={() => changeTabs(Historytype.RDV)}>Mes rendez-vous</button>
                        </div>
                    )}

                    {/* Onglets pour SELLER */}
                    {userRole === Role.SELLER && (
                        <div className="flex bg-gray-80 dark:bg-gray-800 rounded-xl p-1 space-x-2">
                            <button onClick={() => changeTabs(Historytype.ANNONCE)}>Mes annonces</button>
                            <button onClick={() => changeTabs(Historytype.ORDERS)}>Mes ventes</button>
                        </div>
                    )}

                    {/* Contenu onglet */}
                    {activeTab === Historytype.RDV && (
                        <div className="w-full mt-4 rounded-2xl p-0">
                            {/* <OrdersList /> */}
                            <RendezVous type={activeTab} />
                            <AppointmentCalendar />
                        </div>
                    )}

                    {activeTab === Historytype.HISTO && (
                        <>
                            <div className="w-full mt-4 rounded-2xl p-0">
                                <HistoryCard />

                                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                                    <div className="flex items-center justify-between px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-gray-600" />
                                            <span className="text-sm text-gray-800">Tiche comptable</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-[#a06a50] hover:text-blue-700 text-xs px-2 py-1 h-auto" >
                                            Consulter
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Ajouter les autres onglets si nécessaire */}
                    {activeTab === Historytype.ORDERS && (
                        <div className="w-full mt-4 rounded-2xl p-0">
                            <p>Contenu des commandes</p>
                        </div>
                    )}

                    {activeTab === Historytype.ANNONCE && (
                        <div className="w-full mt-4 rounded-2xl p-0">
                            <p>Contenu des annonces</p>
                        </div>
                    )}
                </div>
                {/* Modal Recharge */}
                <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />

            </div>

        </div>

    )

}
