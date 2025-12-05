// utils/geolocation.ts
export interface GeoLocationResult {
    lat: number | null;
    lng: number | null;
    country?: string | null;
    city?: string | null;
    district?: string | null;
    street?: string | null;
    error?: string | null;
}

export interface GeoLocationOptions {
    onPermissionDenied?: () => void; // → pour afficher une alerte
}

export const getUserLocation = async (opts?: GeoLocationOptions): Promise<GeoLocationResult> => {

    if (!navigator.geolocation) {
        return {
            lat: null,
            lng: null,
            error: "Votre navigateur ne supporte pas la géolocalisation.",
        };
    }

    const getPosition = (): Promise<GeolocationPosition> =>  new Promise((resolve, reject) => {
        
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            });
        });

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            const position = await getPosition();
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
                );
                const data = await response.json();

                return {
                    lat,
                    lng,
                    country: data?.address?.country || null,
                    city:
                        data?.address?.state ||
                        data?.address?.city ||
                        data?.address?.town ||
                        data?.address?.village ||
                        null,
                    district:
                        data?.address?.road ||
                        data?.address?.suburb ||
                        data?.address?.neighbourhood ||
                        null,
                    street: data?.address?.neighbourhood || null,
                    error: null,
                };
            } catch (err) {
                return { lat, lng, error: "Impossible de récupérer l’adresse via reverse-geocoding" };
            }

        } catch (error: any) {
            // Gestion des erreurs
            if (error.code === error.PERMISSION_DENIED) {
                if (opts?.onPermissionDenied) opts.onPermissionDenied();
                return { lat: null, lng: null, error: "Vous devez autoriser la localisation pour continuer." };
            }
            if (error.code === error.POSITION_UNAVAILABLE) {
                console.warn("Position introuvable, réessai…", attempts);
                await new Promise((r) => setTimeout(r, 2000)); // 2 secondes
                continue;
            }
            if (error.code === error.TIMEOUT) {
                console.warn("Timeout géolocalisation, réessai…", attempts);
                continue;
            }
            return { lat: null, lng: null, error: "Erreur inconnue de géolocalisation" };
        }
    }

    return { lat: null, lng: null, error: "Impossible de récupérer la position après plusieurs tentatives." };
};

