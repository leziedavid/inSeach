// lib/location.ts

export interface DetectedLocation {
    country: string;
    city?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    source: "gps" | "ip";
}

/**
 * Détecte la localisation complète de l'utilisateur
 * - Essaie d'abord le GPS du navigateur (précis)
 * - Fallback via IP si refusé ou erreur
 * @param onError (optionnel) — callback en cas d'erreur
 * @param onSuccess (optionnel) — callback en cas de succès
 * @returns {Promise<DetectedLocation | null>}
 */
export async function detectLocationComplete(
    onError?: (message: string) => void,
    onSuccess?: (message: string) => void
): Promise<DetectedLocation | null> {
    let attempts = 0;
    const maxAttempts = 3;

    // ===========================
    // Étape 1 : GPS du navigateur
    // ===========================
    const tryNavigatorGPS = (): Promise<DetectedLocation | null> => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve(null);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    try {
                        // On récupère le pays depuis une API de reverse-geocoding
                        const geoRes = await fetch(
                            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
                        );
                        const geoData = await geoRes.json();
                        console.log("🚀 GeoData:", geoData.countryName);
                        if (geoData?.countryName) {
                            const location: DetectedLocation = {
                                country: geoData.countryName,
                                city: geoData.city || geoData.locality,
                                region: geoData.principalSubdivision,
                                latitude,
                                longitude,
                                source: "gps",
                            };

                            if (onSuccess)
                                onSuccess(`Localisation GPS détectée : ${geoData.countryName} ✅`);
                            resolve(location);
                        } else {
                            resolve(null);
                        }
                    } catch (geoError) {
                        console.warn("Erreur reverse-geocoding GPS:", geoError);
                        resolve(null);
                    }
                },
                (err) => {
                    console.warn("Erreur GPS navigateur:", err);
                    resolve(null);
                },
                { timeout: 7000 }
            );
        });
    };

    // ===========================
    // Étape 2 : Détection via IP
    // ===========================
    const tryIpApi = async (): Promise<DetectedLocation | null> => {
        attempts++;

        try {
            const response = await fetch("https://ipapi.co/json/");
            const data = await response.json();

            if (data?.country_name) {
                const location: DetectedLocation = {
                    country: data.country_name,
                    city: data.city,
                    region: data.region,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    source: "ip",
                };

                if (onSuccess)
                    onSuccess(`Localisation détectée via IP : ${data.country_name} ✅`);

                return location;
            }
        } catch (err) {
            console.error("Erreur détection IP:", err);
            if (attempts < maxAttempts) return await tryIpApi();
            if (onError)
                onError("Localisation désactivée après plusieurs échecs ❌");
        }

        return null;
    };

    // ===========================
    // Process global avec fallback
    // ===========================
    const gpsLocation = await tryNavigatorGPS();
    if (gpsLocation) return gpsLocation;
    // Fallback IP si GPS échoue
    return await tryIpApi();
}
