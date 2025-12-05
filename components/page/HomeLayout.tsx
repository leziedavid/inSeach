"use client";

import React from "react";

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <main className="min-h-screen bg-[#FAF3E8] relative overflow-hidden">

            <div className=" bg-white h-screen flex flex-col overflow-hidden  /* MOBILE : style app */ w-full max-w-sm mx-auto rounded-3xl shadow-md /* DESKTOP : pleine largeur */ md:max-w-none md:rounded-none md:mx-0 md:shadow-none" >
                {children}
            </div>

        </main>
    );
}
