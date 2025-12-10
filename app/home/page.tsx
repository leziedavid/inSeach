"use client";

import FullPageLoader from '@/components/home/FullPageLoader';
import Home from '@/components/home/Home';
import { useEffect, useState } from 'react';


export default function Page() {

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string>(" Chargement...");

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 5000);
        return () => clearTimeout(timer);

    }, []);

    return (

        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
            {loading && <FullPageLoader status={status} />}

            {!loading && (

                <Home />
            )}
        </div>
    );
}