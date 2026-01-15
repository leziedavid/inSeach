import dynamic from "next/dynamic";
import { UserLocation } from "@/types/interfaces";

const LocationMapClient = dynamic(
    () => import("./LocationMap.client"),
    {
        ssr: false,
        loading: () => (
            <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                Chargement de la carte…
            </div>
        ),
    }
);

interface LocationMapProps {
    location?: UserLocation | null;
}

export default function LocationMap(props: LocationMapProps) {
    return <LocationMapClient {...props} />;
}
