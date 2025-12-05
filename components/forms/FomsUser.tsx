"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationDetection } from "@/hooks/useLocationDetection";
import {
    AccountType,
    Role,
    ServiceCategory,
    ServiceSubcategory,
    ServiceType,
} from "@/types/interfaces";
import MultiSelect from "./MultiSelect";

// ===============================
// FAKE DATA — typées proprement
// ===============================
const villesData = [
    { id: "1", label: "Abidjan" },
    { id: "2", label: "Bouaké" },
    { id: "3", label: "San Pedro" },
];

const communesData = [
    { id: "1", label: "Cocody" },
    { id: "2", label: "Yopougon" },
    { id: "3", label: "Marcory" },
];

const quartiersData = [
    { id: "1", label: "Angré" },
    { id: "2", label: "Koumassi" },
    { id: "3", label: "Plateau" },
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
// Logo SVG inline
// ===============================
const LogoInSeach = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" fill="none" className="w-[180px] h-auto mb-8">
        <defs>
            <linearGradient id="inSeachGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b07b5e" />
                <stop offset="100%" stopColor="#155e75" />
            </linearGradient>
        </defs>
        <g transform="translate(25, -4)">
            <circle cx="0" cy="10" r="6" stroke="#b07b5e" strokeWidth="2" fill="none" />
            <line x1="4" y1="14" x2="9" y2="19" stroke="#b07b5e" strokeWidth="2" strokeLinecap="round">
                <animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur="1.4s" repeatCount="indefinite" />
            </line>
        </g>
        <text x="15" y="45" fontFamily="Raleway, var(--font-raleway), sans-serif" fontWeight="900" fontSize="28" fill="url(#inSeachGradient)" letterSpacing="1">
            inSeach
        </text>
    </svg>
);

