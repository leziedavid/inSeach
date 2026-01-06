"use client";

import { CreditCard, Package, MapPin, Edit2, ChevronRight, ArrowLeft, Plus } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { useAlert } from '@/contexts/AlertContext';
import { GeoLocationResult, getUserLocation } from '@/utils/geolocation';
import { AuthUser, UserLocation } from '@/types/interfaces';
import { getUserInfos } from '../middleware';
import { MessagesData } from '@/components/home/Messages';

// Types
type Address = {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
};

type PaymentType = "delivery" | "mobile_money";

type MobileMoneyOption = {
    id: string;
    name: string;
    logo: string;
};

export default function CheckoutPage() {

    const { cartItems } = useCart();
    const { showAlert } = useAlert();
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");
    const [msg, setMsg] = useState<MessagesData[]>([]);
    const [location, setLocation] = useState<GeoLocationResult | null>(null);
    const [users, setUsers] = useState<AuthUser | null>(null)

    // États principaux
    const [address, setAddress] = useState<Address>({
        street: "201 Bells Camp",
        city: "ADGER",
        state: "AL",
        zipCode: "35006-2319",
        country: "USA"
    });

    // ✅ useEffect après tous les useState

    const getUserLocationInfo = async () => {
        try {
            const data = await getUserInfos()
            if (data) {
                setLocation(data.location)
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des infos utilisateur :", err);
        }
    };

    useEffect(() => {
        getUserLocationInfo()
    }, [])

    const [paymentType, setPaymentType] = useState<PaymentType>("delivery");
    const [selectedMobileMoney, setSelectedMobileMoney] = useState<string>("");
    const [paymentNumber, setPaymentNumber] = useState("");   // <--- AJOUT IMPORTANT

    const mobileMoneyOptions: MobileMoneyOption[] = [
        { id: "wave", name: "Wave", logo: "/wave2.png" },
        { id: "orange", name: "Orange Money", logo: "/orange.png" },
        { id: "mtn", name: "MTN Money", logo: "/mtn.jpeg" },
        { id: "moov", name: "Moov Money", logo: "/moov.png" },
    ];

    const [isProcessing, setIsProcessing] = useState(false);

    // Totaux
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const total = subtotal;
    const orderItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const askForLocation = async () => {
        try {
            setIsLocLoading(true); // ← loader ON

            const data = await getUserLocation({
                onPermissionDenied: () => {
                    setIsLocLoading(false);
                    setMsg([
                        {
                            id: "geo-001",
                            type: "text",
                            title: "📍 Localisation obligatoire",
                            message:
                                "Notre application nécessite votre localisation pour fonctionner correctement. Veuillez l’activer.",
                            linkText: "Activer la localisation",
                            onClick: () => askForLocation(),
                        },
                    ]);
                },
            });

            // Remplissage de l'objet userLocation
            const userLocation: UserLocation = {
                lat: data.lat,
                lng: data.lng,
                country: data.country ?? null,
                city: data.city ?? null,
                district: data.district ?? null,
                street: data.street ?? null,
            };

            setLocation(userLocation);

            if (!data.error) {
                const readableText = `${userLocation.city ?? "Ville inconnue"} – ${userLocation.street ?? "Rue inconnue"}`;
                setDisplayLocation(readableText);
                setMsg([]);
            } else {
                setMsg([
                    {
                        id: "geo-002",
                        type: "text",
                        title: "📍 Oups une erreur s'est produite",
                        message: "Erreur de réseau, veuillez réessayer.",
                        linkText: "Relancer",
                        onClick: () => askForLocation(),
                    },
                ]);
            }
        } catch (err) {
            setMsg([
                {
                    id: "geo-003",
                    type: "text",
                    title: "🚨 Erreur inattendue",
                    message:
                        "Une erreur est survenue. Vérifiez votre réseau et réessayez.",
                    linkText: "Réessayer",
                    onClick: () => askForLocation(),
                },
            ]);
        } finally {
            setIsLocLoading(false); // ← loader OFF
        }
    };

    // Payer
    const payer = async () => {
        try {
            setIsProcessing(true);

            if (cartItems.length === 0)
                throw new Error("Votre panier est vide");

            if (paymentType === "mobile_money") {
                if (!selectedMobileMoney)
                    throw new Error("Sélectionnez un moyen Mobile Money");

                if (paymentNumber.trim() === "")
                    throw new Error("Veuillez entrer votre numéro Mobile Money");
            }

            alert(
                `Paiement validé via : ${paymentType === "delivery"
                    ? "Paiement à la livraison"
                    : selectedMobileMoney + " - " + paymentNumber
                }`
            );

        } catch (error) {
            alert(`❌ ${error instanceof Error ? error.message : "Erreur inconnue"}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-white relative overflow-hidden">
            <div className="bg-white w-full max-w-md h-screen flex flex-col rounded-3xl overflow-hidden shadow-lg">

                {/* Header */}
                <div className="p-3 border-b border-gray-100">
                    <Link href="/boutique" className="flex items-center">
                        <button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-medium text-sm">Terminer mon achat</span>
                        </button>
                    </Link>
                </div>

                {/* Scroll */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-3 space-y-3">

                        {/* Adresse */}
                        <div className="bg-white rounded-lg shadow-xs p-3 border border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-[#b07b5e]/10 rounded-md">
                                        <MapPin className="w-4 h-4 text-[#b07b5e]" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-gray-900">Adresse de livraison</h2>
                                </div>
                                <button onClick={askForLocation} className="flex items-center gap-1.5 text-[#b07b5e] font-medium text-xs">
                                    <MapPin className="w-4 h-4 text-[#b07b5e]" /> {isLocLoading ? "Détection..." : "Utiliser mon point actuel"}
                                </button>
                            </div>

                            {/* <pre>{JSON.stringify(users, null, 2)}</pre> */}
                            <div className="ml-10">
                                <p className="text-gray-900 font-medium text-sm">{location?.country}</p>
                                <p className="text-gray-600 text-xs">  {location?.city} – {location?.street} – {location?.district}
                                </p>
                            </div>

                        </div>

                        {/* MODE DE PAIEMENT */}
                        <div className="bg-white rounded-lg shadow-xs p-3 border border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-[#b07b5e]/10 rounded-md">
                                    <Package className="w-4 h-4 text-[#b07b5e]" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-900">Mode de paiement</h2>
                            </div>

                            {/* Paiement à la livraison */}
                            <div
                                onClick={() => setPaymentType("delivery")}
                                className={`flex items-center justify-between p-2.5 border rounded-md cursor-pointer mb-2  ${paymentType === "delivery"  ? "border-[#b07b5e] bg-[#b07b5e]/5"  : "border-gray-200"}  `} >
                                <span className="text-sm text-gray-800">Paiement à la livraison</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center 
                                    ${paymentType === "delivery" ? "border-[#b07b5e]" : "border-gray-300"}`}>
                                    {paymentType === "delivery" && <div className="w-2 h-2 bg-[#b07b5e] rounded-full" />}
                                </div>
                            </div>

                            {/* Paiement Mobile Money */}
                            <div
                                onClick={() => setPaymentType("mobile_money")}
                                className={`flex items-center justify-between p-2.5 border rounded-md cursor-pointer 
                                    ${paymentType === "mobile_money"
                                        ? "border-[#b07b5e] bg-[#b07b5e]/5"
                                        : "border-gray-200"}
                                `}
                            >
                                <span className="text-sm text-gray-800">Paiement Mobile Money</span>

                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center 
                                    ${paymentType === "mobile_money" ? "border-[#b07b5e]" : "border-gray-300"}`}>
                                    {paymentType === "mobile_money" && <div className="w-2 h-2 bg-[#b07b5e] rounded-full" />}
                                </div>
                            </div>

                            {/* Liste Mobile Money */}
                            {/* Liste Mobile Money */}
                            {paymentType === "mobile_money" && (
                                <div className="mt-3 space-y-3">

                                    {/* 4 petites cards sur une ligne */}
                                    <div className="flex items-center justify-between gap-2">
                                        {mobileMoneyOptions.map((opt) => {
                                            const active = selectedMobileMoney === opt.id;

                                            return (
                                                <div key={opt.id} onClick={() => setSelectedMobileMoney(opt.id)} className={`flex flex-col items-center p-2 w-full cursor-pointer rounded-lg border transition  ${active ? "border-[#b07b5e] bg-[#b07b5e]/10" : "border-gray-300 hover:border-gray-400"}`}  >
                                                    <Image src={opt.logo} alt={opt.name} width={30} height={30} />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Input en bas, uniquement quand une option est active */}
                                    {selectedMobileMoney && (
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium mb-1">
                                                Numéro Mobile Money
                                            </p>

                                            <input
                                                type="tel"
                                                placeholder="Entrez votre numéro"
                                                value={paymentNumber}
                                                onChange={(e) => setPaymentNumber(e.target.value)}
                                                className="text-sm px-3 py-2 w-full border rounded-md border-gray-300  focus:ring-1 focus:ring-[#b07b5e] outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* Résumé */}
                        <div className="bg-white rounded-lg shadow-xs p-3 border border-gray-200">
                            <h2 className="text-sm font-semibold text-gray-900 mb-3">Résumé</h2>

                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">Sous-total ({orderItems} articles)</span>
                                <span className="text-sm font-medium text-gray-900">{subtotal.toFixed(2)} ₣</span>
                            </div>

                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-sm text-gray-900">Total</span>
                                    <span className="font-bold text-sm text-gray-900">{total.toFixed(2)} ₣</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-[9px] text-gray-500 pt-2 mt-4">
                            <div>Développé par inSeach | Confidentialité</div>
                            <div className="text-gray-400">&copy; 2025 inSeach</div>
                        </div>

                        <div className="h-12"></div>
                    </div>
                </div>

                {/* FOOTER – BOUTON DE PAIEMENT */}
                <div className="border-t border-gray-100 bg-white p-3 sticky bottom-0">
                    <button onClick={payer} disabled={isProcessing || cartItems.length === 0 || (paymentType === "mobile_money" && (!selectedMobileMoney || paymentNumber.trim() === ""))}
                        className={`w-full ${isProcessing || cartItems.length === 0 || (paymentType === "mobile_money" && (!selectedMobileMoney || paymentNumber.trim() === "")) ? "bg-gray-400 cursor-not-allowed" : "bg-[#b07b5e] hover:bg-[#b07b5e]/90"} text-white font-semibold text-sm py-3 px-4 rounded-lg`} >
                        {isProcessing ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                            </div>
                        ) : paymentType === "mobile_money" && selectedMobileMoney ? (`Payer via ${mobileMoneyOptions.find(m => m.id === selectedMobileMoney)?.name}`) : (`Payer ${total.toFixed(2)} ₣`)}
                    </button>
                </div>

            </div>
        </main>
    );

}
