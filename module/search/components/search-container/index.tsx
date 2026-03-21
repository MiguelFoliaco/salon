'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getProducts, Products } from '@/module/product/actions/get-products';
import { ProductType } from '@/module/search/actions/get-product-types';
import { useToast } from '@/module/common/hook/useToast';
import { FilterSidebar, FilterState } from '../filter-sidebar';
import { ProductList } from '../product-list';
import { Pagination } from '../pagination';
import { useProductTypes } from '@/module/categories/components/product-types/hook';
import { useBranches } from '@/module/branches/context/use-branches';



const ITEMS_PER_PAGE = 12;

export const SearchContainer = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { openToast } = useToast();
    const { productTypes } = useProductTypes()

    // Initial state from URL
    const query = searchParams.get('q') || '';
    const pageParam = Number(searchParams.get('page')) || 1;
    const typeParam = searchParams.get('type') || undefined;
    const minPriceParam = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPriceParam = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    // Component state
    const [products, setProducts] = useState<Products>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState<FilterState>({
        type: typeParam,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
    });
    const { selectedBranch } = useBranches();

    // We keep page decoupled slightly so we can immediately update it
    const [page, setPage] = useState(pageParam);

    const fetchProducts = useCallback(async () => {
        if (!selectedBranch) return openToast('Selecione una sucursal', 'warning')
        setLoading(true);
        const response = await getProducts({
            query,
            page,
            limit: ITEMS_PER_PAGE,
            type: filters.type,
            min: filters.minPrice,
            max: filters.maxPrice,
            branchId: selectedBranch.id
        });

        if (response.error) {
            openToast(response.error.message, 'error');
            setProducts([]);
            setTotalItems(0);
        } else {
            setProducts(response.data || []);
            setTotalItems(response.count || 0);
        }
        setLoading(false);
    }, [query, page, filters, openToast]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Sync URL when filters or page change, to allow sharing the link
    const updateUrl = useCallback((newFilters: FilterState, newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newFilters.type) params.set('type', newFilters.type);
        else params.delete('type');

        if (newFilters.minPrice !== undefined) params.set('minPrice', newFilters.minPrice.toString());
        else params.delete('minPrice');

        if (newFilters.maxPrice !== undefined) params.set('maxPrice', newFilters.maxPrice.toString());
        else params.delete('maxPrice');

        if (newPage > 1) params.set('page', newPage.toString());
        else params.delete('page');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, router, pathname]);

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        setPage(1); // Reset to page 1 on new filter
        updateUrl(newFilters, 1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        updateUrl(filters, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                {query ? `Resultados para "${query}"` : 'Todos los productos'}
                <span className="text-base font-normal text-base-content/70 ml-3">
                    ({totalItems} {totalItems === 1 ? 'resultado' : 'resultados'})
                </span>
            </h1>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Sidebar */}
                <FilterSidebar
                    productTypes={productTypes}
                    filters={filters}
                    onChange={handleFilterChange}
                />

                {/* Main Content */}
                <div className="flex-1 w-full flex flex-col gap-6">
                    <ProductList products={products} loading={loading} />

                    {!loading && totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
