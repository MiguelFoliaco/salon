import Image from 'next/image';
import React from 'react'
import Link from 'next/link';
import { CgCalendar } from 'react-icons/cg';


type Props = {
    code?: string;
    size?: {
        width: string;
        height: string;
    }
}

const defaultURL = `/default_banner.jpg`

export const Banner = ({ code = 'default', size }: Props) => {
    return (
        <div style={size} className='w-full h-[520px] lg:h-[560px] overflow-hidden relative'>
            {/* Background Image */}
            <Image 
                src={defaultURL} 
                className='w-full h-full object-cover' 
                quality={100} 
                width={1920} 
                height={1080} 
                alt="banner" 
                priority
            />
            
            {/* Dark Overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-neutral/80 via-neutral/60 to-transparent' />
            
            {/* Content */}
            <div className='absolute inset-0 z-10 flex items-center'>
                <div className='max-w-7xl mx-auto px-4 lg:px-6 w-full'>
                    <div className='max-w-xl'>
                        {/* Badge */}
                        <div className='inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full bg-primary text-primary-content mb-6'>
                            Experiencia Premium de Belleza
                        </div>
                        
                        {/* Heading */}
                        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4'>
                            Revela Tu
                            <br />
                            <span className='text-primary'>Mejor Version</span>
                        </h1>
                        
                        {/* Description */}
                        <p className='text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-md'>
                            Experimenta servicios de estilismo y cuidado personal de clase mundial, 
                            diseñados especialmente para ti.
                        </p>
                        
                        {/* CTAs */}
                        <div className='flex flex-wrap gap-3'>
                            <Link 
                                href="/search" 
                                className='btn btn-primary btn-md gap-2'
                            >
                                <CgCalendar className='size-5' />
                                Agenda tu Cita
                            </Link>
                            <Link 
                                href="/search" 
                                className='btn btn-outline btn-md border-white text-white hover:bg-white hover:text-neutral hover:border-white'
                            >
                                Ver Servicios
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
