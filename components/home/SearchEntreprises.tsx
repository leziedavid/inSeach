"use client";

import { useState } from "react";

interface Company {
    name: string;
    description: string;
    domain: string;
    location?: string;
    website?: string;
    size?: string;
    specialization?: string;
}

export default function SearchEntreprises() {
    const [searchTerm, setSearchTerm] = useState("");
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            setError("Veuillez entrer un domaine ou type d’entreprise");
            return;
        }

        setIsLoading(true);
        setError("");
        setCompanies([]);

        try {
            const res = await fetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ searchTerm, mode: "entreprises" }),
            });

            if (!res.ok) throw new Error("Erreur recherche");

            const data = await res.json();
            setCompanies(data.companies || []);
        } catch (err) {
            setError("Une erreur est survenue, veuillez réessayer.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg">

            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mt-4 w-full"  >
                {/* INPUT AVEC ICÔNE */}
                <div className="relative w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500"  >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <input type="text" value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)}  placeholder="Ex: fintech, confection sacs, IA, logistique..."  disabled={isLoading} 
                    className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border rounded-md  text-sm md:text-base  text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700  transition "  />
                </div>

                {/* BOUTON */}
                <button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary text-white px-8 md:px-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base whitespace-nowrap disabled:opacity-50" >
                    {isLoading ? "Recherche..." : "Rechercher →"}
                </button>
            </form>


            {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

            {companies.length > 0 && (
                <div className="w-full mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-lg transition">
                            <h3 className="text-xl font-bold mb-2">{company.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{company.description}</p>
                            <div className="space-y-1 text-sm">
                                <p><strong>Domaine :</strong> {company.domain}</p>
                                {company.location && <p><strong>Lieu :</strong> {company.location}</p>}
                                {company.size && <p><strong>Taille :</strong> {company.size}</p>}
                                {company.specialization && <p><strong>Spécialité :</strong> {company.specialization}</p>}
                            </div>
                            {company.website && (
                                <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-black font-medium underline">
                                    Visiter le site →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}


        </div>
    );
}
