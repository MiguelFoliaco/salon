import { create } from "zustand";
import { getProducts, Product, Products } from "../actions/get-products";

type IProductContext = {
    products: Products;
    productSelected: Product | null;
    setProductSelected: (product: Product | null) => void
    setProducts: (products: Products) => void
    load: (branchId: string, productTypeId?: string) => Promise<void>
    loading: boolean
}

export const useProduct = create<IProductContext>(set => ({
    products: [],
    setProducts: (products) => set({ products }),
    loading: false,
    load: async (branchId, productTypeId?: string) => {
        set({ loading: true })
        const products = await getProducts({ query: '', type: productTypeId, branchId });
        set({ loading: false })
        if (!products.data) return
        set({ products: products.data, loading: false })
    },
    productSelected: null,
    setProductSelected: (product) => set({ productSelected: product })
}))