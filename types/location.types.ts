import { UserLocation } from "./interfaces";

export type LocationServiceStatus =
    | "success"
    | "permission-denied"
    | "network-error"
    | "unknown-error";

export interface LocationServiceResult {
    status: LocationServiceStatus;
    location: UserLocation | null;
}
