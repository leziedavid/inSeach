"use client";

import React, { useState } from 'react';
import { MessageSquare, PlusCircle, Settings, Search, Sparkles, ChevronRight, LucideIcon } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import CardContent from '@/components/admin/CardContent';
import Overview from '@/components/admin/Overview';

interface SuggestionCard {
    icon: LucideIcon;
    title: string;
    description: string;
}

// Main App Component
const ClaudeDashboard: React.FC = () => {

    const suggestionCards: SuggestionCard[] = [
        {
            icon: Sparkles,
            title: "Créer un projet web",
            description: "Aide-moi à créer une application web moderne avec React et Tailwind CSS"
        },
        {
            icon: MessageSquare,
            title: "Analyser du code",
            description: "Révise mon code et suggère des améliorations pour les performances et la lisibilité"
        },
        {
            icon: Search,
            title: "Recherche d'informations",
            description: "Trouve et synthétise les dernières informations sur un sujet spécifique"
        },
        {
            icon: Settings,
            title: "Résoudre un problème",
            description: "Debug et résous les problèmes techniques dans mon application"
        }
    ];

    const handleCardClick = (title: string): void => {
        console.log(`Clicked: ${title}`);
    };

    return (
        <AdminLayout>
            <div className="max-w-full mx-auto px-4 py-12">
                <Overview />
            </div>
        </AdminLayout>
    );
};

export default ClaudeDashboard;