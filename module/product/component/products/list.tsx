'use client';
import React, { useEffect } from 'react'
import { ProductCard } from './product-card'
import { useProduct } from '../../context/useProduct';
import { Product } from '../../actions/get-products';
import { useRouter } from 'next/navigation';
import { useCart } from '@/module/cart/context/useCart';
import { useToast } from '@/module/common/hook/useToast';

export const ListProduct = () => {

    const { load, products, loading, setProductSelected } = useProduct();
    const { addItem, hydrate } = useCart();
    const { openToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        hydrate();
    }, [hydrate])

    useEffect(() => {
        load()
    }, [load])

    const handleRedirect = (product: Product) => {
        if (product.is_service) {
            setProductSelected(product)
            return router.push(`/booking/${product.id}`)
        }
        // Non-service → add to cart
        addItem(product)
        openToast(`"${product.name}" agregado al carrito`, 'success')
    }

    return (
        <div>
            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            )}

            {/* Empty State */}
            {products.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-base-content mb-1">No hay servicios disponibles</h3>
                    <p className="text-sm text-base-content/60">Vuelve pronto para ver nuestros servicios</p>
                </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAction={() => handleRedirect(product)}
                        />
                    ))}
                </div>
            )}

            {/* No results for filter */}
            {!loading && products.length > 0 && products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-base-content/60">No hay servicios en esta categoria</p>
                </div>
            )}
        </div>
    )
}
