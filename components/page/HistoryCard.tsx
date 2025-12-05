// HistoryCard.tsx
"use client";

import React, { useState, useEffect, JSX } from "react";
import { User, ShoppingCart, DollarSign, Calendar } from "lucide-react";
import { OverviewStats, Role } from "@/types/interfaces";
import { getUserInfos } from "@/app/middleware";
import { getOverviewStats } from "@/services/history";

export const defaultStats: OverviewStats = {
    totalUser: 2480,
    totalOrders: 1320,
    totalRevenue: 985000,
    totalAppointments: 743,
} as const;

export const HistoryCard: React.FC = () => {
    const [role, setUserRole] = useState<Role>(Role.PROVIDER);
    const [history, setHistory] = useState(null as OverviewStats | null);


    // get user role by mildelware
    const getUserRoles = async () => {
        const user = await getUserInfos();
        if (user)
            setUserRole(user?.roles);
    };

    useEffect(() => {
        getUserRoles();
    }, []);

    const getHistory = async () => {
        // type?: "ORDERS" | "APPOINTMENTS"
        let type: "APPOINTMENTS" | "ORDERS" | undefined;
        if (role == "PROVIDER") {
            type = "APPOINTMENTS";
        }
        else if (role == "SELLER") {
            type = "ORDERS";
        }

        const res = await getOverviewStats(type);
        if (res.statusCode === 200) {
            setHistory(res.data ?? null);
        }
    };

    useEffect(() => {
        getHistory();
    }, [role]);

    const allCards: Array<{ label: string; value: number; icon: JSX.Element; roles: Role[] }> = [
        { label: "Utilisateurs", value: history?.totalUser ?? 0, icon: <User className="w-5 h-5 text-white" />, roles: [Role.ADMIN] },
        { label: "Commandes", value: history?.totalOrders ?? 0, icon: <ShoppingCart className="w-5 h-5 text-white" />, roles: [Role.ADMIN, Role.SELLER] },
        { label: "Revenus", value: history?.totalRevenue ?? 0, icon: <DollarSign className="w-5 h-5 text-white" />, roles: [Role.ADMIN, Role.SELLER, Role.PROVIDER, Role.CLIENT, Role.USER] },
        { label: "Rendez-vous", value: history?.totalAppointments ?? 0, icon: <Calendar className="w-5 h-5 text-white" />, roles: [Role.ADMIN, Role.PROVIDER, Role.USER] },
    ];

    const visibleCards = allCards.filter(card => card.roles.includes(role));

    const columnsClass = visibleCards.length === 1 ? "grid-cols-1" : "grid-cols-2";


    return (
        <div className="grid grid-cols-2 gap-4">
            {visibleCards.map((item) => (
                <div
                    key={item.label}
                    className="flex items-center p-4 bg-gray-100 rounded-xl border border-gray-100 transition-all hover:scale-105"
                >
                    <div className="p-1 rounded-full bg-[#b07b5e] flex items-center justify-center mr-3">
                        {item.icon}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-gray-500 text-xs truncate">{item.label}</p>
                        <p className="text-lg font-bold">{item.value.toLocaleString()}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
