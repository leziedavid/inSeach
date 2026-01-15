"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { UserLocation } from "@/types/interfaces";

/* -------------------------------------------------------
 * FIX icônes Leaflet (Next.js)
 * -----------------------------------------------------*/
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon.svg",
    iconUrl: "/leaflet/marker-icon.svg",
    shadowUrl: "/leaflet/marker-shadow.png",
});

interface LocationMapProps {
    location?: UserLocation | null;
}

export default function LocationMapClient({ location }: LocationMapProps) {
    if (!location || location.lat == null || location.lng == null) {
        return (
            <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                <MapPin className="w-6 h-6" />
                <span className="ml-2 text-sm">Localisation non disponible</span>
            </div>
        );
    }

    const { lat, lng, street, district, city, country } = location;

    return (
        <div className="h-40 rounded-xl overflow-hidden">
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer  attribution="&copy; OpenStreetMap"   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"  />

                <Marker position={[lat, lng]}>
                    <Popup>
                        <div className="text-sm space-y-0.5">
                            {street && <div>{street}</div>}
                            {district && <div>{district}</div>}
                            {city && <div>{city}</div>}
                            {country && <div>{country}</div>}
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
