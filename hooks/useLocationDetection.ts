// hooks/useLocationDetection.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { detectLocationComplete, DetectedLocation } from "@/lib/location";

export function useLocationDetection(autoDetect = true) {
    
    const [country, setCountry] = useState<string>("");
    const [gps, setGps] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [location, setLocation] = useState<DetectedLocation | null>(null);

    const detect = useCallback(async () => {
        setLoading(true);
        setError(null);

        const loc = await detectLocationComplete(
            (err) => setError(err),
            (msg) => console.log(msg)
        );

        if (loc) {
            setCountry(loc.country);
            setGps(loc.latitude && loc.longitude ? `${loc.latitude}, ${loc.longitude}` : "");
            setLocation(loc);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (autoDetect) detect();
    }, [autoDetect, detect]);

    return {
        country,
        gps,
        location,
        loading,
        error,
        detect,
    };
}
