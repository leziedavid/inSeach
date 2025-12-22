"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type InterventionType = "urgence" | "rdv" | null;

interface FormsInterventionProps {
    onSelectionChange?: (selectedType: InterventionType) => void;
    initialValue?: InterventionType;
    fullPage?: boolean;
}

export default function FormsIntervention({
    onSelectionChange,
    initialValue = null,
    fullPage = false
}: FormsInterventionProps) {
    const [selectedType, setSelectedType] = useState<InterventionType>(initialValue);

    // Notifie le parent lorsque la sélection change
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange(selectedType);
        }
    }, [selectedType, onSelectionChange]);

    const handleSelect = (type: InterventionType) => {
        setSelectedType(type);
    };

    // Si fullPage, on rend l'ancien style
    if (fullPage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Type d'intervention *
                        </h1>
                        <p className="text-blue-100 text-sm md:text-base">
                            Sélectionnez le type d'intervention souhaité
                        </p>
                    </div>

                    {/* Options */}
                    <div className="p-6 md:p-8 space-y-6">
                        {/* Urgence Option */}
                        <div
                            className={`relative border-2 rounded-xl p-5 md:p-6 cursor-pointer transition-all duration-300 ${selectedType === "urgence" ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"  }`}
                            onClick={() => handleSelect("urgence")}  >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedType === "urgence"  ? "border-blue-500 bg-blue-500"  : "border-gray-300"  }`}  >
                                        {selectedType === "urgence" && (
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                                            En urgence
                                        </h3>
                                        <span className="ml-auto bg-red-100 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                                            24h/24 & 7j/7
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-3">
                                        Nous vous rappellerons immédiatement pour vous dépanner en 40 min,
                                        <span className="font-semibold"> 24h/24 & 7j/7</span>.
                                    </p>

                                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-sm">Réponse immédiate garantie</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rendez-vous Option */}
                        <div
                            className={`relative border-2 rounded-xl p-5 md:p-6 cursor-pointer transition-all duration-300 ${selectedType === "rdv"
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                }`}
                            onClick={() => handleSelect("rdv")}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedType === "rdv"
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        {selectedType === "rdv" && (
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                                            Sur rendez-vous
                                        </h3>
                                        <span className="ml-auto bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                            Flexible
                                        </span>
                                    </div>

                                    <p className="text-gray-700 mb-3">
                                        Nous mandaterons un technicien qualifié pour intervenir selon vos disponibilités.
                                    </p>

                                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-sm">Planification selon vos horaires</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-5">
                                <div className="flex items-start gap-3">
                                    <div className="bg-amber-100 p-2 rounded-full">
                                        <AlertCircle className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-amber-900 mb-1">
                                            Information importante
                                        </h4>
                                        <p className="text-amber-800 text-sm md:text-base">
                                            Veuillez noter que les interventions programmées entre minuit et 6h du matin peuvent être sujettes à des ajustements en raison des contraintes horaires spécifiques. Nous vous contacterons pour confirmer l'heure exacte de votre intervention.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Continue Button - Optionnel */}
                        <div className="mt-8">
                            <div className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-center ${selectedType
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                                : "bg-gray-200 text-gray-400"
                                }`}>
                                {selectedType === "urgence"
                                    ? "Intervention d'urgence sélectionnée"
                                    : selectedType === "rdv"
                                        ? "Rendez-vous programmé sélectionné"
                                        : "Sélectionnez un type d'intervention"}
                            </div>

                            {/* Indicateur de sélection pour le parent */}
                            {selectedType && (
                                <div className="mt-4 text-center text-sm text-gray-500">
                                    Sélection transmise au parent: <span className="font-semibold">{selectedType}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Version compacte ultra-optimisée pour modal (mobile-first)
    return (
        <div className="space-y-3">
            {/* En-tête */}
            <div className="mb-1">
                <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">
                    Type d'intervention <span className="text-red-500">*</span>
                </h3>
                <p className="text-[10px] text-gray-600 mt-0.5 sm:text-xs">
                    Sélectionnez le type
                </p>
            </div>

            {/* Options côte à côte - layout optimisé pour mobile */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {/* Option Urgence */}
                <div  className={`relative border rounded-lg p-2 cursor-pointer transition-all duration-150 min-h-[70px] sm:min-h-[80px] ${selectedType === "urgence" ? "border-red-500 bg-red-50 shadow-sm"  : "border-gray-200 hover:border-red-300 hover:bg-gray-50"  }`}  onClick={() => handleSelect("urgence")}  >
                    <div className="flex flex-col h-full">
                        {/* En-tête avec icône et badge */}
                        <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-1">
                                <div
                                    className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedType === "urgence"
                                        ? "border-red-500 bg-red-500"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {selectedType === "urgence" && (
                                        <div className="w-1 h-1 rounded-full bg-white"></div>
                                    )}
                                </div>
                                <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <span className="text-[8px] font-semibold bg-red-100 text-red-800 px-1 py-0.5 rounded sm:text-[10px] sm:px-1.5">
                                24h/24
                            </span>
                        </div>

                        {/* Titre principal */}
                        <h4 className="text-xs font-semibold text-gray-900 mb-0.5 line-clamp-1 sm:text-sm">
                            Urgence
                        </h4>

                        {/* Description ultra-courte */}
                        <p className="text-[10px] text-gray-600 mb-1 line-clamp-2 flex-grow sm:text-xs">
                            40 min max
                        </p>

                        {/* Indicateur de confirmation */}
                        <div className="flex items-center gap-0.5 mt-auto">
                            <CheckCircle2 className="w-2.5 h-2.5 text-red-600 sm:w-3 sm:h-3" />
                            <span className="text-[9px] font-medium text-red-600 sm:text-[10px]">Immédiat</span>
                        </div>
                    </div>
                </div>

                {/* Option Rendez-vous */}
                <div
                    className={`relative border rounded-lg p-2 cursor-pointer transition-all duration-150 min-h-[70px] sm:min-h-[80px] ${selectedType === "rdv"
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                    onClick={() => handleSelect("rdv")}
                >
                    <div className="flex flex-col h-full">
                        {/* En-tête avec icône et badge */}
                        <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-1">
                                <div
                                    className={`w-3 h-3 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedType === "rdv"
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {selectedType === "rdv" && (
                                        <div className="w-1 h-1 rounded-full bg-white"></div>
                                    )}
                                </div>
                                <Clock className="w-3 h-3 text-blue-500 flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                            </div>
                            <span className="text-[8px] font-semibold bg-green-100 text-green-800 px-1 py-0.5 rounded sm:text-[10px] sm:px-1.5">
                                Flexible
                            </span>
                        </div>

                        {/* Titre principal */}
                        <h4 className="text-xs font-semibold text-gray-900 mb-0.5 line-clamp-1 sm:text-sm">
                            RDV
                        </h4>

                        {/* Description ultra-courte */}
                        <p className="text-[10px] text-gray-600 mb-1 line-clamp-2 flex-grow sm:text-xs">
                            À votre convenance
                        </p>

                        {/* Indicateur de confirmation */}
                        <div className="flex items-center gap-0.5 mt-auto">
                            <CheckCircle2 className="w-2.5 h-2.5 text-blue-600 sm:w-3 sm:h-3" />
                            <span className="text-[9px] font-medium text-blue-600 sm:text-[10px]">Planifié</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Note d'information - version très compacte */}
            <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="bg-amber-50 border border-amber-100 rounded p-1.5">
                    <div className="flex items-start gap-1.5">
                        <AlertCircle className="w-2.5 h-2.5 text-amber-600 flex-shrink-0 mt-0.5 sm:w-3 sm:h-3" />
                        <div>
                            <h4 className="text-[12px] font-semibold text-amber-900 mb-0.5 sm:text-sm">
                                Info importante
                            </h4>
                            <p className="text-[12px] text-amber-800 leading-tight sm:text-[12px]">
                                Interventions 0h-6h : ajustements possibles
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicateur de sélection - ultra compact */}
            {selectedType && (
                <div className="text-center pt-1">
                    <div className={`text-[12px] py-1.5 px-2 rounded-md font-medium ${selectedType === "urgence" ? "bg-red-100 text-red-800 border border-red-200" : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}>
                        {selectedType === "urgence"  ? "✓ Urgence sélectionnée" : "✓ RDV sélectionné"}
                    </div>
                </div>
            )}
        </div>
    );
}