"use client";


import { useState, useEffect } from "react"

import HomeHeader from "@/components/home/HomeHeader";
import { User } from "@/types/interfaces";
import FullPageLoader from "@/components/home/FullPageLoader";
import SocialFollow from "@/components/home/SocialFollow";
import { getMyData } from "@/services/securityService";
import { Card, CardContent } from "@/components/ui/card";
import UserProfile from "@/components/home/UserProfile";
import { Button } from "@/components/ui/button";
import { FileText, Lock, LogOut } from "lucide-react";
import { logout } from "../middleware";
import Link from "next/link"

export default function Page() {

    const [off, setOff] = useState(false);
    const [users, setusersData] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState("home");
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>(" Chargement...");

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


                                {/* 🧍 Profil utilisateur */}
                                <UserProfile />

                                <div className="space-y-2.5">
                                    <Card className="rounded-xl shadow-sm border border-gray-200">
                                        <CardContent className="p-0 divide-y divide-gray-200">
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm text-gray-800">Termes et conditions</span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-[#a06a50] hover:text-blue-700 text-xs px-2 py-1 h-auto" >
                                                    Consulter
                                                </Button>
                                            </div>

                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <Lock className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm text-gray-800">Politique de confidentialité</span>
                                                </div>
                                                <Link href="/checkout" className="flex items-center">
                                                    <Button variant="ghost" size="sm" className="text-[#a06a50] hover:text-blue-700 text-xs px-2 py-1 h-auto" >
                                                        Consulter
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-xl shadow-sm border border-gray-200">
                                        <CardContent className="p-0">
                                            <div className="flex items-center justify-between px-4 py-2.5">
                                                <div onClick={logout} className="flex items-center gap-2">
                                                    <LogOut className="w-4 h-4 text-gray-600" />
                                                    <span className="text-sm text-gray-800">Déconnexion</span>
                                                </div>
                                                <Button onClick={logout} variant="ghost" size="sm" className="text-red-500 hover:text-red-600 text-xs px-2 py-1 h-auto">
                                                    Déconnecter
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
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