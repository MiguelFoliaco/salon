'use client';

import { useEffect } from "react";
import { useProductTypesContext } from "./context";


export const useProductTypes = () => {

    const { load, productTypes, selected, typeSelected } = useProductTypesContext()

    useEffect(() => {
        load()
    }, [load])

    return {
        productTypes,
        typeSelected,
        selected,
        load,
    }
}