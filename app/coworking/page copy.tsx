"use client";

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Calendars from "@/components/page/Calendars"
import FooterNav from "@/components/page/FooterNav"
import Header from "@/components/page/Header"
import WhatsAppButton from "@/components/page/WhatsAppButton"
import Support from "@/components/page/Support"
import History from "@/components/page/History"
import Setting from "@/components/page/Setting"
import MySlider from "@/components/page/Slider"
import { fakeServices } from "@/data/fakeServices"
import { AuthUser, Role, ServiceType } from "@/types/interfaces"
import ListeProducts from "@/components/page/ListeProducts"
import { products } from "@/data/products"
import { getUserInfos } from "../middleware";

// Components dynamiques
const ServicesGrid = dynamic(() => import("@/components/page/ServicesGrid"), { ssr: false })
const ListeService = dynamic(() => import("@/components/page/ListeService"), { ssr: false })

// Types
type TabKey = "PRESTA" | "SERVICES" | "SELLER"
interface TabItem { key: TabKey; label: string; isVisible?: boolean }

export default function Page() {

  const [users, setUsers] = useState<AuthUser | null>(null)

  useEffect(() => {
    getUserInfos().then(setUsers)
  }, [])

  // 🔥 Mock utilisateur
  const currentUser = {
    role: Role.SELLER,
    serviceType: ServiceType.MIXED,
  }

  const [activeTab, setActiveTab] = useState("home")
  const [selectedTab, setSelectedTab] = useState<TabKey>("SERVICES")

  // ---------------------------------------------------------
  // 🎯 Logique pour déterminer les tabs visibles selon status
  // ---------------------------------------------------------
  const getVisibleTabs = (): TabItem[] => {

    const { role, serviceType } = currentUser;

    let tabs: TabItem[] = [
      { key: "SERVICES", label: "Services", isVisible: true } // toujours visible
    ];

    // Status conditionnel : false = caché pour dev
    const statusMap: Record<TabKey, boolean> = {
      PRESTA: true,  // visible
      SERVICES: true,
      SELLER: true  // caché pour l’instant
    };

    // Ajouter PRESTA si serviceType ou role le permet
    if ((serviceType === ServiceType.MIXED || serviceType === ServiceType.APPOINTMENT)
      && (role === Role.PROVIDER || role === Role.ADMIN || role === Role.SELLER)) {
      tabs.unshift({ key: "PRESTA", label: "Prestataire", isVisible: statusMap.PRESTA });
    }

    // Ajouter SELLER si serviceType ou role le permet
    if ((serviceType === ServiceType.MIXED || serviceType === ServiceType.PRODUCT)
      && (role === Role.SELLER || role === Role.ADMIN)) {
      tabs.push({ key: "SELLER", label: "Boutique", isVisible: statusMap.SELLER });
    }

    // Ne retourner que les tabs visibles
    return tabs.filter(tab => tab.isVisible);
  }

  const visibleTabs = getVisibleTabs();

  // ---------------------------------------------------------
  // 👉 Contenu HOME selon tab sélectionnée
  // ---------------------------------------------------------
  const renderHomeContent = () => (
    <>
      <MySlider />

      {/* TABS visibles uniquement si plus d’un */}
      {visibleTabs.length > 1 && (
        <div className="flex items-center justify-center bg-[#ffffff] dark:bg-gray-800 rounded-xl p-1 mt-3 mb-2">
          {visibleTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition mx-1
              ${selectedTab === tab.key ? "bg-[#b07b5e] text-white" : "text-gray-600"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* CONTENU SELON TAB, uniquement si visible */}
      {selectedTab === "PRESTA" && visibleTabs.some(t => t.key === "PRESTA") && <ListeService services={fakeServices} />}
      {selectedTab === "SERVICES" && visibleTabs.some(t => t.key === "SERVICES") && <ServicesGrid services={fakeServices} />}
      {selectedTab === "SELLER" && visibleTabs.some(t => t.key === "SELLER") && <ListeProducts products={products} />}
    </>
  )

  // ---------------------------------------------------------
  // 👉 Rendu principal [#ffffff] [#FAF3E8]
  // ---------------------------------------------------------
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#ffffff] relative overflow-hidden">
      <div className="bg-[#ffffff] w-full max-w-md h-screen flex flex-col rounded-3xl overflow-hidden">

        {/* HEADER */}
        <Header />

        {/* CONTENU */}
        <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar">
          {activeTab === "home" && renderHomeContent()}
          {activeTab === "calendar" && <Calendars />}
          {activeTab === "support" && <Support />}
          {activeTab === "settings" && <Setting />}
          {activeTab === "history" && <History />}
        </div>

        {/* FOOTER */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm z-50 bg-[#ffffff] border-gray-200">
          <FooterNav onTabChange={setActiveTab} />
        </div>
      </div>

      {/* WHATSAPP FLOAT */}
      <WhatsAppButton />
    </main>
  )
}
