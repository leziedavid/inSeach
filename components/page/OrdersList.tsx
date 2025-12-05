"use client"

import { useState } from "react"
import { Calendar, Package } from "lucide-react"


const commandes = [
    { client: "Koffi Jean", produit: "Tomates fraîches", heure: "09h30" },
    { client: "Ahoua Marie", produit: "Carottes bio", heure: "11h15" },
    { client: "Tra Bi Lezie", produit: "Menthe verte", heure: "15h00" },
]

export default function OrdersList() {

    return (
        <>

            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    <Package className="w-4 h-4" /> Commandes du jour
                </h3>
                <button className="text-[#b07b5e] text-xs font-medium hover:underline">
                    Voir tout
                </button>
            </div>

            <div className="space-y-3">
                {commandes.map((cmd, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                    >
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                {cmd.produit}
                            </p>
                            <p className="text-xs text-gray-500">{cmd.client}</p>
                        </div>
                        <span className="text-xs bg-[#b07b5e22] text-[#b07b5e] px-2 py-1 rounded-md">
                            {cmd.heure}
                        </span>
                    </div>
                ))}
            </div>

        </>
    )
}