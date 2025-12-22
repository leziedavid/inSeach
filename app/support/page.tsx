"use client";


import { useState, ReactNode, useEffect } from "react"
import { Phone, MessageCircle, MessageSquareText } from "lucide-react"
import { cn } from "@/lib/utils"
import HomeHeader from "@/components/home/HomeHeader";
import { User } from "@/types/interfaces";
import FullPageLoader from "@/components/home/FullPageLoader";
import SocialFollow from "@/components/home/SocialFollow";
import { getMyData } from "@/services/securityService";

interface ContactItem {
    id: string
    name: string
    icon: ReactNode
    value: string
    href: string
    subtext?: string
}

export default function Page() {

    const [active, setActive] = useState<"contact" | "conseil">("contact")
    const phone = "+2250153686819" // 🔥 tu peux changer ici facilement
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

    const contacts: ContactItem[] = [
        {
            id: "phone",
            name: "Téléphone",
            icon: <Phone className="w-5 h-5 text-blue-500" />,
            value: phone,
            href: `tel:${phone}`, // 📞 Appel direct
            subtext: "Lun-Ven: 8h-18h, Sam: 8h-12h",
        },
        {
            id: "whatsapp",
            name: "WhatsApp",
            icon: <MessageCircle className="w-5 h-5 text-green-500" />,
            value: phone,
            href: `https://wa.me/${phone.replace("+", "")}`, // 💬 WhatsApp mobile + desktop
            subtext: "Lun-Ven: 8h-18h, Sam: 8h-12h",
        },
        {
            id: "sms",
            name: "SMS",
            icon: <MessageSquareText className="w-5 h-5 text-purple-500" />,
            value: phone,
            href: `sms:${phone}`, // ✉️ Ouvre l’application SMS
            subtext: "Réponse sous 24h (jours ouvrés)",
        },
    ]

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

                                {/* Onglets */}
                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                                    <button  onClick={() => setActive("contact")}
                                        className={cn(  "flex-1 py-2 rounded-lg text-sm font-medium transition", active === "contact" ? "bg-white dark:bg-gray-900 shadow-sm text-teal-700"  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" )}  >
                                        Contact
                                    </button>

                                    <button onClick={() => setActive("conseil")}
                                        className={cn( "flex-1 py-2 rounded-lg text-sm font-medium transition",  active === "conseil"  ? "bg-white dark:bg-gray-900 shadow-sm text-teal-700"  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200" )} >
                                        Conseil +
                                    </button>
                                </div>

                                {/* Contenu onglet */}
                                {active === "contact" && (
                                    <div className="flex flex-col gap-3">
                                        {contacts.map((c) => (
                                            <a  key={c.id}  href={c.href}  target="_blank" rel="noopener noreferrer"className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition" >
                                                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                    {c.icon}
                                                </div>

                                                <div className="flex flex-col text-sm">
                                                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                                                        {c.name}
                                                    </span>

                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {c.value}
                                                    </span>

                                                    {c.subtext && (
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            {c.subtext}
                                                        </span>
                                                    )}
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {active === "conseil" && (
                                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                                        Gestion des conseils + (bientôt disponible)
                                    </div>
                                )}
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