'use client';

import { Slider } from '@/types/interfaces';
import React, { useState, useEffect, useRef } from 'react';

export interface SliderProps {
    Sliders?: Slider[];
}

const MySlider: React.FC<SliderProps> = ({ Sliders = [] }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [isTransitioning, setIsTransitioning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const defaultSliders: Slider[] = [
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
        }
    ];

    const SlidersData = Sliders.length > 0 ? Sliders : defaultSliders;

    // PRÉCHARGEMENT DES IMAGES
    useEffect(() => {
        const preloadImages = () => {
            SlidersData.forEach((slider) => {
                const img = new Image();
                img.src = slider.image || '/assets/default-bg.jpg';
                img.onload = () => {
                    setLoadedImages(prev => new Set(prev).add(slider.image || '/assets/default-bg.jpg'));
                };
            });
        };

        preloadImages();
    }, [SlidersData]);

    // AUTO SLIDE OPTIMISÉ
    useEffect(() => {
        const startAutoSlide = () => {
            intervalRef.current = setInterval(() => {
                if (!isTransitioning) {
                    setCurrentIndex((p) => (p === SlidersData.length - 1 ? 0 : p + 1));
                }
            }, 3500);
        };

        startAutoSlide();
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [SlidersData.length, isTransitioning]);

    // GESTION DE LA TRANSITION
    const handleTransition = (callback: () => void) => {
        if (isTransitioning) return;
        
        setIsTransitioning(true);
        callback();
        
        setTimeout(() => {
            setIsTransitioning(false);
        }, 700); // Durée de la transition CSS
    };

    const nextSlide = () => {
        handleTransition(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === SlidersData.length - 1 ? 0 : prevIndex + 1
            );
        });
    };

    const prevSlide = () => {
        handleTransition(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? SlidersData.length - 1 : prevIndex - 1
            );
        });
    };

    return (
        <>
            <div className="relative overflow-hidden w-full h-[210px] rounded-xl shadow-md">

                {/* SLIDER */}
                <div 
                    className="flex transition-transform duration-700 ease-out will-change-transform"
                    style={{ 
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {SlidersData.map((Slider, index) => {
                        const imageUrl = Slider.image || '/assets/default-bg.jpg';
                        const isImageLoaded = loadedImages.has(imageUrl);
                        
                        // Précharger les images adjacentes
                        const shouldRender = Math.abs(index - currentIndex) <= 1 || 
                                            (currentIndex === 0 && index === SlidersData.length - 1) ||
                                            (currentIndex === SlidersData.length - 1 && index === 0);

                        return (
                            <div 
                                key={Slider.id} 
                                className="w-full flex-shrink-0 h-[210px] md:h-[310px] lg:h-[390px] xl:h-[430px] relative"
                            >
                                {/* LOADING PLACEHOLDER */}
                                {!isImageLoaded && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse rounded-xl" />
                                )}

                                {/* BACKGROUND IMAGE - Optimisé */}
                                {shouldRender && (
                                    <div 
                                        className={`absolute inset-0 bg-cover bg-center rounded-xl dark:brightness-90 transition-opacity duration-300 ${
                                            isImageLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                        style={{
                                            backgroundImage: `url(${imageUrl})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            imageRendering: 'crisp-edges',
                                        }}
                                    />
                                )}

                                {/* OVERLAY */}
                                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 rounded-xl" />

                                {/* TEXT CONTENT */}
                                <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">

                                    {/* TITRE */}
                                    <h3 className="font-bold text-lg md:text-3xl drop-shadow-md">
                                        {Slider.name}
                                    </h3>

                                    {/* SOUS-TITRE */}
                                    <p className="text-sm md:text-xl opacity-90 -mt-1">
                                        {Slider.specialty}
                                    </p>

                                    {/* RATING */}
                                    <div className="flex items-center mt-1">
                                        {/* STARS */}
                                        <div className="flex">
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-base md:text-2xl ${
                                                        index < Slider.rating ? 'text-yellow-400' : 'text-gray-300'
                                                    }`}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>

                                        {/* NOTE */}
                                        <span className="text-xs md:text-lg ml-2 opacity-90">
                                            {Slider.rating} ({Slider.reviews})
                                        </span>
                                    </div>

                                    {/* CTA */}
                                    {Slider.isToday && (
                                        <button className="mt-3 w-[120px] bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs py-1.5 md:text-base md:py-3 rounded-lg transition">
                                            Book Now
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* NAV BUTTONS */}
                {SlidersData.length > 1 && (
                    <>
                        <button 
                            onClick={prevSlide}
                            disabled={isTransitioning}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/60 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md p-2 rounded-full opacity-40 hover:opacity-90 transition disabled:opacity-20"
                        >
                            <svg className="w-5 h-5 text-white dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button 
                            onClick={nextSlide}
                            disabled={isTransitioning}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/60 dark:bg-black/30 dark:hover:bg-black/50 backdrop-blur-md p-2 rounded-full opacity-40 hover:opacity-90 transition disabled:opacity-20"
                        >
                            <svg className="w-5 h-5 text-white dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}

                {/* INDICATEURS DE SLIDES */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {SlidersData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isTransitioning) {
                                    handleTransition(() => setCurrentIndex(index));
                                }
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                index === currentIndex 
                                    ? 'w-8 bg-white' 
                                    : 'w-1.5 bg-white/50 hover:bg-white/70'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default MySlider;