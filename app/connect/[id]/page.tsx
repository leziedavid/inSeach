"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import FullPageLoader from "@/components/home/FullPageLoader";
import { reconnectUser } from "@/services/securityService";


export default function ConnectPage() {
    const pathname = usePathname();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string>("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!pathname) return;

        const parts = pathname.split("/");
        const userId = parts[2]; // /connect/<userId>

        if (!userId) {
            setStatus("Aucun ID utilisateur fourni.");
            setLoading(false);
            return;
        }

        const reconnect = async () => {
            try {
                setStatus("Connexion en cours...");

                const res = await reconnectUser(userId);
                setStatus("Connexion réussie 🎉");
                setSuccess(true);

                if (res.statusCode === 200) {
                    router.push('/home');
                    return;
                }

            } catch (err: any) {

                console.error(err);
                setStatus(`Erreur : ${err.message}`);

            } finally {
                setLoading(false);
            }
        };

        reconnect();
    }, [pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            {loading && <FullPageLoader status={status} />}

            {!loading && success && (
                <div className="flex flex-col items-center space-y-6">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-4 border-[#155e75] rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-4xl text-[#b07b5e]">
                            In
                        </div>
                    </div>
                    <p className="text-[#155e75] font-semibold text-lg">{status}</p>

                </div>
            )}


        </div>
    );
}
