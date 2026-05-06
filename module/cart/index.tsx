'use client';

import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { BsCartX, BsCart3 } from 'react-icons/bs';
import { type CartItem as CartItemType, useCart } from './context/useCart';
import { OrderSummary } from './components/OrderSummary';
import { Header } from '@/module/common/components/header';
import { CartItem } from './components/CartItem';
import { getInfoUserByToken } from '../auth/actions/session';
import { useProfile } from '../profile/hook/use-profile';
import { useUser } from '../auth/context/useUser';
import { useToast } from '../common/hook/useToast';


type Props = {
    cartFromUrl?: CartItemType[]
    priceDelivery?: number
    type?: 'local' | 'delivery'
    token?: string
}

export const CartPage = ({ cartFromUrl, priceDelivery, type, token }: Props) => {
    const { items, hydrated, hydrate, updateAllCart } = useCart();
    const { setClient } = useProfile()
    const { updateUser } = useUser()

    // Hydrate from localStorage on mount (client-side only)
    useEffect(() => {

        hydrate();
    }, [hydrate]);


    useEffect(() => {

        // @ts-ignore
        if (window.itemCart && token) {
            // @ts-ignore
            updateAllCart(window.itemCart, priceDelivery ?? 0, type ?? 'local');
            // @ts-ignore
            window.itemCart = null;
            loadUser(token)
        }
    }, [])

    // Agregar las politicas para realizar la compra
    const loadUser = async (token: string) => {
        const { user, profile } = await getInfoUserByToken(token)
        if (user && profile) {
            setClient(profile)
            updateUser(user)
        }
    }

    if (!hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            {
                !token && <Header />
            }

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
                {/* Page heading */}
                <div className="flex items-center gap-3 mb-8">
                    <BsCart3 className="text-primary" size={28} />
                    <h1 className="text-2xl font-bold text-base-content">Mi Carrito</h1>
                    {items.length > 0 && (
                        <span className="badge badge-primary badge-lg">{items.length}</span>
                    )}
                </div>

                {/* Empty state */}
                {items.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 gap-6 bg-base-100 rounded-2xl border border-base-200">
                        <BsCartX size={64} className="text-base-content/20" />
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-base-content mb-1">Tu carrito está vacío</h2>
                            <p className="text-base-content/50 text-sm">Agrega productos desde el catálogo</p>
                            {
                                token &&
                                <Link href="salon://home" className="btn btn-sm btn-primary mt-4">
                                    Regresar a la aplicacion
                                </Link>
                            }
                        </div>

                    </div>
                )}



                {/* Cart layout */}
                {items.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Items list */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="bg-base-100 rounded-2xl border-2 border-base-200 shadow-sm p-6">
                                <h2 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                                    Productos seleccionados
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {items.map((item) => (
                                        <CartItem key={item.product.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary sidebar */}
                        <div className="lg:col-span-1">
                            <OrderSummary />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
