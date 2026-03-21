'use client';

import Image from "next/image";
import React, { useState } from "react";
import { Product } from "../actions/get-products";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsX } from "react-icons/bs";

const MAX_GRID_IMAGES = 5;

export const GalleryProduct = ({ product }: { product: Product }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalState, setModalState] = useState({ open: false, image: '' })
    const images = [
        product.image,
        ...product.gallery?.map((image) => image.image_url) || [],
    ].filter(Boolean);


    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const openModal = (image: string) => {
        setModalState({ open: true, image })
    }

    const closeModal = () => {
        setModalState({ open: false, image: '' })
    }
    // Pinterest-style layout
    return (
        <>
            {
                modalState.open && (
                    <div className="w-screen h-screen fixed top-0 left-0 z-100 bg-black/20 flex items-center justify-center">
                        <button onClick={closeModal} className="absolute top-10 right-10 z-100 btn btn-error btn-circle">
                            <BsX className="size-5" />
                        </button>
                        <div style={{ width: '1000px', height: '1000px' }} className=" flex items-center justify-center">
                            <Image
                                src={modalState.image}
                                alt={product.name}
                                width={1000}
                                height={1000}
                                quality={100}
                                className="object-contain shadow"
                            />
                        </div>
                    </div>
                )
            }
            <div className="flex flex-col gap-8 lg:w-2/3 w-full">
                {/* Masonry / Grid */}
                <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[250px]">
                    {images.slice(0, MAX_GRID_IMAGES).map((image, index) => {
                        if (!image) return null;

                        // Variación tipo masonry
                        const isLarge = index === 0;
                        const isWide = index === 3;

                        return (
                            <div
                                key={index}
                                className={`
                                cursor-pointer relative w-full bg-base-200 rounded-box overflow-hidden
                                ${isLarge ? "col-span-2 row-span-2" : ""}
                                ${isWide ? "col-span-2" : ""}
                                
                            `}
                                onClick={() => openModal(image)}
                            >
                                <Image
                                    src={image}
                                    alt={product.name}
                                    style={{ width: '100%', height: '100%' }}
                                    width={1000}
                                    height={1000}
                                    className="object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Alternative Carousel (Without Anchor Links) */}
                <div className="w-full relative h-[500px] rounded-box overflow-hidden bg-base-200 aspect-3/4">
                    <div
                        className="flex h-[500px] transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {images.map((image, index) => (
                            <div key={index} onClick={() => openModal(image!)} className="w-full h-[500px] shrink-0 relative cursor-pointer">
                                <Image
                                    src={image!}
                                    alt={product.name}
                                    width={1000}
                                    height={500}
                                    quality={100}
                                    className="object-contain"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    {images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                            <button
                                onClick={prevSlide}
                                className="btn btn-circle btn-sm bg-white/80 border-none text-slate-900 shadow-sm pointer-events-auto hover:bg-white"
                            >
                                <FiChevronLeft className="text-xl" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="btn btn-circle btn-sm bg-white/80 border-none text-slate-900 shadow-sm pointer-events-auto hover:bg-white"
                            >
                                <FiChevronRight className="text-xl" />
                            </button>
                        </div>
                    )}

                    {/* Indicators */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? "w-6 bg-slate-900" : "w-1.5 bg-slate-400/50"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};