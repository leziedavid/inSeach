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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

            {/* Logo "inSeach" ultra bold avec icône chapeau (dégradé #b07b5e → #155e75) */}

            <div className="relative flex items-center mt-8 animate-slide-up ">
                <Search className="absolute -top-6 left-3 w-8 h-8 text-[#b07b5e] animate-pulse" />
                <h1 className="  text-transparent bg-clip-text bg-gradient-to-r from-[#b07b5e] to-[#155e75]  font-black text-4xl tracking-tight select-none drop-shadow-sm  ">
                    inSeach
                </h1>
            </div>

            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-4 sm:p-6 mx-auto mt-3">

                {step === "phone" ? (
                    // Étape 1 : Numéro de téléphone
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Bienvenue 👋
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                Saisissez votre numéro de téléphone
                            </p>
                        </div>

                        <form onSubmit={handleSubmitPhone(onPhoneSubmit)} className="space-y-3 sm:space-y-4">
                            <div className="relative">
                                <input
                                    type="tel"
                                    {...registerPhone("phone")}
                                    placeholder="01 53 68 6819"
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b07b5e] focus:border-transparent outline-none"
                                    inputMode="numeric"
                                    style={{ fontSize: '16px' }}
                                />
                                {phoneErrors.phone && (
                                    <p className="text-red-500 text-xs mt-1 text-center">
                                        {phoneErrors.phone.message}
                                    </p>
                                )}
                            </div>

                            <button type="submit" disabled={phoneSubmitting} className="w-full bg-[#b07b5e] text-white py-2 px-4 rounded-lg  hover:bg-[#155e75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm" >
                                {phoneSubmitting ? "Vérification..." : "Continuer"}
                            </button>
                        </form>

                        {/* Lien ouvrir mon compte */}
                        <button onClick={handleOpenAccount} className="w-full text-xs text-[#b07b5e] hover:text-[#a06a50]" >
                            Ouvrir mon compte
                        </button>

                        {/* Footer petit */}
                        <div className="text-center text-[9px] sm:text-[10px] text-gray-500 space-y-0.5 pt-2">
                            <div>Developpé par inSeach | Confidentialité</div>
                            <div className="text-gray-400">
                                &copy; 2025 inSeach. Tous droits réservés.
                            </div>
                        </div>
                    </div>
                ) : (
                    // Étape 2 : Code PIN
                    <div className="text-center space-y-3 sm:space-y-4">
                        <div>
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                                Code de sécurité
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                Veuillez entrer votre code pin de la cabine
                            </p>
                        </div>

                        <form onSubmit={handleSubmitPin(onPinSubmit)} className="space-y-3 sm:space-y-4">
                            <div className="relative flex flex-col items-center">
                                {/* Ligne unique avec @, PIN inputs et l'icône œil */}
                                <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                                    {/* Première case grise avec @ fixe */}
                                    <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-600 font-semibold text-xs sm:text-sm">@</span>
                                    </div>

                                    {/* 4 cases pour le code PIN */}
                                    {[0, 1, 2, 3].map((index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                otpRefs.current[index] = el;
                                            }}
                                            type={showPassword ? "text" : "password"}
                                            value={otp[index]}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-12 sm:w-10 sm:h-10 text-center text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b07b5e] focus:border-transparent outline-none"
                                            inputMode="numeric"
                                            maxLength={1}
                                            style={{ fontSize: '16px' }}

                                        />
                                    ))}

                                    {/* Icône œil alignée sur la même ligne */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="ml-1 sm:ml-2 text-[#b07b5e] hover:text-[#a06a50] flex items-center gap-1 text-xs"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-6 h-6 sm:w-4 sm:h-4" />
                                        ) : (
                                            <Eye className="w-6 h-6 sm:w-4 sm:h-4" />
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

                            {/* Bouton de soumission */}
                            <button type="submit" disabled={pinSubmitting} className="w-full bg-[#b07b5e] text-white py-2 px-4 rounded-lg hover:bg-[#155e75] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm" >
                                {pinSubmitting ? "Connexion..." : "Me connecter"}
                            </button>
                        </form>

                        <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                            <button onClick={handleForgotPin} className="text-[#b07b5e] hover:text-[#a06a50] transition-colors text-left" >
                                J'ai oublié mon code pin
                            </button>
                            <button onClick={handleBackToHome} className="flex items-center text-[#b07b5e] hover:text-[#a06a50] transition-colors" >
                                <ArrowLeft className="w-3 h-3 mr-1" />
                                Revenir à l'accueil
                            </button>
                        </div>

                        {/* Lien ouvrir mon compte */}
                        <button onClick={handleOpenAccount} className="w-full text-xs text-[#b07b5e] hover:text-[#a06a50]">
                            Ouvrir mon compte
                        </button>

                        {/* Footer petit */}
                        <div className="text-center text-[9px] sm:text-[10px] text-gray-500 space-y-0.5 pt-2">
                            <div>Developpé par inSeach | Confidentialité</div>
                            <div className="text-gray-400">
                                &copy; 2025 inSeach. Tous droits réservés.
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}