import { UserLocation } from "@/types/interfaces";
import { LocationServiceResult } from "@/types/location.types";
import { getUserLocation } from "@/utils/geolocation";


export const askForUserLocation = async (): Promise<LocationServiceResult> => {
    try {
        const data = await getUserLocation({
            onPermissionDenied: () => {
                throw new Error("PERMISSION_DENIED");
            },
        });

        if (data?.error) {
            return {
                status: "network-error",
                location: null,
            };
        }

        const location: UserLocation = {
            lat: data.lat ?? null,
            lng: data.lng ?? null,
            country: data.country ?? null,
            city: data.city ?? null,
            district: data.district ?? null,
            street: data.street ?? null,
        };

        return {
            status: "success",
            location,
        };

    } catch (err) {
        if (err instanceof Error && err.message === "PERMISSION_DENIED") {
            return {
                status: "permission-denied",
                location: null,
            };
        }

        return {
            status: "unknown-error",
            location: null,
        };
    }
};
