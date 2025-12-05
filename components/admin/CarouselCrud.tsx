"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Slider } from "@/types/interfaces";
import { Button } from "../ui/button";
import Image from "next/image";


interface CarouselCRUDProps<T extends Slider> {
    items: T[];
    onAdd: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleVisibility: (id: string) => void;
    onReorder: (items: T[]) => void;
    handleNextPage: () => void;
    handlePreviousPage: () => void;
    currentPage: number;
    totalItems: number;
    itemsPerPage?: number;
}

export default function CarouselCRUD<T extends Slider>({
    items,
    onAdd,
    onEdit,
    onDelete,
    onToggleVisibility,
    onReorder,
    handleNextPage,
    handlePreviousPage,
    currentPage,
    totalItems,
    itemsPerPage = 10,

}: CarouselCRUDProps<T>) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const moveItem = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= items.length) return;
        const newItems = [...items];
        const [moved] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, moved);
        onReorder(newItems);
    };

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % items.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

    const renderStars = (rating: number = 0) => (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
            ))}
        </div>
    );

    const currentItem = items[currentIndex];

    return (
        <div className="w-full p-6 flex flex-col gap-8">

            <div className="relative bg-gray-50 rounded-xl p-8 mb-3">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Aperçu du Carousel</h3>

                    {items.length > 0 ? (
                        <div className="relative overflow-hidden rounded-lg ">
                            {/* Navigation arrows */}
                            <button onClick={prevSlide} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full z-10 transition-all"  >
                                <ChevronLeft size={24} />
                            </button>

                            <button onClick={nextSlide} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full z-10 transition-all" >
                                <ChevronRight size={24} />
                            </button>

                            {/* Carousel content */}
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    {/* Image du médecin */}
                                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                                        {currentItem.image ? (
                                            <Image
                                                src={currentItem.image || "/assets/default-bg.jpg"}
                                                alt="avatar"
                                                width={128}
                                                height={128}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-[#b07b5e] text-2xl font-semibold">
                                                {currentItem.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                        )}
                                    </div>

                                    {/* Informations du médecin */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="mb-3">
                                            <h4 className="text-2xl font-bold text-gray-900 mb-1">
                                                {currentItem.name}
                                            </h4>
                                            <p className="text-lg text-[#b07b5e] font-semibold">
                                                {currentItem.specialty}
                                            </p>
                                        </div>

                                        {/* Rating et avis */}
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                                            {renderStars(currentItem.rating)}
                                            <span className="text-gray-600">
                                                ({currentItem.reviews} avis)
                                            </span>
                                        </div>

                                        {/* Date et badge Today */}
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentItem.isToday
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {currentItem.date}
                                            </span>
                                            {currentItem.isToday && (
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    Disponible aujourd'hui
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Indicateurs de slide */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {items.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Aucun médecin dans le carousel. Cliquez sur "Ajouter un Médecin" pour commencer.
                        </div>
                    )}
                </div>
            </div>


            {/* Liste des éléments avec pagination */}
            <div className="bg-gray-10 rounded-xl p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Liste des Médecins</h3>
                    <button onClick={onAdd} className="flex items-center gap-2 bg-[#b07b5e] text-white px-4 py-2 rounded hover:bg-text-[#b07b5e]/50">
                        <Plus size={20} /> Ajouter
                    </button>
                </div>

                {items.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <Plus size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Aucun médecin</p>
                        <button onClick={onAdd} className="text-[#b07b5e] hover:text-[#b07b5e]/50 mt-2">Ajouter votre premier médecin</button>
                    </div>
                )}

                {items.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-100">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="flex flex-col gap-1">
                                <button onClick={() => moveItem(index, index - 1)} disabled={index === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronLeft size={16} /></button>
                                <button onClick={() => moveItem(index, index + 1)} disabled={index === items.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronRight size={16} /></button>
                            </div>
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                {item.image ? (
                                    <Image  src={item.image || "/assets/default-bg.jpg"}  alt={item.name}  width={48}  height={48}  className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-sm font-semibold text-[#b07b5e]">
                                        {item.name.split(" ").map(n => n[0]).join("")}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{item.name}</span>
                                    {!item.isVisible && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Masqué</span>}
                                    {item.isToday && <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Aujourd'hui</span>}
                                </div>
                                <p className="text-gray-600">{item.specialty}</p>
                                <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                                    {renderStars(item.rating)}
                                    <span>({item.reviews})</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            <button onClick={() => onToggleVisibility(item.id)} className={`p-1 rounded ${item.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {item.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            <button onClick={() => onEdit(item.id)} className="p-1 bg-blue-100 text-[#b07b5e]/50 rounded hover:bg-blue-200"><Edit size={16} /></button>
                            <button onClick={() => onDelete(item.id)} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 py-4">
                    <div className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                        Page {currentPage} sur {Math.ceil(totalItems / itemsPerPage)}
                    </div>

                    <div className="flex justify-center sm:justify-end space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage <= 1}
                            className="text-xs sm:text-sm"
                        >
                            <ChevronLeft className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Précédent</span>
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
                            className="text-xs sm:text-sm"
                        >
                            <span className="hidden sm:inline">Suivant</span>
                            <ChevronRight className="h-4 w-4 sm:ml-1" />
                        </Button>
                    </div>
                </div>

            </div>

        </div>
    );
}
