import { create } from "zustand";
import { getProductTypes, ProductType } from "../../actions/get-product-types";

type IProductTypesContext = {
    productTypes: ProductType[];
    typeSelected: ProductType | null;
    selected: (productType: ProductType | null) => void;
    load: () => Promise<void>;
}

export const useProductTypesContext = create<IProductTypesContext>((set) => ({
    productTypes: [],
    typeSelected: null,
    selected: (productType: ProductType | null) => set({ typeSelected: productType }),
    load: async () => {
        const data = await getProductTypes();
        if (data.data) {

            set({ productTypes: data.data })
        }
    }
}));
