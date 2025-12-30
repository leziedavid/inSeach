"use client";

import Image from "next/image";
import { Heart, MapPin, SlidersHorizontal, Star } from "lucide-react";
import { useState } from "react";

const listings = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    title: i % 2 === 0 ? "Kollam, India" : "Kozhikode, India",
    subtitle: "Kollam beach",
    dates: "9–15 Jan",
    price: "2,568₣",
    rating: 4.79,
    image: `https://picsum.photos/seed/airbnb${i}/600/400`,
    badge: "Guest favourite",
}));

export default function ListeData() {
    const [mapOpen, setMapOpen] = useState(false);

    return (
        <>

            <div className="space-y-6">
                {listings.map((item) => (
                    <div key={item.id} className="flex gap-4 border rounded-2xl p-3 hover:shadow-sm transition"  >
                        <div className="relative w-40 h-28 rounded-xl overflow-hidden">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                            <span className="absolute top-2 left-2 bg-white text-xs px-2 py-0.5 rounded-full">
                                {item.badge}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <Heart className="w-4 h-4" />
                                </div>
                                <p className="text-sm text-neutral-500">{item.subtitle}</p>
                                <p className="text-sm text-neutral-500">{item.dates}</p>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 fill-black" />
                                    {item.rating}
                                </div>
                                <div className="font-semibold">{item.price}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>

    );
}
