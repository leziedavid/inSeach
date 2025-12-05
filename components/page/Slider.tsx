'use client';

import { Slider } from '@/types/interfaces';
import React, { useState, useEffect } from 'react';

export interface SliderProps {
    Sliders?: Slider[];
}

const MySlider: React.FC<SliderProps> = ({ Sliders = [] }) => {

    const [currentIndex, setCurrentIndex] = useState(0);

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

    // AUTO SLIDE
    useEffect(() => {
        const interval = setInterval(() => { setCurrentIndex((p) => (p === SlidersData.length - 1 ? 0 : p + 1)); }, 3500);
        return () => clearInterval(interval);
    }, [SlidersData.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === SlidersData.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? SlidersData.length - 1 : prevIndex - 1
        );
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`text-base ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </span>
        ));
    };

    return (
        <>
            <div className=" relative overflow-hidden w-full h-[210px] rounded-xl shadow-md ">

                {/* SLIDER  md:h-[300px]  lg:h-[380px] xl:h-[420px]*/}
                <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }} >
                    {SlidersData.map((Slider) => (

                        <div key={Slider.id} className="  w-full flex-shrink-0 h-[210px] md:h-[310px] lg:h-[390px] xl:h-[430px]  relative "  >

                            {/* BACKGROUND IMAGE */}
                            <div className=" absolute inset-0 bg-cover bg-center rounded-xl   dark:brightness-90 "
                                style={{
                                    backgroundImage: `url(${Slider.image || '/assets/default-bg.jpg'})`,
                                }} />

                            {/* OVERLAY */}
                            <div className=" absolute inset-0 bg-black/40 dark:bg-black/60 rounded-xl " />


                            {/* TEXT CONTENT */}
                            <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">

                                {/* TITRE */}
                                <h3 className="
        font-bold 
        text-lg        /* mobile */
        md:text-3xl    /* desktop : beaucoup plus gros */
        drop-shadow-md
    ">
                                    {Slider.name}
                                </h3>

                                {/* SOUS-TITRE */}
                                <p className="
        text-sm        /* mobile */
        md:text-xl     /* desktop */
        opacity-90 -mt-1
    ">
                                    {Slider.specialty}
                                </p>

                                {/* RATING */}
                                <div className="flex items-center mt-1">

                                    {/* STARS */}
                                    <div className="flex">
                                        {Array.from({ length: 5 }, (_, index) => (
                                            <span
                                                key={index}
                                                className={`
                        text-base md:text-2xl     /* ★ plus gros sur web */
                        ${index < Slider.rating ? 'text-yellow-400' : 'text-gray-300'}
                    `}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>

                                    {/* NOTE */}
                                    <span className="
            text-xs        /* mobile */
            md:text-lg     /* desktop */
            ml-2 opacity-90
        ">
                                        {Slider.rating} ({Slider.reviews})
                                    </span>
                                </div>

                                {/* CTA */}
                                {Slider.isToday && (
                                    <button className="
            mt-3 
            w-[120px] 
            bg-white/20 hover:bg-white/30 
            backdrop-blur-md 
            text-white 
            text-xs py-1.5      /* mobile */
            md:text-base md:py-3 /* desktop : plus haut + plus lisible */
            rounded-lg 
            transition
        ">
                                        Book Now
                                    </button>
                                )}
                            </div>


                        </div>
                        
                    ))}
                </div>

                {/* NAV BUTTONS */}
                {SlidersData.length > 1 && (
                    <>
                        <button onClick={prevSlide} className="  absolute left-2 top-1/2 -translate-y-1/2  bg-white/20 hover:bg-white/60  dark:bg-black/30 dark:hover:bg-black/50   backdrop-blur-md   p-2 rounded-full   opacity-40 hover:opacity-90 transition " >
                            <svg className="w-5 h-5 text-white dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button onClick={nextSlide} className=" absolute right-2 top-1/2 -translate-y-1/2  bg-white/20 hover:bg-white/60  dark:bg-black/30 dark:hover:bg-black/50  backdrop-blur-md   p-2 rounded-full opacity-40 hover:opacity-90 transition "  >
                            <svg className="w-5 h-5 text-white dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

        </>
    );
};

export default MySlider;
