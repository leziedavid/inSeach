"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeScreen() {


    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(5);

    const handleSkip = () => {
        router.replace("/welcome");
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/welcome");
        }, 5000);

        const countdown = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdown);
        };
    }, [router]);

    return (
        <div className="h-screen overflow-hidden flex flex-col items-center justify-center bg-[#FAF3E8] px-4 py-12">

            <div className="flex flex-col items-center p-8 w-full max-w-md  animate-fade-in " >

                {/* Illustration */}
                <div className="flex justify-center animate-zoom-in">
                    <Image src="/homeScreen.png" alt="Illustration" width={250} height={250} className="rounded-xl drop-shadow-sm select-none" />
                </div>

                {/* Logo / Recherche */}
                <div className="relative flex items-center mt-4 animate-slide-up">
                    <Search className="absolute -top-6 left-3 w-8 h-8 text-[#b07b5e] animate-pulse animate-bounce" />
                    <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#b07b5e] to-[#155e75] font-black text-4xl tracking-tight select-none  drop-shadow-sm  "  >
                        inSeach
                    </h1>
                </div>

                {/* Texte */}
                <div className="mt-8 text-center animate-slide-up space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900 leading-snug">
                        Reliez vos services<br />à la bonne clientèle.
                    </h2>

                    <p className="text-gray-600 text-base max-w-xs mx-auto leading-relaxed">
                        InSerch est une plateforme conviviale qui facilite
                        l’interaction entre les clients et les professionnels.
                    </p>
                </div>

                {/* Button */}
                <div className="w-full mt-8 animate-fade-in">
                    <Button onClick={handleSkip} className="  w-full bg-gradient-to-r from-[#b07b5e] to-[#155e75]  hover:opacity-90 transition-all duration-300  text-white font-semibold py-5 rounded-xl text-lg  flex items-center justify-center gap-2 shadow-sm  hover:scale-[1.02] active:scale-[0.98]   "  >
                        <Search className="animate-bounce" size={20} /> Commencer
                    </Button>
                </div>



                <div className="text-center text-[10px] text-gray-500 mt-6">
                    <p>Version 1.0.0</p>
                    <p className="mt-0.5">© 2025 inSeach. Tous droits réservés.</p>
                </div>
                
            </div>

        </div>
    );
}
