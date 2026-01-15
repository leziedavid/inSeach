"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, Search } from "lucide-react";
import { Spinner } from "@/components/forms/spinner/Loader";
import { useRouter } from 'next/navigation';
import { useAlert } from "@/contexts/AlertContext";
import { login } from "@/services/securityService";
import { Role } from "@/types/interfaces";
import Link from "next/link";

// Schéma de validation pour le numéro de téléphone
const phoneSchema = z.object({
    phone: z.string()
        .min(10, "Le numéro doit contenir 10 caractères")
        .max(10, "Le numéro doit contenir 10 caractères")
        .regex(/^[0-9]+$/, "Le numéro doit contenir uniquement des chiffres"),
});

// Schéma de validation pour le code PIN - maintenant 5 caractères avec @
const pinSchema = z.object({
    pin: z.string()
        .length(5, "Le code PIN doit contenir 5 caractères")
        .regex(/^@[0-9]{4}$/, "Le code PIN doit être @ suivi de 4 chiffres"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type PinFormData = z.infer<typeof pinSchema>;

export default function WelcomeAuth() {

    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [step, setStep] = useState<"phone" | "pin">("phone");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const { showAlert } = useAlert();

    useEffect(() => {
        setIsClient(true);
        // Nettoyer les attributs Chrome si présents
        const cleanupChromeAttributes = () => {
            document.querySelectorAll('[__gchrome_uniqueid]').forEach(element => {
                element.removeAttribute('__gchrome_uniqueid');
            });
        };
        cleanupChromeAttributes();
    }, []);

    const {
        register: registerPhone,
        handleSubmit: handleSubmitPhone,
        formState: { errors: phoneErrors, isSubmitting: phoneSubmitting },
    } = useForm<PhoneFormData>({
        resolver: zodResolver(phoneSchema),
    });

    const {
        register: registerPin,
        handleSubmit: handleSubmitPin,
        setValue: setPinValue,
        formState: { errors: pinErrors, isSubmitting: pinSubmitting }, } = useForm<PinFormData>({
            resolver: zodResolver(pinSchema),
        });

    // Mettre à jour la valeur du PIN quand l'OTP change (@ + les 4 chiffres)
    useEffect(() => {
        const pinValue = "@" + otp.join("");
        setPinValue("pin", pinValue);
    }, [otp, setPinValue]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Passer à l'input suivant si la valeur est saisie
            if (value !== "" && index < 3) {
                otpRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            // Revenir à l'input précédent si backspace et champ vide
            otpRefs.current[index - 1]?.focus();
        }
    };

    const onPhoneSubmit = (data: PhoneFormData) => {
        setPhoneNumber(data.phone);
        setStep("pin");
    };

    const onPinSubmit = async (data: PinFormData) => {

        // Le mot de passe final est déjà "@1234" par exemple
        console.log("Connexion avec:", { phone: phoneNumber, pin: data.pin });
        const res = await login(phoneNumber, data.pin);

        if (res.statusCode === 200) {

            const { access_token, refresh_token, user } = res.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            document.cookie = `token=${access_token}; path=/`;
            showAlert("bienvenue sur inSeach", "success");

            if (user.role === Role.ADMIN) {
                router.push('/dashboard/compte')
                return
            } else {
                router.push('/')
                return
            }


        } else {
            showAlert("Erreur lors de la connexion", "error");
        }

    };

    const handleForgotPin = () => {
        // Logique pour le mot de passe oublié
        console.log("Mot de passe oublié");
    };

    const handleBackToHome = () => {
        setStep("phone");
        setOtp(["", "", "", ""]);
    };

    const handleOpenAccount = () => {
        router.push('/akwaba');
        console.log("Ouvrir mon compte");
    };

    // Si on est côté serveur, on rend un placeholder simple
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 pt-[5%] px-4">
            {/* Logo - format carré */}
            <div className="max-w-sm mx-auto my-8 w-28">
                {/* Logo "inSeach" ultra bold avec icône chapeau (dégradé #b07b5e → #155e75) */}
                <div className="relative flex items-center mt-8 animate-slide-up ">
                    <Search className="absolute -top-6 left-3 w-8 h-8 text-[#b07b5e] animate-pulse" />
                    <h1 className="  text-transparent bg-clip-text bg-gradient-to-r from-[#b07b5e] to-[#155e75]  font-black text-4xl tracking-tight select-none drop-shadow-sm  ">
                        inSeach
                    </h1>
                </div>
            </div>

            {/* Carte d'authentification */}
            <div className="rounded-xl border-slate-200 bg-white text-slate-950 mx-auto max-w-sm border-0 shadow-none shadow-slate-400/20">
                <div className="py-2"></div>

                <div style={{ opacity: 1 }}>
                    <div className="p-6 pt-0">
                        {step === "phone" ? (
                            // Étape 1 : Numéro de téléphone
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        Bienvenue 👋
                                    </h1>
                                    <p className="text-sm text-slate-700 mt-1"> Saisissez votre numéro de téléphone </p>
                                </div>

                                <form onSubmit={handleSubmitPhone(onPhoneSubmit)} className="space-y-6">
                                    <div className="space-y-2">
                                        <input
                                            type="tel"
                                            {...registerPhone("phone")}
                                            placeholder="Ex: 01 53 68 68 19"
                                            className="flex px-3 py-1 w-full h-11 text-sm rounded-lg shadow-none transition-colors bg-slate-100 text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b07b5e] disabled:cursor-not-allowed disabled:opacity-50"
                                            inputMode="numeric"
                                            style={{ fontSize: '16px' }}
                                        />
                                        {phoneErrors.phone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {phoneErrors.phone.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            disabled={phoneSubmitting}
                                            className="items-center justify-center whitespace-nowrap rounded-lg text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-50 h-11 px-4 py-4 flex flex-1 bg-[#b07b5e] shadow-none hover:bg-[#a06a50] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {phoneSubmitting ? "Vérification..." : "Continuer"}
                                        </button>
                                    </div>
                                </form>

                                {/* Liens additionnels */}
                                <div className="space-y-3 text-center">
                                    <Link
                                        href="/"
                                        className="text-sm text-[#b07b5e] hover:text-[#a06a50] hover:underline block"
                                    >
                                        Retour à l'accueil
                                    </Link>

                                    <button
                                        onClick={handleOpenAccount}
                                        className="text-xs text-[#b07b5e] hover:text-[#a06a50]"
                                    >
                                        Ouvrir mon compte
                                    </button>
                                </div>

                                {/* Footer avec liens légaux */}
                                <div className="flex justify-center pt-2">
                                    <span className="flex items-center text-[#b07b5e]">
                                        <span className="mr-1 text-xs text-slate-600">
                                            Développé par inSeach |
                                        </span>
                                        <Link
                                            className="text-xs text-[#b07b5e] mr-1 hover:underline"
                                            href="/docs/terms-of-use"
                                        >
                                            CGU
                                        </Link>
                                        <span className="text-xs text-slate-600 mr-1">
                                            |
                                        </span>
                                        <Link
                                            className="text-xs text-[#b07b5e] hover:underline"
                                            href="/docs/privacy-policy"
                                        >
                                            Confidentialité
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        ) : (
                            // Étape 2 : Code PIN
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-800">
                                        Code de sécurité
                                    </h1>
                                    <p className="text-sm text-slate-700 mt-1">
                                        Veuillez entrer votre code pin
                                    </p>
                                </div>

                                <form onSubmit={handleSubmitPin(onPinSubmit)} className="space-y-6">
                                    <div className="space-y-2">
                                        {/* Champ OTP */}
                                        <div className="flex flex-col items-center">
                                            {/* Ligne unique avec @, PIN inputs et l'icône œil */}
                                            <div className="flex items-center justify-center space-x-2 mb-3">
                                                {/* Première case grise avec @ fixe */}
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-slate-600 font-semibold text-sm">@</span>
                                                </div>

                                                {/* 4 cases pour le code PIN */}
                                                {[0, 1, 2, 3].map((index) => (
                                                    <input  key={index} ref={(el) => { otpRefs.current[index] = el; }}  type={showPassword ? "text" : "password"}  value={otp[index]}  onChange={(e) => handleOtpChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                        className="w-12 h-12 text-center text-sm bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b07b5e]"
                                                        inputMode="numeric"
                                                        maxLength={1}
                                                        style={{ fontSize: '16px' }}
                                                    />
                                                ))}

                                                {/* Icône œil alignée sur la même ligne */}
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 text-[#b07b5e] hover:text-[#a06a50]" >
                                                    {showPassword ? (
                                                        <EyeOff className="w-5 h-5" />
                                                    ) : (
                                                        <Eye className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Champ caché pour react-hook-form */}
                                            <input type="hidden" {...registerPin("pin")} />

                                            {/* Message d'erreur */}
                                            {pinErrors.pin && (
                                                <p className="text-red-500 text-xs mt-1 text-center">
                                                    {pinErrors.pin.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button type="submit"  disabled={pinSubmitting}   className="items-center justify-center whitespace-nowrap rounded-lg text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-50 h-11 px-4 py-4 flex flex-1 bg-[#b07b5e] shadow-none hover:bg-[#a06a50] disabled:opacity-50 disabled:cursor-not-allowed"  >
                                            {pinSubmitting ? "Connexion..." : "Me connecter"}
                                        </button>
                                    </div>
                                </form>

                                {/* Liens additionnels pour l'étape PIN */}
                                <div className="space-y-3 text-center">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                                        <button  onClick={handleForgotPin}  className="text-[#b07b5e] hover:text-[#a06a50] transition-colors"  >
                                            J'ai oublié mon code pin
                                        </button>
                                        <button  onClick={handleBackToHome}  className="flex items-center justify-center text-[#b07b5e] hover:text-[#a06a50] transition-colors" >
                                            <ArrowLeft className="w-3 h-3 mr-1" />
                                            Retour
                                        </button>
                                    </div>

                                    <button  onClick={handleOpenAccount}  className="text-xs text-[#b07b5e] hover:text-[#a06a50]" >
                                        Ouvrir mon compte
                                    </button>
                                </div>

                                {/* Footer avec liens légaux */}
                                <div className="flex justify-center pt-2">
                                    <span className="flex items-center text-[#b07b5e]">
                                        <span className="mr-1 text-xs text-slate-600">
                                            Développé par inSeach |
                                        </span>
                                        <Link
                                            className="text-xs text-[#b07b5e] mr-1 hover:underline"
                                            href="/docs/terms-of-use"
                                        >
                                            CGU
                                        </Link>
                                        <span className="text-xs text-slate-600 mr-1">
                                            |
                                        </span>
                                        <Link
                                            className="text-xs text-[#b07b5e] hover:underline"
                                            href="/docs/privacy-policy"
                                        >
                                            Confidentialité
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-sm mx-auto mt-6 text-center">
                <p className="text-xs text-slate-500">
                    &copy; 2025 inSeach. Tous droits réservés.
                </p>
            </div>
        </div>
    );
}