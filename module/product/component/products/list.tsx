'use client';
import React, { useEffect } from 'react'
import { ProductCard } from './product-card'
import { useProduct } from '../../context/useProduct';
import { useProductTypes } from '@/module/categories/components/product-types/hook';

export const ListProduct = () => {

    const { load, products, loading } = useProduct();
    const { typeSelected } = useProductTypes()
    useEffect(() => {
        load()
    }, [load])

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {
                loading && (
                    <span className="loading loading-spinner loading-lg" />
                )
            }
            {
                (products.length === 0 && !loading) && (
                    <h2 className="text-center text-md font-medium border-b border-b-neutral/20 pb-2 mb-2">No products found</h2>
                )
            }
            {
                products.filter(p => p.type.name.includes(typeSelected?.name || '')).map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAction={() => alert('Booking service')}
                    />
                ))
            }
        </div>
    )
}
