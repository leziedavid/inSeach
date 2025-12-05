// utils/geolocation.ts
import { reverseGeocode } from "@/services/securityService";

export interface GeoLocationResult {
    lat: number | null;
    lng: number | null;
    country?: string | null;
    city?: string | null;
    district?: string | null;
    street?: string | null;
    error?: string | null;
    source?: 'gps' | 'ip';
}

export interface GeoLocationOptions {
    onPermissionDenied?: () => void;
    maxAttempts?: number;
    retryDelay?: number;
}

// 🔹 Fonction principale avec fallback GPS → IP
export const getUserLocation = async (opts?: GeoLocationOptions): Promise<GeoLocationResult> => {
    const maxAttempts = opts?.maxAttempts ?? 3;
    const retryDelay = opts?.retryDelay ?? 2000;

    // Tentative GPS
    const gpsResult = await tryGPSLocation(maxAttempts, retryDelay, opts);

    if (gpsResult.lat !== null && gpsResult.lng !== null) {
        return { ...gpsResult, source: 'gps' };
    }

    // Fallback : géolocalisation par IP
    console.warn("GPS indisponible, utilisation de la géolocalisation IP...");
    const ipResult = await tryIPLocation();

    return ipResult;
};

// 🔹 Tentative de géolocalisation GPS
const tryGPSLocation = async (
    maxAttempts: number,
    retryDelay: number,
    opts?: GeoLocationOptions
): Promise<GeoLocationResult> => {
    if (!navigator.geolocation) {
        return {
            lat: null,
            lng: null,
            error: "Navigateur incompatible avec la géolocalisation"
        };
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const position = await getGPSPosition();

            // ✅ Comme tu voulais
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            console.log(`✅ GPS obtenu (tentative ${attempt}):`, { lat, lng });

            // ✅ On passe lat/lng à reverseGeocode
            return await processCoordinates(lat, lng);

        } catch (error: any) {
            if (error.code === error.PERMISSION_DENIED) {
                opts?.onPermissionDenied?.();
                return {
                    lat: null,
                    lng: null,
                    error: "Permission de localisation refusée"
                };
            }

            if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
                console.warn(`⚠️ GPS échoué (tentative ${attempt}/${maxAttempts})`);

                if (attempt < maxAttempts) {
                    await delay(retryDelay);
                    continue;
                }
            }

            return {
                lat: null,
                lng: null,
                error: `Erreur GPS: ${error.message}`
            };
        }
    }

    return {
        lat: null,
        lng: null,
        error: "GPS indisponible après plusieurs tentatives"
    };
};

// 🔹 Fallback : géolocalisation par IP
const tryIPLocation = async (): Promise<GeoLocationResult> => {
    try {
        // ✅ On récupère lat/lng depuis l'IP
        const { lat, lng } = await getLocationByIP();

        console.log("📍 Coordonnées IP obtenues:", { lat, lng });

        // ✅ On passe lat/lng à reverseGeocode (comme pour GPS)
        return await processCoordinates(lat, lng, 'ip');

    } catch (error: any) {
        return {
            lat: null,
            lng: null,
            error: "Impossible de récupérer la localisation (GPS et IP échoués)",
            source: 'ip'
        };
    }
};

// 🔹 Fonction commune pour traiter lat/lng et faire reverseGeocode
const processCoordinates = async (
    lat: number,
    lng: number,
    source: 'gps' | 'ip' = 'gps'
): Promise<GeoLocationResult> => {
    try {
        // ✅ On utilise ton service NestJS
        const data = await reverseGeocode(lat, lng);

        return {
            lat,
            lng,
            country: data?.address?.country || null,
            city: data?.address?.state ||
                data?.address?.city ||
                data?.address?.town ||
                data?.address?.village || null,
            district: data?.address?.road ||
                data?.address?.suburb ||
                data?.address?.neighbourhood || null,
            street: data?.address?.neighbourhood || null,
            source,
            error: null,
        };
    } catch (err) {
        return {
            lat,
            lng,
            source,
            error: "Impossible de récupérer l'adresse via reverse-geocoding"
        };
    }
};

// 🔹 Récupération des coordonnées via IP
const getLocationByIP = async (): Promise<{ lat: number; lng: number }> => {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('IP geolocation failed');

    const data = await res.json();

    // ✅ On retourne uniquement lat/lng (comme position.coords)
    return {
        lat: data.latitude,
        lng: data.longitude,
    };
};

// 🔹 Helper : promisify GPS
const getGPSPosition = (): Promise<GeolocationPosition> =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    });

// 🔹 Helper : délai entre tentatives
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));