"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Lock, LogOut } from "lucide-react";
import UserProfile from "./UserProfile";
import { logout } from "@/app/middleware";
import Link from "next/link"


export default function Setting() {


    return (
        <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-6">
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Paramètres
            </h1>
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

            <div className="text-center text-[10px] text-gray-500 mt-6">
                <p>Version 1.0.0</p>
                <p className="mt-0.5">© 2025 inSeach. Tous droits réservés.</p>
            </div>

        </div>
    )
}
