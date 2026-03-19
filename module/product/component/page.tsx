'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '../actions/get-products';
import { Header } from '@/module/common/components/header';
import { Footer } from '@/module/common/components/footer';
import { useCart } from '@/module/cart/context/useCart';
import { BiShoppingBag, BiChevronDown, BiCar, BiStore } from 'react-icons/bi';
import { useToast } from '@/module/common/hook/useToast';

interface ProductPageProps {
    product: Product;
}

export const ProductDetailPage = ({ product }: ProductPageProps) => {
    const { addItem } = useCart();
    const { openToast } = useToast();
    const [selectedSize, setSelectedSize] = useState<string>('M');

    // Placeholder sizes since the DB doesn't have sizes yet
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const handleAddToCart = () => {
        addItem(product);
        openToast('Producto agregado al carrito', 'success');
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left: Image Gallery (Mimicking the visual style with placeholders) */}
                    <div className="lg:w-2/3 flex flex-col gap-4">
                        {/* Top row: 2 large images */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative aspect-3/4 bg-[#f5f5f5] w-full">
                                {product.image && (
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                )}
                            </div>
                            <div className="relative aspect-3/4 bg-[#f5f5f5] w-full hidden md:block">
                                {product.image && (
                                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                                )}
                            </div>
                        </div>
                        {/* Bottom row: 3 smaller images */}
                        <div className="grid-cols-3 gap-4 hidden md:grid">
                            <div className="relative aspect-3/4 bg-[#f5f5f5] w-full">
                                {product.image && (
                                    <Image src={product.image} alt={product.name} fill className="object-cover object-top" />
                                )}
                            </div>
                            <div className="relative aspect-3/4 bg-[#f5f5f5] w-full">
                                {product.image && (
                                    <Image src={product.image} alt={product.name} fill className="object-cover object-center" />
                                )}
                            </div>
                            <div className="relative aspect-3/4 bg-[#f5f5f5] w-full">
                                {product.image && (
                                    <Image src={product.image} alt={product.name} fill className="object-cover object-bottom" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="lg:w-1/3 flex flex-col pt-4 lg:pt-8 sticky top-24 h-fit">

                        <div className="mb-8">
                            <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-3">
                                {product.type?.name || 'NEW SEASON'}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-normal text-slate-900 leading-tight mb-4 font-serif">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-bold text-slate-900 mb-2">
                                ${product.value.toLocaleString('es-CO')}
                            </p>
                            <p className="text-sm text-slate-500">
                                o 4 pagos sin interés con tarjeta de crédito
                            </p>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm font-bold text-slate-900 tracking-wide">SIZE</span>
                                <button className="text-xs text-slate-500 underline underline-offset-4 hover:text-slate-900 transition-colors">
                                    VIEW SIZE GUIDE
                                </button>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 text-sm font-medium transition-all ${selectedSize === size
                                                ? 'bg-slate-900 text-white border-slate-900'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add to Bag Button */}
                        <button
                            onClick={handleAddToCart}
                            className="bg-slate-900 hover:bg-slate-800 text-white w-full py-4 flex items-center justify-center gap-3 transition-colors mb-6 text-sm font-bold tracking-wider uppercase disabled:opacity-50"
                            disabled={!product.stock && !product.is_service}
                        >
                            <BiShoppingBag className="text-lg" />
                            {(!product.stock && !product.is_service) ? 'Agotado' : 'Add to Bag'}
                        </button>

                        {/* Delivery Info */}
                        <div className="space-y-4 mb-10 text-sm text-slate-600">
                            <div className="flex items-start gap-3">
                                <BiCar className="text-lg shrink-0 mt-0.5" />
                                <p>Haz tu pedido ahora, entrega express gratuita para mañana si estás en la zona.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <BiStore className="text-lg shrink-0 mt-0.5" />
                                <p>Haz tu pedido ahora, recolección en tienda disponible sin costo.</p>
                            </div>
                        </div>

                        {/* Accordions */}
                        <div className="border-t border-slate-200">

                            <details className="group" open>
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-5 text-sm tracking-wide text-slate-900 border-b border-slate-200">
                                    PRODUCT DESCRIPTION
                                    <span className="transition group-open:rotate-180">
                                        <BiChevronDown className="text-xl" />
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm py-4 border-b border-slate-200 leading-relaxed uppercase space-y-4">
                                    <p>{product.description || 'Una pieza clásica y elegante.'}</p>
                                    <p>DISEÑADO CON UNA SILUETA SOFISTICADA, ACABADOS PREMIUM Y UNA ATENCIÓN AL DETALLE QUE RESALTA EN CADA MOMENTO.</p>
                                </div>
                            </details>

                            <details className="group">
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-5 text-sm tracking-wide text-slate-900 border-b border-slate-200">
                                    PRODUCT DETAILS
                                    <span className="transition group-open:rotate-180">
                                        <BiChevronDown className="text-xl" />
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm py-4 border-b border-slate-200 leading-relaxed uppercase">
                                    <ul className="list-disc pl-4 space-y-2">
                                        <li>CÓDIGO DE PRODUCTO: {product.code || product.id.slice(0, 8)}</li>
                                        <li>{product.is_service ? 'TIPO: SERVICIO' : 'TIPO: PRODUCTO FÍSICO'}</li>
                                        <li>MATERIAL DE ALTA CALIDAD.</li>
                                        <li>INSTRUCCIONES DE CUIDADO INCLUIDAS EN EL EMPAQUE.</li>
                                    </ul>
                                </div>
                            </details>

                            <details className="group">
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none py-5 text-sm tracking-wide text-slate-900 border-b border-slate-200">
                                    OUR COMMITMENT
                                    <span className="transition group-open:rotate-180">
                                        <BiChevronDown className="text-xl" />
                                    </span>
                                </summary>
                                <div className="text-slate-600 text-sm py-4 border-b border-slate-200 leading-relaxed uppercase">
                                    <p>EN GLOW SALON, NOS COMPROMETEMOS A OFRECER PRODUCTOS QUE CUBRAN LOS MÁS ALTOS ESTÁNDARES ÉTICOS Y DE CALIDAD, VALORANDO LA SOSTENIBILIDAD Y EL IMPACTO POSITIVO EN NUESTRA COMUNIDAD.</p>
                                </div>
                            </details>

                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
