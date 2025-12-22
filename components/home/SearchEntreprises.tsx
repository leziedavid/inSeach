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
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mt-4 w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: fintech, confection sacs, IA, logistique..."
                    className="w-full rounded-lg border px-4 py-2 text-sm md:text-base focus:outline-none"
                    disabled={isLoading}
                />
                <button  type="submit"  disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary text-white px-8 md:px-10 py-2 md:py-2.5 rounded-lg text-sm md:text-base whitespace-nowrap disabled:opacity-50" >
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
