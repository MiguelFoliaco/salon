'use client';

import { useEffect } from "react";
import { useProductTypesContext } from "./context";
import { useSessionCache } from "@/module/common/hook/useSessionCache";

export const useProductTypes = () => {

    const { load, productTypes, selected, typeSelected } = useProductTypesContext();
    const { get, set } = useSessionCache<any>('product-types', 1000 * 60 * 60); // 1 hour

    useEffect(() => {
        const cached = get();
        if (cached && cached.length > 0) {
            useProductTypesContext.setState({ productTypes: cached });
            return;
        }
        load();
    }, [load]);

    // Update cache when fetched
    useEffect(() => {
        if (productTypes.length > 0) {
            set(productTypes);
        }
    }, [productTypes, set]);

    return {
        productTypes,
        typeSelected,
        selected,
        load,
    }
}