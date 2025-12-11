'use client';

import { useEffect, useState } from "react";
import ListeProducts from "@/components/page/ListeProducts";
import { fakeServices } from "@/data/fakeServices";
import { products } from "@/data/products";
import { AuthUser, Role, ServiceType } from "@/types/interfaces";
import { Spinner } from "@/components/forms/spinner/Loader";
import { getUserInfos } from "@/app/middleware";
import ServicesGrid from "./ServicesGrid";
import ListeService from "./ListeService";

type TabKey = "PRESTA" | "SERVICES" | "SELLER";
interface TabItem { key: TabKey; label: string; isVisible?: boolean }

export default function CardTabs() {
    const [users, setUsers] = useState<AuthUser | null>(null);
    const [selectedTab, setSelectedTab] = useState<TabKey>("SERVICES");

    // 🔄 Charger infos utilisateur
    useEffect(() => {
        getUserInfos().then(setUsers);
    }, []);

    // 🔄 Affichage du spinner tant que les infos utilisateur ne sont pas chargées
    if (!users) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const currentUser = {
        role: users.roles,
        serviceType: users.serviceType,
        typeCompte: users.typeCompte,
        name: users.name,
        companyName: users.companyName,
        status: users.status,
    };

    // ---------------------------------------------------------
    // 🎯 Déterminer les tabs visibles selon role & serviceType
    // ---------------------------------------------------------
    const getVisibleTabs = (): TabItem[] => {
        const { role, serviceType } = currentUser;

        let tabs: TabItem[] = [
            { key: "SERVICES", label: "Services", isVisible: true }
        ];

        const statusMap: Record<TabKey, boolean> = {
            PRESTA: true,
            SERVICES: true,
            SELLER: true
        };

        if ((serviceType === ServiceType.MIXED || serviceType === ServiceType.APPOINTMENT) &&
            (role === Role.PROVIDER || role === Role.ADMIN || role === Role.SELLER)) {
            tabs.unshift({ key: "PRESTA", label: "Prestataire", isVisible: statusMap.PRESTA });
        }

        if ((serviceType === ServiceType.MIXED || serviceType === ServiceType.PRODUCT) &&
            (role === Role.SELLER || role === Role.ADMIN)) {
            tabs.push({ key: "SELLER", label: "Boutique", isVisible: statusMap.SELLER });
        }

        return tabs.filter(tab => tab.isVisible);
    };

    const visibleTabs = getVisibleTabs();

    // ---------------------------------------------------------
    // 🔹 Contenu de la page selon tab sélectionnée
    // ---------------------------------------------------------
    const renderContent = () => (
        <>


            <div className="w-full flex justify-center px-1 md:px-0">
                <div className="relative overflow-hidden w-full max-w-4xl">

                    {/* Sous-tabs pour filtrer le contenu */}
                    {visibleTabs.length > 1 && (
                        <div className="flex items-center justify-center dark:bg-gray-800 rounded-xl p-1 mt-3 mb-2 space-x-2">
                            {visibleTabs.map(tab => (
                                <button key={tab.key} onClick={() => setSelectedTab(tab.key)} className={`px-4 py-1 rounded-full text-sm font-medium transition mx-1 ${selectedTab === tab.key ? "bg-[#b07b5e] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 hover:text-gray-800 dark:hover:text-gray-200" }`}  >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}


                    {/* Contenu dynamique */}
                    {selectedTab === "PRESTA" && visibleTabs.some(t => t.key === "PRESTA") && (
                        <ListeService services={fakeServices} />
                    )}
                    {selectedTab === "SERVICES" && visibleTabs.some(t => t.key === "SERVICES") && (
                        <ServicesGrid services={fakeServices} />
                    )}
                    {selectedTab === "SELLER" && visibleTabs.some(t => t.key === "SELLER") && (
                        <ListeProducts products={products} />
                    )}

                </div>

            </div>
        </>
    );

    return (
        <div className="bg-[#f8f8f8] dark:bg-gray-900 p-1">
            {renderContent()}
        </div>
    );
}
