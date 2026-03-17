'use client';
import React from 'react'
import { useProductTypes } from './hook';
import { cn } from '@/utils/cn';

export const ProductTypes = () => {

    const { productTypes, selected, typeSelected } = useProductTypes()

    return (
        <div className='w-full'>
            {/* Section Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
                <div className='flex items-center gap-3'>
                    <h2 className='text-2xl font-bold text-base-content'>
                        Nuestros Servicios
                    </h2>
                    <div className='w-8 h-1 bg-primary rounded-full hidden sm:block' />
                </div>
                
                {/* Filter Pills */}
                <div className='flex flex-wrap gap-2'>
                    {/* All Services Button */}
                    <button
                        onClick={() => selected(null)}
                        className={cn(
                            'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
                            !typeSelected 
                                ? 'bg-primary text-primary-content shadow-md' 
                                : 'bg-base-200 text-base-content hover:bg-base-300'
                        )}
                    >
                        Todos
                    </button>
                    
                    {productTypes.map((productType) => (
                        <button
                            onClick={() => selected(productType)} 
                            key={productType.id}
                            className={cn(
                                'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 flex items-center gap-2',
                                typeSelected?.id === productType.id 
                                    ? 'bg-primary text-primary-content shadow-md' 
                                    : 'bg-base-200 text-base-content hover:bg-base-300'
                            )}
                        >
                            {productType.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
