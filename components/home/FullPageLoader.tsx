"use client";

import { useEffect, useState } from "react";

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
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-50">
            {/* Cercle loader */}
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-bg-[#b07b5e] border-t-[#b07b5e] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-4xl text-[#b07b5e]">
                    In
                </div>
            </div>

            {/* Texte status au-dessus */}
            {status && (
                <p className="text-gray-600 text-center mb-4 font-medium">{status}</p>
            )}

        </div>
    );
}
