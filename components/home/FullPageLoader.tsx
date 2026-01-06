"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface FullPageLoaderProps {
    status?: string;
    duration?: number; // en ms
}

export default function FullPageLoader({ status, duration = 500 }: FullPageLoaderProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (!status) {
            const timer = setTimeout(() => setVisible(false), duration);
            return () => clearTimeout(timer);
        }
    }, [status, duration]);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50">

            {/* Cercle loader */}
            <div className="relative w-24 h-24">
                {/* Cercle animé */}
                <div className="absolute inset-0 rounded-full border-4 border-[#b07b5e]/30 border-t-[#b07b5e] animate-spin" />

                {/* Image centrée */}
                <div className="absolute inset-3 flex items-center justify-center">
                    <Image
                        src="/agent-builder1.gif"
                        alt="Recherche intelligente"
                        width={64}
                        height={64}
                        className="object-contain"
                        priority
                        unoptimized
                    />
                </div>
            </div>

            {/* Texte status */}
            {status && (
                <p className="mt-4 text-center font-medium text-gray-600">
                    {status}
                </p>
            )}
        </div>
    );
}
