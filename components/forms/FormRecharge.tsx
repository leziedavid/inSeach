"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export default function FormRecharge() {
    const [montant, setMontant] = useState("")
    const [checked, setChecked] = useState(false)

    const handlePreset = (value: string) => {
        setMontant(value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!checked) { alert("Veuillez accepter les conditions d'utilisation.")
            return
        }
        alert(`Rechargement de ${montant} F effectué ✅`)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-5 text-gray-800 dark:text-gray-100"
        >
            {/* Header */}
            <div className="text-center">
                <h2 className="text-lg font-semibold mb-1">Points Cabine+</h2>
            </div>

            {/* Points */}
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Vos points Cabine+</span>
                    <span className="text-2xl font-bold">0</span>
                </div>
                <Info className="w-5 h-5 text-gray-500" />
            </div>

            {/* Montant */}
            <div>
                <label className="block text-sm font-medium mb-1">
                    Montant à recharger
                </label>
                <Input
                    type="number"
                    placeholder="Entrez le montant"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    className="text-right pr-10"
                />
                <span className="absolute right-6 mt-[-28px] text-gray-500 font-semibold">
                    F
                </span>
            </div>

            {/* Boutons de présélection */}
            <div className="flex justify-between gap-2">
                {["200", "500", "1000"].map((value) => (
                    <button key={value} type="button"  onClick={() => handlePreset(value)} className={`flex-1 py-2 border rounded-xl text-sm font-semibold transition  ${montant === value ? "bg-[#b07b5e] text-white border-[#b07b5e]"  : "border-gray-300 hover:border-[#b07b5e]"  }`} >
                        {value}
                    </button>
                ))}
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-2">
                <Checkbox
                    id="terms"
                    checked={checked}
                    onCheckedChange={(val) => setChecked(!!val)}
                />
                <label htmlFor="terms" className="text-sm leading-tight">
                    J'ai lu et j'accepte les{" "}
                    <span className="underline text-[#b07b5e]">
                        conditions d'utilisation des points
                    </span>
                </label>
            </div>

            <a href="#" className="text-sm text-[#b07b5e] hover:underline -mt-3" >  En savoir plus sur les points </a>
            {/* Bouton principal */}
            <Button type="submit" className="mt-2 bg-[#b07b5e] hover:bg-[#b07b5e] w-full rounded-xl text-white font-semibold py-3" >
                Acheter des points
            </Button>
        </form>
    )
}
