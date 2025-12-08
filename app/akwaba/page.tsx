"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff, MapPin, Search } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AccountType, Role, ServiceCategory, ServiceSubcategory, ServiceType, UserLocation } from "@/types/interfaces";
import MultiSelect from "@/components/forms/MultiSelect";
import { Spinner } from "@/components/forms/spinner/Loader";
import Link from "next/link";
import { GeoLocationResult, getUserLocation } from "@/utils/geolocation";
import { MessagesData } from "@/components/page/Messages";
import { Loading } from "@/components/forms/spinner/Loading";
import { listCategories, listSubcategories } from "@/services/categoryService";
import { register } from "@/services/securityService";

// ===============================
// SCHÉMAS DE VALIDATION ZOD
// ===============================
const step0Schema = z.object({
    phone: z.string().min(1, "Le numéro de téléphone est requis"),
    accountType: z.nativeEnum(AccountType),
    companyName: z.string().min(1, "Le nom de l'entreprise est requis").optional(),
});

const step1Schema = z.object({
    location: z.object({
        lat: z.number().nullable().optional(),
        lng: z.number().nullable().optional(),
        country: z.string() .min(1, "Le pays est requis"),
        city: z.string().nullable().optional(),
        district: z.string().nullable().optional(),
        street: z.string().nullable().optional(),
    })
});


const step3Schema = z.object({
    serviceCategories: z.array(z.string()).min(1, "Au moins une catégorie est requise"),
    serviceSubcategories: z.array(z.string()).min(1, "Au moins une sous-catégorie est requise"),
});

const step4Schema = z.object({
    password: z.string().length(4, "Le mot de passe doit être composé de 4 chiffres").regex(/^\d+$/, "Le mot de passe doit être composé de chiffres"),
});

// ===============================
// TYPES ET DONNÉES
// ===============================
type FormData = {
    phone: string;
    companyName: string;
    location: string;
    accountType: AccountType;
    roles: Role;
    serviceCategories: string[];
    serviceSubcategories: string[];
    password: string;
};

type ValidationErrors = Partial<Record<keyof FormData, string>>;

