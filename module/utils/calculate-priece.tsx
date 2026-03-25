import { Product } from "../product/actions/get-products";

export const calculatePrice = (product: Product, quantity: number = 1) => {
    const total = (product.value || 0) * quantity;
    const percentage = product.taxe?.percentage || 0;
    
    // El porcentaje ya viene en decimal (ej. 0.19)
    const subtotal = total / (1 + percentage);
    const tax = total - subtotal;
    
    return {
        total,
        subtotal,
        tax
    };
}