import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/module/product/actions/get-products";

export type CartItem = {
    product: Product;
    quantity: number;
};

type ICartContext = {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export const useCart = create<ICartContext>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product: Product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find(
                    (item) => item.product.id === product.id
                );

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, { product, quantity }] });
                }
                set({ isOpen: true });
            },

            removeItem: (productId: string) => {
                set({
                    items: get().items.filter(
                        (item) => item.product.id !== productId
                    ),
                });
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set({
                    items: get().items.map((item) =>
                        item.product.id === productId
                            ? { ...item, quantity }
                            : item
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => {
                    const price = item.product.value;
                    const tax = price * (item.product.taxe?.percentage || 0);
                    return total + (price + tax) * item.quantity;
                }, 0);
            },

            setIsOpen: (isOpen: boolean) => set({ isOpen }),
        }),
        {
            name: "cart-storage",
        }
    )
);