// ===============================
// Composant principal
// ===============================
export default function FomsUser() {
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        phone: "",
        location: "",
        ville: "",
        commune: "",
        quartier: "",
        accountType: AccountType.INDIVIDUAL,
        roles: [] as Role[],
        serviceCategories: [] as string[],
        serviceSubcategories: [] as string[],
        password: "",
    });

    const { country, gps, loading, detect } = useLocationDetection(false);

    // filteredSubcategories recalculées à partir de formData.serviceCategories
    const filteredSubcategories = useMemo(
        () => serviceSubcategoriesFake.filter((sub) => formData.serviceCategories.includes(sub.categoryId)),
        [formData.serviceCategories]
    );

    // nombre d'étapes en fonction du type de compte
    const stepsTotal = formData.accountType === AccountType.INDIVIDUAL ? 5 : 6;

    // navigation
    const next = () => {
        // si on est sur la step "zone" (2) et que le compte est INDIVIDUAL, on saute la sélection de catégories (3) et passe à mot de passe (4)
        if (formData.accountType === AccountType.INDIVIDUAL && step === 2) {
            setStep(4);
            return;
        }
        if (step < stepsTotal - 1) setStep((s) => s + 1);
    };

    const prev = () => setStep((s) => Math.max(0, s - 1));

    // localisation automatique
    const handleDetectLocation = async () => {
        await detect();
        if (country) setFormData((prev) => ({ ...prev, location: country }));
    };

    // gestion du changement du type de compte et rôle automatique
    const handleAccountTypeChange = (type: AccountType) => {
        setFormData((prev) => ({
            ...prev,
            accountType: type,
            roles: [type === AccountType.INDIVIDUAL ? Role.CLIENT : Role.PROVIDER],
        }));
    };

    // gestion sélection catégories : on met à jour categories et on nettoie subcategories non-compatibles
    const handleCategorySelect = (selected: string | string[]) => {
        const ids = Array.isArray(selected) ? selected : [selected];

        setFormData((prev) => {
            // new subcategories = prev.serviceSubcategories ∩ ids' allowed subs
            const allowedSubIds = serviceSubcategoriesFake.filter((s) => ids.includes(s.categoryId)).map((s) => s.id);
            const newSubcats = prev.serviceSubcategories.filter((subId) => allowedSubIds.includes(subId));
            return {
                ...prev,
                serviceCategories: ids,
                serviceSubcategories: newSubcats,
            };
        });
    };

    // gestion sélection sous-catégories
    const handleSubcategorySelect = (selected: string | string[]) => {
        const ids = Array.isArray(selected) ? selected : [selected];
        setFormData((prev) => ({ ...prev, serviceSubcategories: ids }));
    };

    // ===============================
    // RENDU DES ÉTAPES
    // ===============================
    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-5">
                        <div>
                            <label className="block font-semibold mb-2">Numéro de téléphone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="+33 6 00 00 00 00"
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#155e75]"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">Type de compte</label>
                            <select
                                value={formData.accountType}
                                onChange={(e) => handleAccountTypeChange(e.target.value as AccountType)}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#155e75]"
                            >
                                <option value={AccountType.INDIVIDUAL}>Particulier</option>
                                <option value={AccountType.COMPANY}>Entreprise</option>
                                <option value={AccountType.ENTERPRISE}>Grande entreprise</option>
                            </select>
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-4">
                        <label className="block font-semibold">Localisation</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                                placeholder="Pays ou région"
                                className="flex-1 p-3 border rounded-xl"
                            />
                            <Button onClick={handleDetectLocation} variant="outline" disabled={loading} className="flex items-center gap-1 border-[#155e75] text-[#155e75]">
                                <MapPin className={`w-4 h-4 ${loading ? "animate-pulse text-[#155e75]" : ""}`} />
                                {loading ? "..." : "Auto"}
                            </Button>
                        </div>
                        {gps && <p className="text-xs text-gray-500">Coordonnées : <span className="font-medium">{gps}</span></p>}
                    </div>
                );

            case 2:
                return (
                    <>
                        <label className="block font-semibold mb-2">Zone géographique</label>
                        <div className="flex flex-col gap-4 mt-3">
                            <MultiSelect data={villesData} multiple={false} onSelect={(id) => setFormData((p) => ({ ...p, ville: String(id) }))} placeholder="Sélectionner la ville" />
                            <MultiSelect data={communesData} multiple={false} onSelect={(id) => setFormData((p) => ({ ...p, commune: String(id) }))} placeholder="Sélectionner la commune" />
                            <MultiSelect data={quartiersData} multiple={false} onSelect={(id) => setFormData((p) => ({ ...p, quartier: String(id) }))} placeholder="Sélectionner le quartier" />
                        </div>
                    </>
                );

            case 3:
                // Affiche à la fois la sélection des catégories ET (filtrée) les sous-catégories
                return (
                    <div className="space-y-4">
                        <label className="block font-semibold">Catégories de services</label>
                        <MultiSelect
                            data={serviceCategoriesFake.map((c) => ({ id: c.id, label: c.name }))}
                            multiple
                            onSelect={(sel) => handleCategorySelect(sel)}
                            placeholder="Sélectionner une ou plusieurs catégories"
                        />

                        <div>
                            <label className="block font-semibold mt-4">Sous-catégories disponibles</label>
                            <MultiSelect
                                data={filteredSubcategories.map((s) => ({ id: s.id, label: s.name }))}
                                multiple
                                onSelect={(sel) => handleSubcategorySelect(sel)}
                                placeholder={filteredSubcategories.length ? "Choisir les sous-catégories" : "Aucune sous-catégorie"}
                            />
                            {/* Petit rappel des choix */}
                            {formData.serviceSubcategories.length > 0 && (
                                <p className="mt-2 text-xs text-gray-600">Sélection : {formData.serviceSubcategories.join(", ")}</p>
                            )}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-4">
                        <label className="block font-semibold">Mot de passe</label>
                        <input type="password" value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" className="w-full p-3 border rounded-xl" />
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
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-white">
            <LogoInSeach />

            <div className="relative w-full max-w-md p-6 bg-white border rounded-2xl shadow-sm">
                {step > 0 && (
                    <button onClick={prev} className="absolute -top-10 left-0 flex items-center gap-1 text-[#b07b5e] hover:text-[#155e75] transition">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Retour</span>
                    </button>
                )}

                {renderStep()}

                <Button onClick={next} disabled={step === stepsTotal - 1} className="mt-6 w-full bg-gradient-to-r from-[#b07b5e] to-[#155e75] text-white font-bold py-3 rounded-xl">
                    {step === stepsTotal - 1 ? "Valider" : "Continuer"}
                </Button>
            </div>

            <div className="mt-4 flex gap-2">
                {Array.from({ length: stepsTotal }).map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i === step ? "bg-[#155e75]" : "bg-gray-300"}`} />
                ))}
            </div>
        </div>
    );
}
