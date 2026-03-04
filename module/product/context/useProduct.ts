import { create } from "zustand";
import { getProducts, Products } from "../actions/get-products";

type IProductContext = {
    products: Products;
    setProducts: (products: Products) => void
    load: () => Promise<void>
    loading: boolean
}

export const useProduct = create<IProductContext>(set => ({
    products: [],
    setProducts: (products) => set({ products }),
    loading: false,
    load: async () => {
        set({ loading: true })
        const products = await getProducts({ page: 1, limit: 10 });
        set({ loading: false })
        if (!products.data) return
        set({ products: products.data, loading: false })
    }
}))