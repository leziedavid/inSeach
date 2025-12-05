"use client";

import Image from "next/image";

export default function Erreurs() {
    return (
        <div className="flex items-center justify-center">
            <div className="text-center">
                <div className="flex justify-center animate-zoom-in">
                    <Image src="/errors.svg" alt="Illustration" width={180} height={180}  className="rounded-xl drop-shadow-sm select-none"
                    />
                </div>
            </div>
        </div>
    );
}
