"use client";

import { useEffect, useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import SearchEntreprises from "@/components/home/SearchEntreprises";
import SearchServices from "@/components/home/SearchServices";
import SocialFollow from "@/components/home/SocialFollow";
import { User } from "@/types/interfaces";
import { getMyData } from "@/services/securityService";
import { Role, ServiceType } from "@/types/interfaces";
import SearchPrestations from "@/components/home/SearchPrestations";
import { Loader } from "lucide-react";
import FullPageLoader from "@/components/home/FullPageLoader";


interface Company {
  name: string;
  description: string;
  domain: string;
  location?: string;
  website?: string;
  size?: string;
  specialization?: string;
}

type TabKey = "ENTREPRISE" | "PRESTA" | "SERVICES" | "SELLER";
interface TabItem { key: TabKey; label: string; isVisible?: boolean }

export default function Home() {

  // const [searchMode, setSearchMode] = useState<"entreprises" | "services">("entreprises");
  const [searchMode, setSearchMode] = useState<TabKey>("ENTREPRISE");
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
          setSearchMode("SERVICES");
          setIsLoading(false);
        } else {
          setusersData(null);
          setOff(false);
          setSearchMode("ENTREPRISE");
          setIsLoading(false);
        }
      } catch (e) {
        setusersData(null);
        setOff(false);
        setSearchMode("ENTREPRISE");
        setIsLoading(false);
      }
    };

    init();
  }, []);


  const currentUser = users
    ? {
      role: users.roles,
      serviceType: users.serviceType,
      typeCompte: users.typeCompte,
      name: users.name,
      companyName: users.companyName,
      status: users.status,
    }
    : {};

  // ---------------------------------------------------------
  // 🎯 Déterminer les tabs visibles selon role & serviceType
  // ---------------------------------------------------------
  const getVisibleTabs = (): TabItem[] => {

    const { role, serviceType } = currentUser;
    let tabs: TabItem[] = [
      { key: "SERVICES", label: "Services", isVisible: true, }
      // { key: "ENTREPRISE", label: "Entreprise", isVisible: true, },
    ];

    const statusMap: Record<TabKey, boolean> = {
      PRESTA: true,
      SERVICES: true,
      SELLER: true,
      ENTREPRISE: true,
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

              {off ? (
                <>
                  {/* SEARCH MODE TABS */}
                  {visibleTabs.length > 1 && (
                    <div className="flex gap-4 mb-3 rounded-full bg-gray-200 p-1 text-sm md:text-base">

                      {/* <div className="flex items-center justify-center dark:bg-gray-800 rounded-xl p-1 mt-3 mb-2 space-x-2"> */}
                      {visibleTabs.map(tab => (
                        <button key={tab.key} onClick={() => setSearchMode(tab.key)} className={`px-4 py-2 rounded-full font-medium ${searchMode === tab.key ? "bg-brand-primary hover:bg-brand-secondary text-white" : "text-gray-700"}`} >
                          {tab.label}
                        </button>
                      ))}
                      {/* </div> */}

                    </div>
                  )}

                </>
              ) : (

                <>
                  <div className="flex gap-4 mb-3 rounded-full bg-gray-200 p-1 text-sm md:text-base">

                    <button className={`px-4 py-2 rounded-full font-medium ${searchMode === "ENTREPRISE" ? "bg-brand-primary hover:bg-brand-secondary text-white" : "text-gray-700"}`} onClick={() => setSearchMode("ENTREPRISE")} >
                      Entreprises
                    </button>

                    <button className={`px-4 py-2 rounded-full font-medium ${searchMode === "SERVICES" ? "bg-brand-primary hover:bg-brand-secondary text-white" : "text-gray-700"}`} onClick={() => setSearchMode("SERVICES")} >
                      Services
                    </button>
                  </div>


                  <div className="flex flex-col items-start space-y-4">
                    <h1 className="text-3xl sm:text-2xl md:text-5xl font-medium leading-tight max-w-full sm:max-w-lg md:max-w-2xl break-words">
                      Recherchez des{" "}
                      <span className="font-black text-brand-secondary">
                        {searchMode === "ENTREPRISE" ? "entreprises" : "services"} instantanément
                      </span>
                    </h1>

                    <p className="text-gray-600 max-w-md">
                      L'intelligence artificielle vous aide à identifier les meilleures {searchMode} dans n'importe quel domaine.
                    </p>
                  </div>


                </>

              )}

              {/* Composant actif avec scroll horizontal */}
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mt-2 md:mt-6 px-2 md:px-4 overflow-x-auto pb-4">
                <div className="flex gap-4">

                  <>
                    {off ? (
                      <>

                        {searchMode === "PRESTA" && visibleTabs.some(t => t.key === "PRESTA") && (
                          <SearchPrestations />
                        )}
                        {searchMode === "SERVICES" && visibleTabs.some(t => t.key === "SERVICES") && (
                          <SearchServices />
                        )}
                        {searchMode === "SELLER" && visibleTabs.some(t => t.key === "SELLER") && (
                          <SearchEntreprises />
                        )}
                      </>
                    ) : (
                      <> {searchMode === "ENTREPRISE" ? <SearchEntreprises /> : <SearchServices />}  </>
                    )}
                  </>

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