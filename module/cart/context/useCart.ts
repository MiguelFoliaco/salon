'use client';

import { create } from 'zustand';
import { Product } from '@/module/product/actions/get-products';

const CART_KEY = 'salon_cart';

export interface CartItem {
    product: Product;
    quantity: number;

}

interface CartStore {
    items: CartItem[];
    hydrated: boolean;
    hydrate: () => void;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQty: (productId: string, qty: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    subtotal: () => number;
    priceDelivery?: number;
    type: 'local' | 'delivery';
    setPriceDelivery: (priceDelivery: number) => void;
    setType: (type: 'local' | 'delivery') => void;
    updateAllCart: (cart: CartItem[], priceDelivery?: number, type?: 'local' | 'delivery') => void;
}

const saveToStorage = (items: CartItem[]) => {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch { /* ignore */ }
};

const loadFromStorage = (): CartItem[] => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
        return [];
    }
};

export const useCart = create<CartStore>((set, get) => ({
    items: [],
    hydrated: false,
    type: 'local',
    setPriceDelivery: (priceDelivery: number) => set({ priceDelivery }),
    setType: (type: 'local' | 'delivery') => set({ type }),
    hydrate: () => {
        if (get().hydrated) return;
        set({ items: loadFromStorage(), hydrated: true });
    },

    addItem: (product: Product) => {
        set((state) => {
            const existing = state.items.find((i) => i.product.id === product.id);
            const updated = existing
                ? state.items.map((i) =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                )
                : [...state.items, { product, quantity: 1 }];
            saveToStorage(updated);
            return { items: updated };
        });
    },

    removeItem: (productId: string) => {
        set((state) => {
            const updated = state.items.filter((i) => i.product.id !== productId);
            saveToStorage(updated);
            return { items: updated };
        });
    },

    updateQty: (productId: string, qty: number) => {
        set((state) => {
            const updated =
                qty <= 0
                    ? state.items.filter((i) => i.product.id !== productId)
                    : state.items.map((i) =>
                        i.product.id === productId ? { ...i, quantity: qty } : i,
                    );
            saveToStorage(updated);
            return { items: updated };
        });
    },

    clearCart: () => {
        saveToStorage([]);
        set({ items: [] });
    },
    updateAllCart: (cart: CartItem[], priceDelivery?: number, type?: 'local' | 'delivery') => {
        saveToStorage(cart);
        set({ items: cart, priceDelivery, type });
    },
    totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

    subtotal: () => {
        // Here we just return the raw totals - better to do the calculation in OrderSummary using calculatePrice
        // But for backwards compatibility, we'll return the sum of base values (which are totals)
        return get().items.reduce((acc, i) => acc + (i.product.value * i.quantity), 0);
    },
}));
