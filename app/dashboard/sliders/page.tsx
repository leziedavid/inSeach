"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Slider, User } from "@/types/interfaces";
import CarouselCRUD from "@/components/admin/CarouselCrud";

// Données par défaut des sliders
export const defaultSliders: Slider[] = [
    {
        id: '1',
        name: 'Dr. Jesmin',
        specialty: 'Cardiologist Specialist',
        rating: 5,
        reviews: 2045,
        date: 'Today',
        isToday: true,
        image: '/slider/slider1.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVisible: true,
    },
    {
        id: '2',
        name: 'Dr. Jessick',
        specialty: 'Cardiologist Specialist',
        rating: 1,
        reviews: 204,
        date: 'Yesterday',
        image: '/slider/slider2.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVisible: true,
    },
    {
        id: '3',
        name: 'Dr. Mollicka',
        specialty: 'Cardiologist Specialist',
        rating: 1,
        reviews: 204,
        date: 'Yesterday',
        image: '/slider/slider3.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVisible: false,
    },
    {
        id: '4',
        name: 'Dr. Krisna',
        specialty: 'Cardiologist Specialist',
        rating: 1,
        reviews: 204,
        date: 'Yesterday',
        image: '/slider/slider2.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVisible: true,
    }
];

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [isReady, setIsReady] = useState(false);

    // État pour les sliders
    const [sliders, setSliders] = useState<Slider[]>([]);

    // Simuler le chargement
    useEffect(() => {
        setIsReady(false);
        const timer = setTimeout(() => {
            setSliders(defaultSliders);
            setTotalItems(defaultSliders.length);
            setIsReady(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleNextPage = () => {
        if (currentPage * limit < totalItems) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleDelete = async (item: User) => { };

    const handleUpdate = (user: User) => { };

    const handleDeleteMultiple = (user: User[]) => {
        console.log("🧹 Supprimer plusieurs:", user);
    };

    // Handlers pour le CRUD des sliders
    const handleAddSlider = () => {
        console.log('Ajouter un nouveau slider');
        const newSlider: Slider = {
            id: Date.now().toString(),
            name: 'Nouveau Docteur',
            specialty: 'Spécialiste',
            rating: 5,
            reviews: 0,
            date: 'Today',
            isToday: true,
            image: '/slider/default.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isVisible: true
        };
        setSliders(prev => [...prev, newSlider]);
    };

    const handleEditSlider = (id: string) => {
        console.log('Éditer le slider:', id);
        const sliderToEdit = sliders.find(slider => slider.id === id);
        if (sliderToEdit) {
            // Implémentez votre logique d'édition ici
            console.log('Slider à éditer:', sliderToEdit);
            // Exemple: ouvrir un modal d'édition
        }
    };

    const handleDeleteSlider = (id: string) => {
        console.log('Supprimer le slider:', id);
        setSliders(prev => prev.filter(slider => slider.id !== id));
    };

    const handleToggleSliderVisibility = (id: string) => {
        setSliders(prev =>
            prev.map(slider =>
                slider.id === id ? { ...slider, isVisible: !slider.isVisible } : slider
            )
        );
    };

    const handleReorderSliders = (newSliders: Slider[]) => {
        setSliders(newSliders);
    };

    // Adapter les données Slider au format attendu par CarouselCRUD
    const carouselItems = sliders.map(slider => ({
        id: slider.id,
        title: slider.name,
        author: slider.specialty,
        currentBid: `${slider.rating}★ (${slider.reviews} avis)`,
        isVisible: slider.isVisible || false,
        imageUrl: slider.image,
        // Données supplémentaires pour l'affichage
        rating: slider.rating,
        reviews: slider.reviews,
        date: slider.date,
        isToday: slider.isToday
    }));

    if (!isReady) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="loader border-4 border-b-4 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-full mx-auto px-4 py-12">
                {/* En-tête de la page */}
                <div className="w-full p-4">
                    <h1 className="text-3xl font-bold mb-2">Gestion des Sliders</h1>
                    <p className="text-gray-600">
                        Gérez le contenu de votre carousel de médecins - Ajoutez, modifiez ou réorganisez les éléments
                    </p>
                </div>

                {/* Contenu principal avec le composant CarouselCRUD */}
                <div className="w-full p-4">
                    <CarouselCRUD<Slider>
                        items={sliders}
                        onAdd={handleAddSlider}
                        onEdit={handleEditSlider}
                        onDelete={handleDeleteSlider}
                        onToggleVisibility={handleToggleSliderVisibility}
                        onReorder={handleReorderSliders}
                        handleNextPage={handleNextPage}
                        handlePreviousPage={handlePreviousPage}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={limit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}