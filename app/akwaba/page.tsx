"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { ArrowLeft, Eye, EyeOff, MapPin, Search, ChevronDown } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AccountType, Role, ServiceCategory, ServiceSubcategory, ServiceType, UserLocation } from "@/types/interfaces";
import MultiSelect from "@/components/forms/MultiSelect";
import { Spinner } from "@/components/forms/spinner/Loader";
import Link from "next/link";
import { GeoLocationResult, getUserLocation } from "@/utils/geolocation";
import { Loading } from "@/components/forms/spinner/Loading";
import { listCategories, listSubcategories } from "@/services/categoryService";
import { register } from "@/services/securityService";
import { useRouter } from "next/navigation";
import { MessagesData } from "@/components/home/Messages";
import { useAlert } from "@/contexts/AlertContext";

// ===============================
// SCHÉMAS DE VALIDATION ZOD
// ===============================
const step0Schema = z.object({
    phone: z.string()
        .min(10, "Le numéro doit contenir 10 caractères")
        .max(10, "Le numéro doit contenir 10 caractères")
        .regex(/^[0-9]+$/, "Le numéro doit contenir uniquement des chiffres"),
    accountType: z.nativeEnum(AccountType),
    companyName: z.string().min(1, "Le nom de l'entreprise est requis").optional(),
});

