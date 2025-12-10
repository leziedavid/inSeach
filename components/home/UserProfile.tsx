"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Pencil, Image as ImageIcon, MapPin } from "lucide-react";
import { useAlert } from "@/contexts/AlertContext";
import { User, UserLocation } from "@/types/interfaces";
import { getMyInfo } from "@/services/securityService";
import Image from "next/image";
import { getUserLocation } from "@/utils/geolocation";
import { MessagesData } from "./Messages";


export default function UserProfile() {
    const { showAlert } = useAlert();

    const fileRef = useRef<HTMLInputElement | null>(null);
    const cardFileRef = useRef<HTMLInputElement | null>(null);

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [cardImage, setCardImage] = useState<string | null>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [showCard, setShowCard] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
    const [gps, setGps] = useState("");
    const [country, setCountry] = useState("");
    const [isLocLoading, setIsLocLoading] = useState(false);
    const [displayLocation, setDisplayLocation] = useState("Localisation non détectée");
    const [msg, setMsg] = useState<MessagesData[]>([]);


    // --- Récupération des infos utilisateur ---
    useEffect(() => {
        getMyInfo().then((response) => {
            const u: User = (response as any)?.data ?? response;
            setUser(u);

            if (u.iconId && !profileImage && u.images) setProfileImage(u.images);
            if (u.cni && !cardImage) setCardImage(u.cni);

            if (u.location) {
                setUserLocation(u.location);
                setGps(`${u.location.lat}, ${u.location.lng}`);
                setCountry(u.location.country || "");
            }
        });
    }, []);

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

    // --- Détection de localisation simplifiée ---

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

            setUserLocation(userLocation);
            setGps(`${userLocation.lat}, ${userLocation.lng}`);
            setCountry(userLocation.country || "");

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


    // =========================
    // Fonctions de mise à jour
    // =========================
    const updateProfileImage = async () => {
        if (!profileImage) return showAlert("Aucune photo sélectionnée", "error");
        try {
            await fetch("/api/user/profile-image", {
                method: "POST",
                body: JSON.stringify({ image: profileImage }),
                headers: { "Content-Type": "application/json" },
            });
            showAlert("Photo de profil mise à jour ✅", "success");
        } catch (err) {
            showAlert("Erreur lors de la mise à jour de la photo", "error");
        }
    };

    const updateCardImage = async () => {
        if (!cardImage) return showAlert("Aucune image de CNI sélectionnée", "error");
        try {
            await fetch("/api/user/card-image", {
                method: "POST",
                body: JSON.stringify({ image: cardImage }),
                headers: { "Content-Type": "application/json" },
            });
            showAlert("Carte d'identité mise à jour ✅", "success");
        } catch (err) {
            showAlert("Erreur lors de la mise à jour de la CNI", "error");
        }
    };

    const updateUserInfo = async () => {
        if (!user) return;
        try {
            await fetch("/api/user/update-info", {
                method: "POST",
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: userLocation,
                }),
                headers: { "Content-Type": "application/json" },
            });
            showAlert("Informations utilisateur mises à jour ✅", "success");
        } catch (err) {
            showAlert("Erreur lors de la mise à jour des informations", "error");
        }
    };

    return (
        <div className="w-full mb-6">
            {/* Photo de profil */}
            <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer" onClick={() => fileRef.current?.click()} >
                    {profileImage ? (
                        <Image src={profileImage} alt="Profil" width={80} height={80} className="object-cover rounded-full" />
                    ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <button onClick={updateProfileImage} className="mt-2 p-1 text-sm bg-[#a06a50]/50  hover:bg-[#a06a50] text-white rounded">
                    Mettre à jour la photo
                </button>
            </div>

            {/* Informations utilisateur */}
            <div className="relative mb-6">
                <button onClick={() => setIsEditable((prev) => !prev)} className="absolute right-2 -top-2 text-gray-500 hover:text-gray-700">
                    <Pencil className="w-4 h-4" />
                </button>

                <input
                    type="text"
                    placeholder="Nom & Prénom"
                    disabled={!isEditable}
                    className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                    style={{ fontSize: "16px" }}
                    inputMode="text"
                    value={user?.name || user?.companyName || ""}
                    onChange={(e) => setUser((prev) => prev ? { ...prev, name: e.target.value } : prev)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    disabled
                    className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                    style={{ fontSize: "16px" }}
                    value={user?.email || ""}
                />
                <input
                    type="tel"
                    placeholder="Téléphone"
                    disabled={!isEditable}
                    className="p-2 w-full text-sm rounded-lg border border-gray-100 focus:outline-none focus:ring-1 focus:ring-[#b07b5e33] mb-3"
                    style={{ fontSize: "16px" }}
                    value={user?.phone || ""}
                    onChange={(e) => setUser((prev) => prev ? { ...prev, phone: e.target.value } : prev)}
                />

                {/* Localisation */}
                <input type="text" value={userLocation?.city || ""} placeholder="Ville" disabled className="p-2 w-full text-sm rounded-lg border border-gray-100 mb-3" />
                <input type="text" value={userLocation?.district || ""} placeholder="Commune" disabled className="p-2 w-full text-sm rounded-lg border border-gray-100 mb-3" />
                <input type="text" value={userLocation?.street || ""} placeholder="Quartier" disabled className="p-2 w-full text-sm rounded-lg border border-gray-100 mb-3" />

                <div className="flex gap-2 mt-3">
                    <input type="text" value={gps} placeholder="Coordonnées GPS" disabled className="flex-1 p-2 text-sm rounded-lg border border-gray-100 focus:outline-none" />
                    <button onClick={askForLocation} className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100" title="Actualiser la position" >
                        <span className="text-xs"> {isLocLoading ? "Détection..." : <MapPin className="w-4 h-4 text-gray-500" />} </span>
                    </button>
                </div>

                <input type="text" value={country} placeholder="Pays" disabled className="mt-3 p-2 w-full text-sm rounded-lg border border-gray-100" />
                <button onClick={updateUserInfo} className="w-full mt-2 p-1 text-sm bg-[#a06a50]/50  hover:bg-[#a06a50] text-white rounded">
                    Mettre à jour les infos
                </button>
            </div>

            {/* Carte d'identité */}
            <div className="relative">
                <button onClick={() => setShowCard((prev) => !prev)} className="absolute top-2 right-2 z-20 bg-white rounded-full shadow p-1.5 text-gray-500 hover:text-gray-700">
                    {showCard ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                    <CardContent className="p-0 relative">
                        <input ref={cardFileRef} type="file" accept="image/*" className="hidden" onChange={handleCardChange} />
                        <div className="cursor-pointer" onClick={() => cardFileRef.current?.click()}>
                            {showCard ? (
                                cardImage ? (
                                    <Image src={cardImage} alt="Carte d'identité" width={400} height={160} className="object-cover w-full h-40" />
                                ) : (
                                    <div className="h-40 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                                        Ajouter votre carte d'identité
                                    </div>
                                )
                            ) : (
                                <div className="h-40 bg-gray-100 animate-pulse rounded-md" />
                            )}
                        </div>
                        <button onClick={updateCardImage} className="mt-2 p-1 text-sm bg-[#a06a50]/50  hover:bg-[#a06a50] text-white rounded w-full">
                            Mettre à jour la CNI
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
