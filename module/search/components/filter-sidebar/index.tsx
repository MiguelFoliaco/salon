'use client';

import React, { useState } from 'react';
import { ProductType } from '@/module/search/actions/get-product-types';
import { BsXLg } from 'react-icons/bs';

export interface FilterState {
    type?: string;
    minPrice?: number;
    maxPrice?: number;
}

interface FilterSidebarProps {
    productTypes: ProductType[];
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    onClose?: () => void;
}

export const FilterSidebar = ({ productTypes, filters, onChange, onClose }: FilterSidebarProps) => {
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    const handleApply = () => {
        onChange(localFilters);
        onClose?.();
    };

    const handleClear = () => {
        const empty = { type: undefined, minPrice: undefined, maxPrice: undefined };
        setLocalFilters(empty);
        onChange(empty);
        onClose?.();
    };

    return (
        <div className="bg-base-100 border border-base-200 rounded-box p-4 h-fit w-full lg:w-64 shrink-0 lg:sticky lg:top-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filtros</h3>
                {onClose && (
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Cerrar filtros">
                        <BsXLg className="size-4" />
                    </button>
                )}
            </div>

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
