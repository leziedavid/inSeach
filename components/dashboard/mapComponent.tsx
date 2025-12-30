"use client";

import Image from "next/image";

export default function MapComponent() {
    return (
        <div  className="  bg-white  w-full  rounded-t-2xl md:rounded-2xl overflow-hidden  relative "  >
            {/* Drag handle visuel (optionnel, juste décoratif) */}
            <div className="md:hidden flex justify-center py-2">
                <div className="w-10 h-1.5 bg-gray-300 rounded-full" />
            </div>
            {/* Map */}
            <Image  src="https://maps.googleapis.com/maps/api/staticmap?center=Melbourne&zoom=11&size=800x600"  alt="map"  width={800}  height={600} className="object-cover w-full h-[70vh] md:h-[500px]"  priority  />
        </div>
    );
}