const step1Schema = z.object({
    location: z.object({
        lat: z.number().nullable().optional(),
        lng: z.number().nullable().optional(),
        country: z.string().min(1, "Le pays est requis"),
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
    password: z.string()
        .length(4, "Le mot de passe doit être composé de 4 chiffres")
        .regex(/^\d+$/, "Le mot de passe doit être composé de chiffres"),
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

// Liste plus longue de types de compte (exemple)
const accountTypes = [
    { id: AccountType.INDIVIDUAL, label: "Particulier/Client" },
    { id: AccountType.ENTERPRISE, label: "Entreprise/Prestataire" },
    { id: AccountType.SELLER, label: "Vendeur/Commerçant" },
    // { id: "FREELANCER" as AccountType, label: "Freelance/Indépendant" },
    // { id: "ASSOCIATION" as AccountType, label: "Association/ONG" },
    // { id: "PUBLIC" as AccountType, label: "Service Public" },
    // { id: "EDUCATION" as AccountType, label: "Éducation/Formation" },
    // { id: "HEALTH" as AccountType, label: "Santé/Médical" },
    // { id: "TRANSPORT" as AccountType, label: "Transport/Logistique" },
    // { id: "RETAIL" as AccountType, label: "Commerce de détail" },
    // { id: "WHOLESALE" as AccountType, label: "Grossiste" },
    // { id: "MANUFACTURER" as AccountType, label: "Fabricant/Industriel" },
];

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
// ===============================
export const LogoInSeach = () => (
    <div className="max-w-sm mx-auto my-8 w-28">
        {/* Logo "inSeach" ultra bold avec icône chapeau (dégradé #b07b5e → #155e75) */}
        <div className="relative flex items-center mt-8 animate-slide-up ">
            <Search className="absolute -top-6 left-3 w-8 h-8 text-[#b07b5e] animate-pulse" />
            <h1 className="  text-transparent bg-clip-text bg-gradient-to-r from-[#b07b5e] to-[#155e75]  font-black text-4xl tracking-tight select-none drop-shadow-sm  ">
                inSeach
            </h1>
        </div>
    </div>
);

// Composant Input sécurisé pour éviter les erreurs d'hydratation
const SecureInput = ({ type = "text", value, onChange, placeholder, className = "", inputMode = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
    
    const [mounted, setMounted] = useState(false);
    useEffect(() => {  setMounted(true);}, []);

    const displayValue = mounted ? value : "";

    return (
        <input  type={type} value={displayValue} onChange={onChange} placeholder={placeholder}
            className={`flex px-3 py-1 w-full h-11 text-sm rounded-lg shadow-none transition-colors bg-slate-100 text-slate-700 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b07b5e] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            inputMode={inputMode}  style={{ fontSize: '16px' }}  {...props} />
    );
};

// Composant Select personnalisé
interface CustomSelectProps {
    value: string;
    onChange: (value: AccountType) => void;
    options: { id: AccountType; label: string }[];
    placeholder?: string;
    error?: string;
}

const CustomSelect = ({ value, onChange, options, placeholder = "Sélectionner...", error }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const selectRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    // Fermer le select quand on clique en dehors
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filtrer les options selon la recherche
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative" ref={selectRef}>
            <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between w-full h-11 px-3 text-sm rounded-lg shadow-none transition-colors bg-slate-100 text-slate-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b07b5e] ${error ? 'ring-1 ring-red-500' : ''}`} >
                <span className={selectedOption ? "text-slate-800" : "text-slate-500"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
                    {/* Barre de recherche pour les listes longues */}
                    <div className="p-2 border-b border-slate-100">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full px-3 py-2 text-sm bg-slate-50 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#b07b5e]" onClick={(e) => e.stopPropagation()} />
                    </div>

                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button key={option.id} type="button" onClick={() => { onChange(option.id); setIsOpen(false); setSearch(""); }}
                                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 transition-colors ${option.id === value ? 'bg-[#b07b5e] text-white hover:bg-[#a06a50]' : 'text-slate-700'}`} >
                                    {option.label}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-slate-500 text-center">
                                Aucun résultat
                            </div>
                        )}
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
};

// ===============================
// COMPOSANT PRINCIPAL
// ===============================
export default function FormsUser() {

    const router = useRouter();
    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [mounted, setMounted] = useState(false);

    const [location, setLocation] = useState<GeoLocationResult | null>(null);
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");
    const [msg, setMsg] = useState<MessagesData[]>([]);
    const [loader, setLoader] = useState(false);

    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [serviceSubcategories, setServiceSubcategories] = useState<ServiceSubcategory[]>([]);
    const { showAlert } = useAlert();

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
                            message: "Notre application nécessite votre localisation pour fonctionner correctement. Veuillez l'activer.",
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

    useEffect(() => {  setMounted(true);}, []);

    // Récupérer les catégories et sous-catégories
    const geServiceCategories = async () => {
        const response = await listCategories();
        if (response.statusCode == 200) {
            setServiceCategories(response.data);
        } else {
            console.log("error", response.message);
        }
    };

    const getServiceSubcategories = async () => {
        const response = await listSubcategories();
        if (response.statusCode == 200) {
            setServiceSubcategories(response.data);
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
    const filteredSubcategories = useMemo(() => serviceSubcategories.filter((sub) => formData.serviceCategories.includes(sub.categoryId)),
        [formData.serviceCategories, serviceSubcategories]
    );

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
        if ((isIndividualAccount && step === 1) || (formData.accountType === AccountType.SELLER && step === 1)) {
            setStep(3); // Passe directement à l'étape du mot de passe
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
        if ((isIndividualAccount && step === 3) || (formData.accountType === AccountType.SELLER && step === 3)) {
            setStep(1); // Retour direct à l'étape 1 (zone géographique)
            return;
        }
        setStep((s) => Math.max(0, s - 1));
    };

    const handleAccountTypeChange = (type: AccountType) => {
        let newRole: Role;

        // Déterminer le rôle en fonction du type de compte
        if (type === AccountType.INDIVIDUAL) {
            newRole = Role.CLIENT;
        } else if (type === AccountType.SELLER) {
            newRole = Role.SELLER;
        } else if (type === AccountType.ENTERPRISE) {
            newRole = Role.PROVIDER;
        } else {
            // Pour les autres types, on peut adapter selon les besoins
            newRole = type === "FREELANCER" ? Role.PROVIDER : Role.CLIENT;
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

    // Fonction pour formater automatiquement le numéro de téléphone
    const formatPhoneInput = (value: string) => {
        // Supprimer tout sauf les chiffres
        const cleaned = value.replace(/\D/g, '');

        // Appliquer le format français
        let formatted = cleaned;
        if (cleaned.length > 2) {
            formatted = cleaned.substring(0, 2) + ' ' + cleaned.substring(2);
        }
        if (cleaned.length > 4) {
            formatted = cleaned.substring(0, 2) + ' ' + cleaned.substring(2, 4) + ' ' + cleaned.substring(4);
        }
        if (cleaned.length > 6) {
            formatted = cleaned.substring(0, 2) + ' ' + cleaned.substring(2, 4) + ' ' + cleaned.substring(4, 6) + ' ' + cleaned.substring(6);
        }
        if (cleaned.length > 8) {
            formatted = cleaned.substring(0, 2) + ' ' + cleaned.substring(2, 4) + ' ' + cleaned.substring(4, 6) + ' ' + cleaned.substring(6, 8) + ' ' + cleaned.substring(8);
        }

        return formatted;
    };

    // Gestionnaire de changement pour le champ téléphone avec formatage
    const handlePhoneChange = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        setFormData((p) => ({ ...p, phone: cleaned }));
    };

    const handleSubmit = async () => {
        // 🔒 Empêche plusieurs appels API
        if (loader) return;

        setLoader(true);

        try {
            const passwordWithAt = formData.password.startsWith("@") ? formData.password : `@${formData.password}`;
            const payload = {
                ...formData,
                password: passwordWithAt,
                location: location ?? null,
            };

            console.log("Données envoyées:", payload);
            const res = await register(payload);

            if (res.statusCode === 201 || res.statusCode === 200) {
                showAlert("Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter", "success");
                setTimeout(() => router.push("/welcome"), 2000);

            } else {
                showAlert("Une erreur est survenue. Veuillez réessayer", "error");
            }

        } catch (err) {
            console.error(err);
            showAlert("Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer", "error");
        } finally {
            setLoader(false);
        }
    };

    // ===============================
    // RENDU DES ÉTAPES
    // ===============================
    if (!mounted) {
        return (
            <div className="min-h-screen bg-slate-100 pt-[5%] px-4 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Créer votre compte 👤
                            </h1>
                            <p className="text-sm text-slate-700 mt-1">
                                Commençons par vos informations de base
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Numéro de téléphone
                                </label>
                                <SecureInput type="tel" value={formatPhoneInput(formData.phone)} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="Ex: 01 23 45 67 89" inputMode="numeric" />
                                {validationErrors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Nom de l'entreprise (optionnel)
                                </label>
                                <SecureInput type="text" value={formData.companyName} onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))} placeholder="Saisissez le nom de votre entreprise" inputMode="text" />
                                {validationErrors.companyName && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.companyName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Type de compte
                                </label>
                                <CustomSelect value={formData.accountType} onChange={handleAccountTypeChange} options={accountTypes} placeholder="Sélectionnez votre type de compte" error={validationErrors.accountType} />
                            </div>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Localisation 📍
                            </h1>
                            <p className="text-sm text-slate-700 mt-1">
                                Nous avons besoin de votre localisation
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col gap-3">
                                <button type="button" onClick={askForLocation} disabled={isLocLoading} className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" >
                                    <MapPin className="w-5 h-5 text-[#b07b5e]" />
                                    {isLocLoading ? "Détection en cours..." : "Utiliser ma position actuelle"}
                                </button>

                                <div className="text-sm text-slate-600 flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                    <span className="text-[#b07b5e]">📍</span>
                                    {isLocLoading ? (
                                        <Loading />
                                    ) : (
                                        displayLocation
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-slate-500">
                                Votre localisation est nécessaire pour vous connecter avec des prestataires proches de vous.
                            </p>
                        </div>
                    </div>
                );

            case 2:
                if (isIndividualAccount || formData.accountType === AccountType.SELLER) {
                    // Étape mot de passe pour les comptes individuels
                    return (
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">
                                    Code PIN 🔒
                                </h1>
                                <p className="text-sm text-slate-700 mt-1">
                                    Créez votre code PIN de sécurité
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className={`flex items-center justify-center gap-3 ${validationErrors.password ? "animate-shake" : ""}`}>
                                    {/* Première case grise avec @ fixe */}
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                        <span className="text-slate-600 font-semibold text-sm">@</span>
                                    </div>

                                    {/* 4 cases pour le code PIN */}
                                    {[0, 1, 2, 3].map((i) => (
                                        <input
                                            key={i}
                                            id={`pin-${i}`}
                                            type={showPassword ? "text" : "password"}
                                            maxLength={1}
                                            inputMode="numeric"
                                            value={formData.password[i] || ""}
                                            onChange={(e) => handlePasswordInput(i, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace") {
                                                    handlePasswordBackspace(i);
                                                }
                                            }}
                                            className="w-12 h-12 text-center text-sm bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b07b5e] text-slate-700"
                                            style={{ fontSize: '16px' }}
                                        />
                                    ))}

                                    {/* Icône œil */}
                                    <button  type="button"  onClick={() => setShowPassword(!showPassword)}  className="ml-2 text-[#b07b5e] hover:text-[#a06a50]"  >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                {validationErrors.password && (
                                    <p className="text-red-500 text-xs text-center">
                                        {validationErrors.password}
                                    </p>
                                )}

                                <p className="text-xs text-slate-500 text-center">
                                    Créez un code PIN à 4 chiffres pour sécuriser votre compte
                                </p>
                            </div>
                        </div>
                    );
                }
                // Étape catégories pour les autres types de compte
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Vos services 🛠️
                            </h1>
                            <p className="text-sm text-slate-700 mt-1">
                                Sélectionnez vos catégories de services
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Catégories de services
                                </label>
                                <MultiSelect  data={serviceCategories.map((c) => ({ id: c.id, label: c.name }))}  multiple  onSelect={(sel) => handleCategorySelect(sel)}  placeholder="Sélectionner une ou plusieurs catégories" />
                                {validationErrors.serviceCategories && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.serviceCategories}</p>
                                )}
                            </div>

                            {filteredSubcategories.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Sous-catégories
                                    </label>
                                    <MultiSelect data={filteredSubcategories.map((s) => ({ id: s.id, label: s.name }))} multiple onSelect={(sel) => handleSubcategorySelect(sel)}
                                        placeholder="Sélectionner une ou plusieurs sous-catégories" />
                                    {validationErrors.serviceSubcategories && (
                                        <p className="text-red-500 text-xs mt-1">{validationErrors.serviceSubcategories}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3:
                // Étape mot de passe pour les autres types de compte
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">
                                Code PIN 🔒
                            </h1>
                            <p className="text-sm text-slate-700 mt-1">
                                Créez votre code PIN de sécurité
                            </p>
                        </div>

                        <div className="space-y-4">

                            <div className={`flex items-center justify-center gap-3 ${validationErrors.password ? "animate-shake" : ""}`}>
                                {/* Première case grise avec @ fixe */}
                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <span className="text-slate-600 font-semibold text-sm">@</span>
                                </div>

                                {/* 4 cases pour le code PIN */}
                                {[0, 1, 2, 3].map((i) => (
                                    <input
                                        key={i}
                                        id={`pin-${i}`}
                                        type={showPassword ? "text" : "password"}
                                        maxLength={1}
                                        inputMode="numeric"
                                        value={formData.password[i] || ""}
                                        onChange={(e) => handlePasswordInput(i, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Backspace") {
                                                handlePasswordBackspace(i);
                                            }
                                        }}
                                        className="w-12 h-12 text-center text-sm bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#b07b5e] text-slate-700"
                                        style={{ fontSize: '16px' }} />
                                ))}

                                {/* Icône œil */}
                                <button   type="button"  onClick={() => setShowPassword(!showPassword)}  className="ml-2 text-[#b07b5e] hover:text-[#a06a50]" >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {validationErrors.password && (
                                <p className="text-red-500 text-xs text-center">
                                    {validationErrors.password}
                                </p>
                            )}

                            <p className="text-xs text-slate-500 text-center">
                                Créez un code PIN à 4 chiffres pour sécuriser votre compte
                            </p>
                        </div>
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
        <div className="min-h-screen bg-slate-100 pt-[5%] px-4">
            <LogoInSeach />

            {/* Carte d'inscription */}
            <div className="rounded-xl border-slate-200 bg-white text-slate-950 mx-auto max-w-sm border-0 shadow-none shadow-slate-400/20">
                <div className="py-2"></div>

                <div style={{ opacity: 1 }}>
                    <div className="p-6 pt-0">
                        {step > 0 && (
                            <button  onClick={prev} className="flex items-center gap-2 text-[#b07b5e] hover:text-[#a06a50] transition mb-6"  >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Retour</span>
                            </button>
                        )}

                        {renderStep()}

                        {/* Bouton continuer */}
                        <div className="flex justify-center mt-8">
                            <Button  onClick={next} disabled={loader} className={`items-center justify-center whitespace-nowrap rounded-lg text-sm font-normal transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 text-slate-50 h-11 px-4 py-4 flex flex-1 bg-[#b07b5e] shadow-none hover:bg-[#a06a50] disabled:opacity-50 disabled:cursor-not-allowed ${loader ? "opacity-70 cursor-not-allowed" : ""  }`}  >
                                {loader ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Traitement...
                                    </div>
                                ) : step === stepsTotal - 1 ? (  "Créer mon compte"  ) : (  "Continuer" )}
                            </Button>
                        </div>

                        {/* Indicateur de progression */}
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: stepsTotal }).map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-[#b07b5e]" : "bg-slate-300" }`}  />
                            ))}
                        </div>

                        {/* Liens additionnels */}
                        <div className="space-y-3 text-center mt-6">
                            <Link  href="/welcome" className="text-sm text-[#b07b5e] hover:text-[#a06a50] hover:underline block"  >
                                Retour à la connexion
                            </Link>
                        </div>

                        {/* Footer avec liens légaux */}
                        <div className="flex justify-center pt-6 mt-6 border-t border-slate-200">
                            <span className="flex items-center text-[#b07b5e]">
                                <span className="mr-1 text-xs text-slate-600">
                                    Développé par inSeach |
                                </span>
                                <Link  className="text-xs text-[#b07b5e] mr-1 hover:underline"  href="/docs/terms-of-use"  >
                                    CGU
                                </Link>
                                <span className="text-xs text-slate-600 mr-1">  | </span>
                                <Link  className="text-xs text-[#b07b5e] hover:underline"  href="/docs/privacy-policy" >
                                    Confidentialité
                                </Link>
                            </span>
                        </div>
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