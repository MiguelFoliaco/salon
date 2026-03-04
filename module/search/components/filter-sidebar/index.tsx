'use client';

import React, { useState } from 'react';
import { ProductType } from '@/module/search/actions/get-product-types';

export interface FilterState {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface FilterSidebarProps {
    productTypes: ProductType[];
    filters: FilterState;
    onChange: (filters: FilterState) => void;
}

export const FilterSidebar = ({ productTypes, filters, onChange }: FilterSidebarProps) => {
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    const handleApply = () => {
        onChange(localFilters);
    };

    const handleClear = () => {
        const empty = { type: undefined, minPrice: undefined, maxPrice: undefined };
        setLocalFilters(empty);
        onChange(empty);
    };

    return (
        <div className="bg-base-100 border border-base-200 rounded-box p-4 sticky top-4 h-fit w-full lg:w-64 flex-shrink-0">
            <h3 className="font-bold text-lg mb-4">Filtros</h3>

            {/* Categoria */}
            <div className="form-control mb-4">
                <label className="label">
                    <span className="label-text font-semibold">Categoría</span>
                </label>
                <select
                    className="select select-bordered w-full select-sm"
                    value={localFilters.type || ''}
                    onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value || undefined })}
                >
                    <option value="">Todas las categorías</option>
                    {productTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Precio */}
            <div className="form-control mb-6">
                <label className="label">
                    <span className="label-text font-semibold">Rango de Precio</span>
                </label>
                <div className="flex gap-2 items-center">
                    <input
                        type="number"
                        placeholder="Min"
                        className="input input-bordered w-full input-sm"
                        value={localFilters.minPrice || ''}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            minPrice: e.target.value ? Number(e.target.value) : undefined
                        })}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className="input input-bordered w-full input-sm"
                        value={localFilters.maxPrice || ''}
                        onChange={(e) => setLocalFilters({
                            ...localFilters,
                            maxPrice: e.target.value ? Number(e.target.value) : undefined
                        })}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
                <button className="btn btn-primary btn-sm w-full" onClick={handleApply}>
                    Aplicar Filtros
                </button>
                <button className="btn btn-ghost btn-sm w-full" onClick={handleClear}>
                    Limpiar
                </button>
            </div>
        </div>
    );
};