const serviceCategoriesFake: ServiceCategory[] = [
    { id: "cat1", name: "Construction", description: "Bâtiments, routes...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat2", name: "Informatique", description: "Tech, logiciels...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "cat3", name: "Santé", description: "Soins, services médicaux...", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const serviceSubcategoriesFake: ServiceSubcategory[] = [
    { id: "sub1", name: "Maçonnerie", description: "Travaux de construction", categoryId: "cat1", serviceType: [ServiceType.MIXED], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "sub2", name: "Plomberie", description: "Installation et maintenance", categoryId: "cat1", serviceType: [ServiceType.MIXED], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "sub3", name: "Développement Web", description: "Sites, apps", categoryId: "cat2", serviceType: [ServiceType.MIXED], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "sub4", name: "Réseaux", description: "Administration réseaux", categoryId: "cat2", serviceType: [ServiceType.MIXED], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "sub5", name: "Infirmier", description: "Soins à domicile", categoryId: "cat3", serviceType: [ServiceType.MIXED], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: "sub6", name: "Pharmacien", description: "Distribution de médicaments", categoryId: "cat3", serviceType: [ServiceType.MIXED], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// ===============================
// COMPOSANTS
// ===============================export
export const LogoInSeach = () => (
    <div className="flex justify-center items-center mb-3 sm:mb-4">
        <div className="relative flex items-center">
            <Search className="absolute -top-6 left-3 w-7 h-7 sm:w-8 sm:h-8 text-[#b07b5e] animate-pulse" />
            <h1 className="  text-transparent bg-clip-text bg-gradient-to-r from-[#b07b5e] to-[#155e75]  font-black text-4xl tracking-tight select-none drop-shadow-sm  ">
                inSeach
            </h1>
        </div>
    </div>
);

// Composant Input sécurisé pour éviter les erreurs d'hydratation

const SecureInput = ({ type = "text", value, onChange, placeholder, className = "", inputMode = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    const displayValue = mounted ? value : "";
    return (
        <input
            type={type}
            value={displayValue}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            inputMode={inputMode}
            {...props}
        />
    );
};

// ===============================
// COMPOSANT PRINCIPAL
// ===============================
export default function FomsUser() {

    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [mounted, setMounted] = useState(false);

    const [location, setLocation] = useState<GeoLocationResult | null>(null);
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");
    const [msg, setMsg] = useState<MessagesData[]>([]);

    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [serviceSubcategories, setServiceSubcategories] = useState<ServiceSubcategory[]>([]);

    const askForLocation = async () => {
        try {
            setIsLocLoading(true);

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

            const formatted: UserLocation = {
                lat: data.lat ?? null,
                lng: data.lng ?? null,
                country: data.country ?? null,
                city: data.city ?? null,
                district: data.district ?? null,
                street: data.street ?? null,
            };
            setLocation(formatted);
            if (!data.error) {
                setDisplayLocation(`${data.city} – ${data.street}`);
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
                    message: "Une erreur est survenue. Vérifiez votre réseau et réessayez.",
                    linkText: "Réessayer",
                    onClick: () => askForLocation(),
                },
            ]);
        } finally {
            setIsLocLoading(false);
        }
    };

    const [formData, setFormData] = useState<FormData>({
        phone: "",
        companyName: "",
        location: "",
        accountType: AccountType.INDIVIDUAL,
        roles: Role.CLIENT,
        serviceCategories: [],
        serviceSubcategories: [],
        password: "",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // nous allon.  crée les api pour aller checehr les categorie et sous categorie

    const geServiceCategories = async () => {
        const response = await listCategories();
        if (response.statusCode == 200) {
            setServiceCategories(response.data);
            console.log("data", response.data);
        } else {
            console.log("error", response.message);
        }
    };

    const getServiceSubcategories = async () => {
        const response = await listSubcategories();
        if (response.statusCode == 200) {
            setServiceSubcategories(response.data);
            console.log("data", response.data);
        } else {
            console.log("error", response.message);
        }
    };

    useEffect(() => {
        geServiceCategories();
        getServiceSubcategories();
    }, []);

    // ===============================
    // CALCULS ET MÉMOISATION
    // ===============================
    const filteredSubcategories = useMemo(() => serviceSubcategories.filter((sub) => formData.serviceCategories.includes(sub.categoryId)), [formData.serviceCategories]);

    const stepsTotal = formData.accountType === AccountType.INDIVIDUAL ? 3 : 4;
    const isIndividualAccount = formData.accountType === AccountType.INDIVIDUAL;

    // ===============================
    // VALIDATION AVEC ZOD
    // ===============================
    const validateStep = (currentStep: number): boolean => {
        setValidationErrors({});

        try {
            switch (currentStep) {
                case 0:
                    step0Schema.parse(formData);
                    break;
                case 1:
                    step1Schema.parse({ location });
                    break;
                case 2:
                    if (!isIndividualAccount) {
                        step3Schema.parse(formData);
                    }
                    break;
                case 3:
                    step4Schema.parse(formData);
                    break;
            }
            return true;

        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: ValidationErrors = {};
                error.issues.forEach((issue) => {
                    const path = issue.path[0] as keyof FormData;
                    errors[path] = issue.message;
                });
                setValidationErrors(errors);
            }
            return false;
        }
    };

    // ===============================
    // GESTIONNAIRES D'ÉVÉNEMENTS
    // ===============================
    const next = () => {

        if (!validateStep(step)) return;

        // Logique de saut d'étape pour les comptes individuels
        if (isIndividualAccount && step === 1 || formData.accountType === AccountType.SELLER && step === 1) {
            setStep(3); // Passe directement à l'étape du mot de passe (étape 3 devient 2 dans le nouveau comptage)
            return;
        }

        if (step < stepsTotal - 1) {
            setStep((s) => s + 1);
        } else {
            handleSubmit();
        }
    };

    const prev = () => {
        // Logique de navigation arrière spéciale pour les comptes individuels
        if (isIndividualAccount && step === 3 || formData.accountType === AccountType.SELLER && step === 3) { // Étape mot de passe pour individuels
            setStep(1); // Retour direct à l'étape 1 (zone géographique)
            return;
        }
        setStep((s) => Math.max(0, s - 1));
    };

    const handleAccountTypeChange = (type: AccountType) => {
        let newRole: Role;

        if (type === AccountType.INDIVIDUAL) {
            newRole = Role.CLIENT;
        } else if (type === AccountType.SELLER) {
            newRole = Role.SELLER;
        } else {
            newRole = Role.PROVIDER;
        }

        setFormData((prev) => ({
            ...prev,
            accountType: type,
            roles: newRole,
            ...(type === AccountType.INDIVIDUAL && {
                serviceCategories: [],
                serviceSubcategories: [],
            }),
        }));

        setValidationErrors({});
    };

    const handleCategorySelect = (selected: string | string[]) => {
        const ids = Array.isArray(selected) ? selected : [selected];

        setFormData((prev) => {
            const allowedSubIds = serviceSubcategories
                .filter((s) => ids.includes(s.categoryId))
                .map((s) => s.id);

            const newSubcats = prev.serviceSubcategories.filter((subId) =>
                allowedSubIds.includes(subId)
            );

            return {
                ...prev,
                serviceCategories: ids,
                serviceSubcategories: newSubcats,
            };
        });
    };

    const handleSubcategorySelect = (selected: string | string[]) => {
        const ids = Array.isArray(selected) ? selected : [selected];
        setFormData((prev) => ({ ...prev, serviceSubcategories: ids }));
    };

    const handlePasswordInput = (index: number, value: string) => {
        const val = value.replace(/[^0-9]/g, "").slice(0, 1);
        const passArr = formData.password.split("");
        passArr[index] = val;
        const newPass = passArr.join("").padEnd(4, "");

        setFormData((p) => ({ ...p, password: newPass }));

        if (val && index < 3) {
            setTimeout(() => {
                const nextInput = document.getElementById(`pin-${index + 1}`);
                (nextInput as HTMLInputElement)?.focus();
            }, 0);
        }
    };

    const handlePasswordBackspace = (index: number) => {

        if (!formData.password[index] && index > 0) {
            setTimeout(() => {
                const prevInput = document.getElementById(`pin-${index - 1}`);
                (prevInput as HTMLInputElement)?.focus();
            }, 0);
        }

        const passArr = formData.password.split("");
        passArr[index] = "";
        setFormData((p) => ({ ...p, password: passArr.join("").padEnd(4, "") }));
    };

    const handleSubmit = async () => {

        try {
            // Si le mot de passe ne commence pas déjà par "@", on l'ajoute
            const passwordWithAt = formData.password.startsWith("@") ? formData.password : `@${formData.password}`;
            const finalData = { ...formData, password: passwordWithAt };
            console.log("Données soumises:", finalData);

            const payload = {
                ...finalData,
                location: location ?? null, // ✔ envoi direct de la géo
            };
            console.log("Données soumises:", payload);

            const res = await register(payload);
            if (res.statusCode === 201) {
                setMsg([
                    {
                        id: "reg-001",
                        type: "text",
                        title: "✅ Inscription réussie",
                        message: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
                        linkText: "Aller à la connexion",
                        onClick: () => { /** redirection vers la page de connexion */ },
                    },
                ]);
            } else {
                setMsg([
                    {
                        id: "reg-002",
                        type: "text",
                        title: "🚨 Erreur d'inscription",
                        message: res.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
                        linkText: "Réessayer",
                        onClick: () => { /** rester sur la page pour corriger */ },
                    },
                ]);
            }

            // success…
        } catch (err) {
            console.error(err);
        }
    };

    // ===============================
    // RENDU DES ÉTAPES
    // ===============================

    if (!mounted) {
        // Pendant l'hydratation, rendre des champs vides
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <Spinner />
            </div>
        );
    }


    const renderStep = () => {

        switch (step) {
            case 0:
                return (
                    <div className="space-y-5">

                        <div>
                            <label className="block font-semibold mb-2">Numéro de téléphone</label>
                            <SecureInput
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="Saisissez le numéro de téléphone"
                                className="w-full px-3 py-2 text-sm sm:text-base bg-transparent border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b07b5e] focus:border-transparent outline-none"
                                style={{ fontSize: '16px' }}
                                inputMode="tel"
                            />
                            {validationErrors.phone && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Nom de l'entreprise</label>
                            <SecureInput
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                                placeholder="Saisissez le nom de l'entreprise"
                                className="w-full px-3 py-2 text-sm sm:text-base bg-transparent border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b07b5e] focus:border-transparent outline-none"
                                style={{ fontSize: '16px' }}
                                inputMode="text" />
                            {validationErrors.companyName && (
                                <p className="text-red-500 text-sm mt-1">{validationErrors.companyName}</p>
                            )}
                        </div>


                        <div>
                            <label className="block font-semibold mb-2">Type de compte</label>
                            <MultiSelect
                                data={[
                                    { id: AccountType.INDIVIDUAL, label: "Particulier" },
                                    { id: AccountType.ENTERPRISE, label: "Entreprise" },
                                    { id: AccountType.SELLER, label: "Vendeur" },
                                ]}
                                multiple={false} onSelect={(sel) => handleAccountTypeChange(sel as AccountType)} placeholder="Sélectionner un type de compte" />
                            {validationErrors.accountType && (<p className="text-red-500 text-sm mt-1">{validationErrors.accountType}</p>)}
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-2">
                        <pre>{JSON.stringify(step, null, 2)}</pre>

                        <label className="block font-semibold">Localisation</label>
                        <p className="text-[10px] sm:text-[13px] text-gray-500 space-y-0.5 pt-2">Localiser votre position en cliquant sur le bouton avec le drapeau (pas besoin de saisir)</p>
                        <div className="flex flex-col gap-2">
                            <button type="button"
                                onClick={askForLocation}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition">
                                <MapPin className="w-4 h-4 text-[#b07b5e]" />
                                {isLocLoading ? "Détection..." : "Utiliser mon point actuel"}
                            </button>

                            {/* Affichage position ou loader */}
                            <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">

                                {isLocLoading ? (
                                    <Loading />
                                ) : (
                                    <>
                                        <span className="text-[#b07b5e]">📍</span>
                                        {displayLocation}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                );

            case 2:
                if (isIndividualAccount || formData.accountType === AccountType.SELLER) {
                    // Étape mot de passe pour les comptes individuels
                    return (
                        <div className="space-y-4">
                            <label className="block font-semibold">Mot de passe à 4 chiffres</label>

                            <div className={`flex items-center justify-center gap-3 transition-all duration-200 ${validationErrors.password ? "animate-shake" : ""}`}>
                                <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-600 font-semibold text-xs sm:text-sm">@</span>
                                </div>
                                {[0, 1, 2, 3].map((i) => (
                                    <SecureInput
                                        key={i}
                                        id={`pin-${i}`}
                                        type={showPassword ? "text" : "password"}
                                        maxLength={1}
                                        inputMode="numeric"
                                        value={formData.password[i] || ""}
                                        onChange={(e) => handlePasswordInput(i, e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Backspace") { handlePasswordBackspace(i); } }}
                                        className={`w-12 h-12 text-center text-xl font-semibold border rounded-xl outline-none transition-all duration-150  ${validationErrors.password ? "border-red-500 bg-red-50 text-red-700" : "border-gray-300 focus:ring-1 focus:ring-[#b07b5e] focus:border-transparent"}`}
                                        style={{ fontSize: '16px' }}
                                    />
                                ))}

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-label={showPassword ? "Cacher le code" : "Afficher le code"}
                                    className="ml-2 text-[#b07b5e] hover:text-[#155e75] flex items-center justify-center" >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {validationErrors.password && (
                                <p className="text-red-500 text-sm text-center animate-fade-in">
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>
                    );
                }
                // Étape catégories pour les autres types de compte
                return (
                    <div className="space-y-4">
                        <label className="block font-semibold">Catégories de services</label>
                        <MultiSelect
                            data={serviceCategories.map((c) => ({ id: c.id, label: c.name }))}
                            multiple
                            onSelect={(sel) => handleCategorySelect(sel)}
                            placeholder="Sélectionner une ou plusieurs catégories"
                        />
                        {validationErrors.serviceCategories && (
                            <p className="text-red-500 text-sm">{validationErrors.serviceCategories}</p>
                        )}

                        <div>
                            <label className="block font-semibold mt-4">Sous-catégories disponibles</label>
                            <MultiSelect
                                data={filteredSubcategories.map((s) => ({ id: s.id, label: s.name }))}
                                multiple
                                onSelect={(sel) => handleSubcategorySelect(sel)}
                                placeholder={filteredSubcategories.length ? "Choisir les sous-catégories" : "Aucune sous-catégorie"}
                            />
                            {validationErrors.serviceSubcategories && (
                                <p className="text-red-500 text-sm">{validationErrors.serviceSubcategories}</p>
                            )}

                            {formData.serviceSubcategories.length > 0 && (
                                <p className="mt-2 text-xs text-gray-600">
                                    Sélection : {formData.serviceSubcategories.length} sous-catégorie(s)
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 3:
                // Étape mot de passe pour les autres types de compte
                return (
                    <div className="space-y-4">
                        <label className="block font-semibold">Mot de passe à 4 chiffres</label>

                        <div className={`flex items-center justify-center gap-3 transition-all duration-200 ${validationErrors.password ? "animate-shake" : ""}`}>
                            <div className="w-12 h-12 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span className="text-gray-600 font-semibold text-xs sm:text-sm">@</span>
                            </div>
                            {[0, 1, 2, 3].map((i) => (
                                <SecureInput
                                    key={i}
                                    id={`pin-${i}`}
                                    type={showPassword ? "text" : "password"}
                                    maxLength={1}
                                    inputMode="numeric"
                                    value={formData.password[i] || ""}
                                    onChange={(e) => handlePasswordInput(i, e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Backspace") { handlePasswordBackspace(i); } }}
                                    className={`w-12 h-12 text-center text-xl font-semibold border rounded-xl outline-none transition-all duration-150 ${validationErrors.password ? "border-red-500 bg-red-50 text-red-700" : "border-gray-300 focus:ring-1 focus:ring-[#b07b5e] focus:border-transparent"}`}
                                />
                            ))}

                            <button type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? "Cacher le code" : "Afficher le code"}
                                className="ml-2 text-[#b07b5e] hover:text-[#155e75] flex items-center justify-center" >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {validationErrors.password && (
                            <p className="text-red-500 text-sm text-center animate-fade-in">
                                {validationErrors.password}
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    // ===============================
    // RENDU GLOBAL
    // ===============================
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <LogoInSeach />

            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-4 sm:p-6 mx-auto">
                {step > 0 && (
                    <button onClick={prev} className="-top-10 left-0 flex items-center gap-1 text-[#b07b5e] hover:text-[#155e75] transition mb-4" >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Retour</span>
                    </button>
                )}

                {renderStep()}

                <Button onClick={next} className="mt-6 w-full bg-[#b07b5e] hover:bg-[#155e75] text-white font-bold py-3 rounded-xl"  >
                    {step === stepsTotal - 1 ? "Valider" : "Continuer"}
                </Button>

            </div>

            <div className="mt-4 flex gap-2">
                {Array.from({ length: stepsTotal }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i === step ? "bg-[#155e75]" : "bg-gray-300"}`} />
                ))}
            </div>


            {/* retour a la page d'accueil */}
            <Link href="/welcome" className="text-sm text-[#b07b5e] hover:underline mt-8" >
                Retour à l'accueil
            </Link>
            {/* Footer petit */}
            <div className="text-center text-[9px] sm:text-[10px] text-gray-500 space-y-0.5 pt-2 mt-8">
                <div>Developpé par inSeach | Confidentialité</div>
                <div className="text-gray-400">
                    &copy; 2025 inSeach. Tous droits réservés.
                </div>
            </div>

        </div>
    );
}