"use client";

import { useState } from "react";
import { UploadCloud, ScanFace, CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { neoFaceDocumentCapture, neoFaceMatchVerify } from "@/services/securityService";


type Status = "idle" | "uploading" | "waiting" | "verified" | "failed";

export default function NeoFacePage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<Status>("idle");
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    // Upload document
    const handleUpload = async () => {
        if (!file) return;

        setStatus("uploading");
        setMessage("Envoi du document en cours...");

        try {
            const res = await neoFaceDocumentCapture(file);

            if (!res || !res.document_id || !res.url) {
                throw new Error("Erreur NeoFace : document non reçu");
            }

            setDocumentId(res.document_id);

            // 🔁 Redirection vers l'interface selfie NeoFace
            window.location.href = res.url;
        } catch (err: any) {
            setStatus("failed");
            setMessage(err?.message || "Erreur lors de l'envoi");
        }
    };

    // Polling manuel du statut
    const checkStatus = async () => {
        if (!documentId) return;

        setStatus("waiting");
        setMessage("Vérification en cours...");

        const interval = setInterval(async () => {
            try {
                const res = await neoFaceMatchVerify(documentId);

                if (res.status === "verified") {
                    clearInterval(interval);
                    setStatus("verified");
                    setMessage(
                        `Identité vérifiée (score: ${res.matching_score?.toFixed(2)})`
                    );
                } else if (res.status === "failed") {
                    clearInterval(interval);
                    setStatus("failed");
                    setMessage("La vérification a échoué");
                } else {
                    // waiting -> optionnel: update message
                    setMessage("Matching en attente...");
                }
            } catch (err: any) {
                clearInterval(interval);
                setStatus("failed");
                setMessage(err?.message || "Erreur lors de la vérification");
            }
        }, 3000);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-lg w-full rounded-2xl border bg-white shadow-sm p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-blue-600" />
                    <div>
                        <h1 className="text-xl font-semibold">Vérification d’identité</h1>
                        <p className="text-sm text-gray-500">
                            Sécurisation du compte par reconnaissance faciale
                        </p>
                    </div>
                </div>

                {/* Upload zone */}
                {status === "idle" && (
                    <label className="group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">
                        <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500" />
                        <p className="mt-2 text-sm font-medium">Cliquez pour ajouter votre document</p>
                        <p className="text-xs text-gray-500">Carte d’identité, passeport (JPG / PNG)</p>
                        <input
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </label>
                )}

                {/* File preview + upload button */}
                {file && status === "idle" && (
                    <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3">
                        <span className="truncate">{file.name}</span>
                        <button
                            onClick={handleUpload}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Continuer
                        </button>
                    </div>
                )}

                {/* Loading */}
                {(status === "uploading" || status === "waiting") && (
                    <div className="flex items-center gap-3 text-blue-600">
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span className="text-sm">{message}</span>
                    </div>
                )}

                {/* Success */}
                {status === "verified" && (
                    <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
                        <CheckCircle2 className="w-6 h-6" />
                        <span className="text-sm font-medium">{message}</span>
                    </div>
                )}

                {/* Failed */}
                {status === "failed" && (
                    <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl">
                        <XCircle className="w-6 h-6" />
                        <span className="text-sm font-medium">{message}</span>
                    </div>
                )}

                {/* Manual polling */}
                {documentId && status === "idle" && (
                    <button
                        onClick={checkStatus}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border hover:bg-gray-50 transition"
                    >
                        <ScanFace className="w-5 h-5" />
                        Vérifier le statut
                    </button>
                )}
            </div>
        </main>
    );
}
