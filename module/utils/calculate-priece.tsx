import { Product } from "../product/actions/get-products";

export const calculatePrice = (product: Product) => {
    const price = product.value
    const tax = price * (product.taxe?.percentage || 0)
    const total = price + tax
    return total
}