"use client";

import { Search } from "lucide-react";
import React from "react";

type LogoInSeachProps = {
    size?: number;
    colorFrom?: string;
    colorTo?: string;
    iconColor?: string;
    isOpen?: boolean; // Nouvelle prop
};

export const LogoInSeach: React.FC<LogoInSeachProps> = ({
    size = 32,
    colorFrom = "#b07b5e",
    colorTo = "#155e75",
    iconColor = "#b07b5e",
    isOpen = true, // par défaut ouvert
}) => {
    const textSize = `${size}px`;
    const iconSize = size * 0.7;
    const iconOffsetY = size * 0.12;

    return (
        <div className="flex items-center gap-1 select-none">
            {/* ICONE */}
            <Search
                style={{
                    width: iconSize,
                    height: iconSize,
                    color: iconColor,
                    transform: `translateY(${iconOffsetY}px)`,
                }}
            />

            {/* TEXTE CONDITIONNEL */}
            <span
                className="font-extrabold tracking-wide"
                style={{
                    fontSize: textSize,
                    backgroundImage: `linear-gradient(to right, ${colorFrom}, ${colorTo})`,
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                }}
            >
                {isOpen ? "inSeach" : "In"}
            </span>
        </div>
    );
};
