'use client';

import { BiShield } from 'react-icons/bi';
import { useCart } from '../context/useCart';
import { useUser } from '@/module/auth/context/useUser';
import { useRouter } from 'next/navigation';

export const OrderSummary = () => {
    const { items, subtotal, clearCart } = useCart();
    const { user } = useUser((s) => s);
    const router = useRouter();

    const sub = subtotal();

    // Calculate weighted average tax from cart items
    const taxAmount = items.reduce((acc, { product, quantity }) => {
        const pct = product.taxe?.percentage ?? 0;
        return acc + (product.value * quantity * pct) / 100;
    }, 0);

    const total = sub + taxAmount;

    const handleCheckout = () => {
        if (!user) {
            router.push('/auth/login?redirect=/cart');
            return;
        }
        // TODO: connect to payment/order flow
        alert('¡Pedido procesado! (flujo de pago pendiente)');
        clearCart();
    };

    return (
        <div className="bg-base-100 rounded-2xl border-2 border-base-200 shadow-lg p-6 flex flex-col gap-4 sticky top-20">
            <h2 className="text-lg font-bold text-base-content">Resumen del pedido</h2>

            <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-base-content/70">
                    <span>Subtotal</span>
                    <span>${sub.toLocaleString('es-CO')} COP</span>
                </div>

                {taxAmount > 0 && (
                    <div className="flex justify-between text-base-content/70">
                        <span>Impuestos</span>
                        <span>${taxAmount.toLocaleString('es-CO')} COP</span>
                    </div>
                )}

                <div className="divider my-0" />

                <div className="flex justify-between font-bold text-base-content text-base">
                    <span>Total</span>
                    <span className="text-primary text-xl">${total.toLocaleString('es-CO')} COP</span>
                </div>
            </div>

            <button
                onClick={handleCheckout}
                disabled={items.length === 0}
                className="btn btn-primary w-full mt-2"
            >
                Ir a pagar
            </button>

            <button
                onClick={() => router.push('/')}
                className="btn btn-outline w-full"
            >
                Seguir comprando
            </button>

            {/* Security badge */}
            <div className="flex items-center gap-2 bg-base-200 rounded-xl p-3 text-xs text-base-content/60">
                <BiShield className="shrink-0 text-success" size={20} />
                <span>Tu pago está protegido con encriptación de nivel bancario</span>
            </div>
        </div>
    );
};
