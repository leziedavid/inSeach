"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Pencil, Image as ImageIcon, MapPin } from "lucide-react";
import MultiSelect from "../forms/MultiSelect";
import { useAlert } from "@/contexts/AlertContext";

export default function UserProfile() {
    const { showAlert } = useAlert();

    const fileRef = useRef<HTMLInputElement | null>(null);
    const cardFileRef = useRef<HTMLInputElement | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [showCard, setShowCard] = useState(true);
    const [cardImage, setCardImage] = useState<string | null>(null);

    const [country, setCountry] = useState("");
    const [gps, setGps] = useState("");
    const [ville, setVille] = useState<string | string[] | null>(null);
    const [commune, setCommune] = useState<string | string[] | null>(null);
    const [quartier, setQuartier] = useState<string | string[] | null>(null);
    const [locationAttempts, setLocationAttempts] = useState(0);

    const [modal, setModal] = useState({
        open: false,
        message: "",
        type: "info" as "success" | "error" | "info",
        action: undefined as string | undefined,
    });

    // --- Simulation de données de sélection ---
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
    
    // --- Upload handlers ---
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setProfileImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setCardImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };


    // --- Fonction exécutée quand on clique sur le bouton d'action du modal ---
    const handleModalAction = () => {
        detectLocationComplete();
    };

    // --- Solution complète avec fallbacks ---
    const detectLocationComplete = async () => {

        if (locationAttempts >= 3) {
            showAlert("Localisation désactivée après plusieurs échecs ⚠️", "error");
            return;
        }

        setLocationAttempts(prev => prev + 1);

        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.country_name) {
                setCountry(data.country_name);
                setGps(data.latitude + ", " + data.longitude);
            }

        } catch (ipError) {
            console.log("GPS échoué, tentative IP...", ipError);
                        showAlert("Localisation désactivée après plusieurs échecs ⚠️", "error");
        }
    };

    // --- Bouton de détection manuelle ---
    const handleDetectLocation = () => {
        detectLocationComplete();
    };

    useEffect(() => {
        detectLocationComplete();
    }, []);

    return (
        <>

            <div className="w-full mb-6">
                {/* Photo de profil */}
                <div className="flex flex-col items-center mb-4">
                    <div
                        className="w-20 h-20 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer"
                        onClick={() => fileRef.current?.click()}
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Informations utilisateur */}
                <div className="relative mb-6">
                    <button onClick={() => setIsEditable((prev) => !prev)} className="absolute right-2 -top-2 text-gray-500 hover:text-gray-700"  >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <input
                        type="text"
                        placeholder="Nom & Prénom"
                        disabled={!isEditable}
                        className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                        style={{ fontSize: '16px' }} // ← C'est la clé !
                        inputMode="text"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        disabled={!isEditable}
                        className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                        style={{ fontSize: '16px' }} // ← C'est la clé !
                        inputMode="email"
                    />
                    <input
                        type="tel"
                        placeholder="Téléphone"
                        disabled={!isEditable}
                        className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                        style={{ fontSize: '16px' }} // ← C'est la clé !
                        inputMode="tel"
                    />

                    {/* Sélection de la localisation */}
                    {isEditable ? (
                        <>
                            <div className="flex flex-col gap-4 mt-3">
                                <MultiSelect
                                    data={villesData}
                                    multiple={false}
                                    onSelect={setVille}
                                    placeholder="Sélectionner la ville"
                                />
                                <MultiSelect
                                    data={communesData}
                                    multiple={false}
                                    onSelect={setCommune}
                                    placeholder="Sélectionner la commune"
                                />
                                <MultiSelect
                                    data={quartiersData}
                                    multiple={false}
                                    onSelect={setQuartier}
                                    placeholder="Sélectionner le quartier"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={ville || ""}
                                placeholder="Ville"
                                disabled
                                className="p-2 w-full text-sm rounded-lg border border-gray-100 mb-3"
                            />
                            <input
                                type="text"
                                value={commune || ""}
                                placeholder="Commune"
                                disabled
                                className="p-2 w-full text-sm rounded-lg border border-gray-100 mb-3"
                            />
                            <input
                                type="text"
                                value={quartier || ""}
                                placeholder="Quartier"
                                disabled
                                className="p-2 w-full text-sm rounded-lg border border-gray-100"
                            />
                        </>
                    )}

                    {/* GPS et Pays */}
                    <div className="flex gap-2 mt-3">
                        <input
                            type="text"
                            value={gps}
                            placeholder="Coordonnées GPS"
                            disabled
                            className="flex-1 p-2 text-sm rounded-lg border border-gray-100 focus:outline-none"
                        />
                        <button
                            onClick={handleDetectLocation}
                            className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100"
                            title="Actualiser la position"
                        >
                            <MapPin className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                    <input
                        type="text"
                        value={country}
                        placeholder="Pays"
                        disabled
                        className="mt-3 p-2 w-full text-sm rounded-lg border border-gray-100"
                    />
                </div>

                {/* Carte d'identité */}
                <div className="relative">
                    <button onClick={() => setShowCard((prev) => !prev)} className="absolute top-2 right-2 z-20 bg-white rounded-full shadow p-1.5 text-gray-500 hover:text-gray-700" >
                        {showCard ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                        <CardContent className="p-0 relative">
                            <input
                                ref={cardFileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCardChange}
                            />
                            <div
                                className="cursor-pointer"
                                onClick={() => cardFileRef.current?.click()}
                            >
                                {showCard ? (
                                    cardImage ? (
                                        <img
                                            src={cardImage}
                                            alt="Carte d'identité"
                                            className="w-full h-40 object-cover"
                                        />
                                    ) : (
                                        <div className="h-40 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                                            Ajouter votre carte d'identité
                                        </div>
                                    )
                                ) : (
                                    <div className="h-40 bg-gray-100 animate-pulse rounded-md" />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}