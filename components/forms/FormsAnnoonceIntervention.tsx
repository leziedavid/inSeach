"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export type InterventionType = "rdv";

interface FormsAnnonceInterventionProps {
    onSelectionChange?: (selectedType: InterventionType) => void;
    initialValue?: InterventionType;
    fullPage?: boolean;
}

export default function FormsAnnonceIntervention({ onSelectionChange, initialValue = "rdv", fullPage = false, }: FormsAnnonceInterventionProps) {
    const [selectedType, setSelectedType] = useState<InterventionType>(initialValue);
    // Notifier le parent (toujours RDV)
    useEffect(() => { onSelectionChange?.("rdv"); }, [onSelectionChange]);

    /* =========================
    VERSION COMPACTE (MODAL)
    ========================== */
    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900">
                    Type d’intervention <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                    Intervention planifiée uniquement
                </p>
            </div>

            {/* RDV Card */}
            <div className="border border-blue-500 bg-blue-50 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">

                    {/* Radio */}
                    <div className="w-4 h-4 rounded-full bg-blue-500 mt-1 flex-shrink-0" />

                    <div className="flex-grow">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    Sur rendez-vous
                                </h4>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                Flexible
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-700">
                            Planification selon vos disponibilités
                        </p>

                        {/* Confirmation */}
                        <div className="flex items-center gap-1.5 mt-2 text-blue-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">
                                Sélectionné
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}
