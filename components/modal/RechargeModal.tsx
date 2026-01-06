"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useAlert } from "@/contexts/AlertContext";
import { z } from "zod";
import { Spinner } from "../forms/spinner/Loader";
import Image from "next/image";

interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// ✅ Définition du schéma de validation
const rechargeSchema = z.object({
    phone: z
        .string()
        .min(10, "Le numéro doit comporter au moins 10 chiffres")
        .regex(/^0[0-9]{9}$/, "Le numéro doit être valide (ex: 0700000000)"), 
        amount: z
        .string()
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 100, {
            message: "Le montant doit être au moins 100 FCFA",
        }),
});

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { showAlert } = useAlert();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ Validation avec Zod
        const validation = rechargeSchema.safeParse({ phone, amount });

        if (!validation.success) {
            const firstError = validation.error.issues[0]?.message;
            showAlert(firstError || "Veuillez vérifier les champs saisis ⚠️", "error");
            return;
        }

        setIsLoading(true);

        // Simulation du paiement Wave
        setTimeout(() => {
            setIsLoading(false);

            const isSuccess = Math.random() > 0.2; // 80 % de chance de succès
            if (isSuccess) {
                showAlert(`Paiement Wave de ${amount} FCFA effectué avec succès 🎉`, "success");
                setAmount("");
                setPhone("");
                onClose();
            } else {
                showAlert("Le paiement a échoué, veuillez réessayer ❌", "error");
            }
        }, 2500);
    };

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 relative animate-in fade-in-50 slide-in-from-top-10 duration-300">
                {/* Bouton fermer */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 transition"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </button>

                <h2 className="text-lg font-semibold text-center text-[#a06a50] mb-4">
                    Recharger mon compte
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Champ téléphone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Numéro Wave
                        </label>
                        <input
                            type="tel"
                            placeholder="Ex: 0700000000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#a06a50] outline-none"
                            required
                            inputMode="numeric"
                            style={{ fontSize: '16px' }}


                        />
                    </div>

                    {/* Champ montant */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Montant à recharger
                        </label>
                        <input
                            type="number"
                            min="100"
                            placeholder="Ex: 2000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-[#a06a50] outline-none"
                            required
                            inputMode="numeric"
                            style={{ fontSize: '16px' }}
                        />
                    </div>

                    {/* Moyen de paiement */}
                    <div className="border border-[#a06a50]/30 rounded-xl p-3 bg-[#a06a50]/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Image src="/wave2.png" alt="Wave" width={32} height={32} className="mb-2 object-contain" />
                            <p className="text-sm text-gray-700 font-medium">
                                Paiement via Wave
                            </p>
                        </div>
                    </div>

                    {/* Bouton ou spinner */}
                    {isLoading ? (
                        <div className="flex justify-center py-4">
                            <Spinner />
                        </div>
                    ) : (
                        <button type="submit" className="w-full bg-[#a06a50] hover:bg-[#8e5f48] text-white py-2 rounded-lg font-medium transition" >
                            Valider le paiement
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
