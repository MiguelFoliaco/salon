'use client';
import React, { useEffect } from 'react'
import { ProductCard } from './product-card'
import { useProduct } from '../../context/useProduct';
import { useProductTypes } from '@/module/categories/components/product-types/hook';
import { Product } from '../../actions/get-products';
import { useRouter } from 'next/navigation';

export const ListProduct = () => {

    const { load, products, loading, setProductSelected } = useProduct();
    const { typeSelected } = useProductTypes()
    const router = useRouter();

    useEffect(() => {
        load()
    }, [load])

    const handleRedirect = (product: Product) => {
        if (product.is_service) {
            setProductSelected(product)
            localStorage.setItem('productSelected', JSON.stringify(product))
            return router.push(`/booking/${product.id}`)
        }

    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {
                loading && (
                    <span className="loading loading-spinner loading-lg" />
                )
            }
            {
                (products.length === 0 && !loading) && (
                    <h2 className="text-center col-span-3 text-md font-medium border-b border-b-neutral/20 pb-2 mb-2 w-full">No products found</h2>
                )
            }
            {
                products.filter(p => p.type.name.includes(typeSelected?.name || '')).map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAction={() => handleRedirect(product)}
                    />
                ))
            }
        </div>
    )
}
