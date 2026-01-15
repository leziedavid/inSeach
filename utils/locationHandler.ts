// utils/locationHandler.ts
import { MessagesData } from "@/components/home/Messages";
import { askForUserLocation } from "@/services/location";

export interface LocationResult {
    status: 'success' | 'permission-denied' | 'network-error' | 'error';
    location?: any;
    displayLocation?: string;
    messages?: MessagesData[];
}

export const handleLocationRequest = async (
    retryCallback?: () => Promise<void>
): Promise<LocationResult> => {
    const result = await askForUserLocation();

    // Fonction par défaut pour réessayer
    const defaultRetry = async () => {
        return handleLocationRequest(retryCallback);
    };

    switch (result.status) {
        case "success":
            return {
                status: 'success',
                location: result.location,
                displayLocation: `${result.location?.city} – ${result.location?.street}`,
                messages: []
            };

        case "permission-denied":
            return {
                status: 'permission-denied',
                messages: [
                    {
                        id: "geo-001",
                        type: "text" as const, // ← Ici le correctif
                        title: "📍 Localisation obligatoire",
                        message: "Notre application nécessite votre localisation pour fonctionner correctement.",
                        linkText: "Activer la localisation",
                        onClick: retryCallback || defaultRetry
                    },
                ]
            };

        case "network-error":
            return {
                status: 'network-error',
                messages: [
                    {
                        id: "geo-002",
                        type: "text" as const, // ← Ici le correctif
                        title: "📍 Oups une erreur s'est produite",
                        message: "Erreur de réseau, veuillez réessayer.",
                        linkText: "Relancer",
                        onClick: retryCallback || defaultRetry
                    },
                ]
            };

        default:
            return {
                status: 'error',
                messages: [
                    {
                        id: "geo-003",
                        type: "text" as const, // ← Ici le correctif
                        title: "🚨 Erreur inattendue",
                        message: "Une erreur est survenue. Vérifiez votre réseau.",
                        linkText: "Réessayer",
                        onClick: retryCallback || defaultRetry
                    },
                ]
            };
    }
};