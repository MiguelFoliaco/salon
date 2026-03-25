'use client';

import Image from 'next/image';
import { BiMinus, BiPlus, BiTrash } from 'react-icons/bi';
import { CartItem as CartItemType, useCart } from '../context/useCart';
import { calculatePrice } from '@/module/utils/calculate-priece';

interface Props {
    item: CartItemType;
}

export const CartItem = ({ item }: Props) => {
    const { updateQty, removeItem } = useCart();
    const { product, quantity } = item;

    return (
        <div className="flex gap-4 p-4 bg-base-100 rounded-xl border border-base-200 shadow-sm">
            {/* Image */}
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-base-200">
                <Image
                    src={product.image || ''}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
                <p className="font-semibold text-base-content line-clamp-1">{product.name}</p>
                <p className="text-sm text-base-content/50 line-clamp-2">{product.description}</p>
                <p className="text-primary font-bold">
                    ${product.value.toLocaleString('es-CO')} COP
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                {/* Remove */}
                <button
                    onClick={() => removeItem(product.id)}
                    className="btn btn-ghost btn-xs text-error"
                    aria-label="Eliminar"
                >
                    <BiTrash size={16} />
                </button>

                {/* Qty */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => updateQty(product.id, quantity - 1)}
                        className="btn btn-circle btn-sm btn-primary btn-outline"
                        aria-label="Reducir cantidad"
                    >
                        <BiMinus size={14} />
                    </button>
                    <span className="w-6 text-center font-bold text-base-content">{quantity}</span>
                    <button
                        onClick={() => updateQty(product.id, quantity + 1)}
                        className="btn btn-circle btn-sm btn-primary"
                        aria-label="Aumentar cantidad"
                    >
                        <BiPlus size={14} />
                    </button>
                </div>

                {/* Line total */}
                <p className="text-sm font-semibold text-base-content/70">
                    ${calculatePrice(product, quantity).total.toLocaleString('es-CO', { maximumFractionDigits: 2 })}
                </p>
            </div>
        </div>
    );
};
