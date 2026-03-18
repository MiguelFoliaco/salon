'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { useCart } from '@/module/cart/context/useCart';

export const CartIcon = () => {
    const { totalItems, hydrated, hydrate } = useCart();

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    const count = hydrated ? totalItems() : 0;

    return (
        <Link href="/cart" className="btn btn-ghost btn-sm btn-circle relative" aria-label="Ver carrito">
            <BsCart3 size={20} />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 badge badge-primary badge-xs min-w-[18px] h-[18px] text-[10px] font-bold">
                    {count > 99 ? '99+' : count}
                </span>
            )}
        </Link>
    );
};
