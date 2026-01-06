"use client"

import { useState, ReactNode } from "react"
import { Phone, MessageCircle, MessageSquareText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContactItem {
    id: string
    name: string
    icon: ReactNode
    value: string
    href: string
    subtext?: string
}


export default function Support() {
    const [activeTab, setActiveTab] = useState<"contact" | "conseil">("contact")

    const phone = "+2250153686819" // 🔥 tu peux changer ici facilement

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
        <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-6">
            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Support
            </h1>

            {/* Onglets */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                    onClick={() => setActiveTab("contact")}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition",
                        activeTab === "contact"
                            ? "bg-white dark:bg-gray-900 shadow-sm text-teal-700"
                            : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    )}
                >
                    Contact
                </button>

                <button
                    onClick={() => setActiveTab("conseil")}
                    className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition",
                        activeTab === "conseil"
                            ? "bg-white dark:bg-gray-900 shadow-sm text-teal-700"
                            : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                    )}
                >
                    Conseil +
                </button>
            </div>

            {/* Contenu onglet */}
            {activeTab === "contact" && (
                <div className="flex flex-col gap-3">
                    {contacts.map((c) => (
                        <a
                            key={c.id}
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition"
                        >
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

            {activeTab === "conseil" && (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                    Gestion des conseils + (bientôt disponible)
                </div>
            )}
        </div>
    )
}
