"use client";

import { useEffect, useState } from "react";
import HomeHeader from "@/components/home/HomeHeader";
import SearchEntreprises from "@/components/home/SearchEntreprises";
import SearchServices from "@/components/home/SearchServices";
import SocialFollow from "@/components/home/SocialFollow";
import { User } from "@/types/interfaces";
import { getMyData } from "@/services/securityService";
import { Role, ServiceType } from "@/types/interfaces";
import FullPageLoader from "@/components/home/FullPageLoader";
import Image from "next/image";
import AnnonceServices from "@/components/home/AnnonceServices";
import ProductCarousel from "@/components/home/ProductCarousel";

// ✅ Types d'onglets disponibles (PRESTA retiré)
type TabKey = "ENTREPRISE" | "SERVICES" | "SELLER" | "ANNONCE" | "RESTAURANT";

interface TabConfig {
  key: TabKey;
  label: string;
  isActive: boolean; // 🆕 Indique si le composant est prêt
  comingSoon?: boolean; // 🆕 Optionnel pour afficher "Bientôt"
}

// ✅ Configuration globale des onglets avec leur état de développement
const ALL_TABS: TabConfig[] = [
  {
    key: "ENTREPRISE",
    label: "Entreprises",
    isActive: true // ✅ Composant prêt
  },
  {
    key: "SERVICES",
    label: "Services",
    isActive: true // ✅ Composant prêt
  },
  {
    key: "ANNONCE",
    label: "Annonces",
    isActive: true // ✅ Composant prêt
  },
  {
    key: "SELLER",
    label: "Boutique",
    isActive: false, // 🚧 En développement
    comingSoon: true
  },

  {
    key: "RESTAURANT",
    label: "Resto",
    isActive: false, // 🚧 En développement
    comingSoon: true
  }
];

// ✅ Composants associés aux onglets
const TAB_COMPONENTS: Record<TabKey, React.ComponentType> = {
  ENTREPRISE: SearchEntreprises,
  SERVICES: SearchServices,
  SELLER: SearchEntreprises, // Temporaire, à remplacer par SearchBoutiques
  ANNONCE: AnnonceServices,
  RESTAURANT: SearchServices, // Temporaire, à remplacer par RestaurantServices
};

// ✅ Messages d'accueil par onglet
const WELCOME_MESSAGES: Record<TabKey, { title: string; subtitle: string }> = {
  ENTREPRISE: {
    title: "Recherchez des entreprises instantanément",
    subtitle: "L'intelligence artificielle vous aide à identifier les meilleures entreprises dans n'importe quel domaine."
  },
  SERVICES: {
    title: "Recherchez des services professionnels",
    subtitle: "Trouvez le service parfait pour vos besoins."
  },
  SELLER: {
    title: "Découvrez nos boutiques partenaires",
    subtitle: "Des produits de qualité auprès de vendeurs certifiés."
  },
  ANNONCE: {
    title: "Trouvez votre logement idéal",
    subtitle: "Découvrez nos annonces immobilières vérifiées et certifiées."
  },
  RESTAURANT: {
    title: "Découvrez des restaurants",
    subtitle: "Trouvez les meilleures tables et plats près de chez vous."
  }
};

