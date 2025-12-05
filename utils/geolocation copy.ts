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

export const getUserLocation = ( opts?: GeoLocationOptions): Promise<GeoLocationResult> => {
    
    
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            return resolve({
                lat: null,
                lng: null,
                error: "Votre navigateur ne supporte pas la géolocalisation.",
            });
        }

        navigator.geolocation.getCurrentPosition(

            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                try {
                    const response = await fetch( `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}` );

                    const data = await response.json();

                    console.log("🚀 Geolocation:", data);

                    resolve({
                        lat,
                        lng,
                        country: data?.address?.country || null,
                        city:
                            data?.address?.state||
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
                    });
                } catch (err) {
                    resolve({
                        lat,
                        lng,
                        error: "Impossible de récupérer l’adresse via reverse-geocoding",
                    });
                }
            },

            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    // 🔥 Déclenche une alerte si fournie
                    if (opts?.onPermissionDenied) {
                        opts.onPermissionDenied();
                    }
                }

                let message = "Erreur inconnue";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message = "Vous devez autoriser la localisation pour continuer.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message = "La position est introuvable.";
                        break;
                    case error.TIMEOUT:
                        message = "La requête a expiré.";
                        break;
                }

                resolve({
                    lat: null,
                    lng: null,
                    error: message,
                });
            }
        );

    });
};
