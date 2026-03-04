import React from 'react';
import { Product } from '@/module/product/actions/get-products';
import { ProductCard } from '../product-card';

interface ProductListProps {
    products: Product[];
    loading: boolean;
}

export const ProductList = ({ products, loading }: ProductListProps) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton h-[350px] w-full rounded-box"></div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-base-100 rounded-box border border-base-200 text-base-content/60 w-full h-[400px]">
                <h3 className="text-2xl font-bold mb-2 text-base-content">No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o ajusta los filtros.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full items-stretch">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