export default function Home() {
  const [searchMode, setSearchMode] = useState<TabKey>("ENTREPRISE");
  const [off, setOff] = useState(false);
  const [users, setusersData] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string>("Chargement...");

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

          // Définir le premier onglet actif comme mode par défaut
          const firstActiveTab = ALL_TABS.find(tab => tab.isActive);
          if (firstActiveTab) {
            setSearchMode(firstActiveTab.key);
          }
          setIsLoading(false);
        } else {
          setusersData(null);
          setOff(false);
          setSearchMode("ENTREPRISE");
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Erreur lors du chargement des données:", e);
        setusersData(null);
        setOff(false);
        setSearchMode("ENTREPRISE");
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // 🎯 Gestion du clic sur un onglet
  const handleTabClick = (tab: TabConfig) => {
    if (tab.isActive) {
      setSearchMode(tab.key);
    }
    // Si pas actif, on ne fait rien (ou on peut afficher une modale "Coming soon")
  };

  const currentTab = ALL_TABS.find(tab => tab.key === searchMode);
  const ActiveComponent = currentTab?.isActive ? TAB_COMPONENTS[searchMode] : null;
  const welcomeText = WELCOME_MESSAGES[searchMode] || WELCOME_MESSAGES.SERVICES;

  // Rendu conditionnel du texte en surbrillance
  const renderHighlightedTitle = (title: string) => {

    const words = title.split(" ");
    const highlightedWords = [
      "entreprises", "prestataires", "services", "boutiques",
      "annonces", "logement", "restaurants", "tables", "plats",
      "qualifiés", "professionnels", "partenaires", "immobilières"
    ];

    return words.map((word, index, array) => {
      const isHighlighted = highlightedWords.some(hw =>
        word.toLowerCase().includes(hw.toLowerCase())
      );

      return (
        <span key={index} className={`${isHighlighted ? "font-black text-brand-secondary" : ""}`}>
          {word}{index < array.length - 1 ? " " : ""}
        </span>
      );
    });
  };

  return (
    <>
      {!isLoading ? (
        <>
          <HomeHeader off={off} activeTab={activeTab} onTabChange={setActiveTab} userId={users?.id} />

          <div className="min-h-screen bg-[#f8f8f8] text-black relative overflow-x-hidden flex flex-col">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/pattern.png')] bg-cover"></div>

            {/* ✅ CONTENU PRINCIPAL */}
            <div className="relative z-10 flex flex-col w-full px-3 mt-6 mb-32 lg:px-6 lg:items-center">

              <div className="w-full max-w-full px-2 mt-2 pb-4 overflow-x-auto md:mt-6 md:px-4 lg:max-w-2xl lg:mx-auto">
                <div className="min-w-0">

                  {/* IMAGE ANIMÉE */}
                  <div className="flex justify-center items-center w-full mb-4 md:mb-6">
                    <Image src="/homepage-hero-animation-lf.avif" alt="Recherche intelligente" width={120} height={10} className="w-120 h-full object-contain" priority unoptimized />
                  </div>

                  {/* 🆕 SEARCH MODE TABS - Tous visibles avec indicateur d'état */}
                  <div className="w-full mb-3 flex justify-center">
                    <div className="w-full max-w-md">
                      <div className="flex flex-wrap gap-1 justify-start">
                        {ALL_TABS.map(tab => (
                          <button key={tab.key} onClick={() => handleTabClick(tab)} disabled={!tab.isActive} className={`  relative px-3 md:px-4 py-2 rounded-full font-medium  transition-all text-sm md:text-base  ${searchMode === tab.key && tab.isActive ? "bg-brand-primary hover:bg-brand-secondary text-white shadow-sm" : tab.isActive ? "text-gray-700 hover:bg-gray-300 bg-gray-100" : "text-gray-400 bg-gray-50 cursor-not-allowed opacity-60"}  `}  >  {tab.label}
                            {!tab.isActive && (
                              <span className="ml-1 text-xs">🚧</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* TEXTE D'ACCUEIL */}
                  <div className="flex flex-col items-center text-center space-y-3 md:space-y-4 mb-4 md:mb-6 px-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium leading-tight max-w-full sm:max-w-lg md:max-w-2xl">
                      {renderHighlightedTitle(welcomeText.title)}
                    </h1>

                    <p className="text-gray-600 text-sm md:text-base max-w-md">
                      {welcomeText.subtitle}
                    </p>
                  </div>

                  {/* COMPOSANT DE RECHERCHE ACTIF ou MESSAGE "Coming Soon" */}
                  <div >
                    {ActiveComponent ? (
                      <>
                        <ActiveComponent />
                        {/* <div className="p-4">
                      <ProductCarousel title="Nouveautés" showViewAll={true}  maxProducts={6}  />
                      <ProductCarousel   title="Meilleures ventes"   showViewAll={false}   />
                    </div> */}
                      </>


                    ) : (
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-dashed border-gray-300">
                        <div className="text-6xl mb-4">🚧</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Bientôt disponible
                        </h3>
                        <p className="text-gray-600">
                          Cette fonctionnalité est en cours de développement
                        </p>
                      </div>
                    )}
                  </div>

                </div>

              </div>

              <SocialFollow />
            </div>

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