'use client';

import { BiShield } from 'react-icons/bi';
import { useCart } from '../context/useCart';
import { useUser } from '@/module/auth/context/useUser';
import { useRouter } from 'next/navigation';
import { MdOpenInNew } from 'react-icons/md';
import { useState } from 'react';
import { useProfile } from '@/module/profile/hook/use-profile';

export const OrderSummary = () => {
    const { items, subtotal, clearCart } = useCart();
    const { client } = useProfile()
    const { user } = useUser((s) => s);
    const router = useRouter();
    const [reciveMode, setReciveMode] = useState<'local' | 'domicilio'>('local')

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

    const isValidPass = (client?.address && reciveMode === 'domicilio' || reciveMode === 'local') && (client?.phone && client?.identity_value && client?.identity_type)

    return (
        <div className="bg-base-100 border-2 border-base-200 shadow-lg p-6 flex flex-col gap-4 sticky top-20">
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

                <div className="flex flex-col text-base-content/70">
                    <div className='join'>
                        <button className={`btn btn-sm shadow-none  join-item ${reciveMode === 'local' ? 'btn-primary' : ''}`} onClick={() => setReciveMode('local')}>Recoger en el local</button>
                        <button className={`btn btn-sm shadow-none  join-item ${reciveMode === 'domicilio' ? 'btn-primary' : ''}`} onClick={() => setReciveMode('domicilio')}>Domicilio</button>
                    </div>
                </div>

                {
                    reciveMode == 'domicilio' &&
                    <div className='flex flex-col text-base-content/70'>
                        <p className='text-primary font-semibold'>Dirección de entrega</p>
                        <p className='text-sm'>Departamento: {client?.departament}</p>
                        <p className='text-sm'>Ciudad: {client?.city_or_municipality}</p>
                        <p className='text-sm'>Dirección: {client?.address}</p>
                    </div>
                }
                <div className="divider my-0" />

                <div className="flex justify-between font-bold text-base-content text-base">
                    <span>Total</span>
                    <span className="text-primary text-xl">${total.toLocaleString('es-CO')} COP</span>
                </div>
            </div>

            {
                !isValidPass &&
                <div className='alert alert-error alert-soft flex flex-col items-start'>
                    <p>No tienes una dirección registrada, por favor regístrate para continuar</p>
                    <button className='btn btn-error btn-outline btn-sm shadow-none' onClick={() => router.push('/profile')}>Registrar dirección</button>
                </div>

            }
            <button
                onClick={handleCheckout}
                disabled={items.length === 0 || !isValidPass}
                className="btn btn-primary w-full mt-2"
            >
                Ir a pagar
            </button>

            <button
                disabled={items.length === 0 || !isValidPass}
                onClick={() => router.push('/')}
                className="btn btn-outline w-full"
            >
                Seguir comprando
            </button>

            {/* Security badge */}
            <div className="flex items-center gap-2 bg-base-200 rounded-xl p-3 text-xs text-base-content/60">
                <BiShield className="shrink-0 text-success" size={20} />
                <a href="https://wompi.com/es/co/que-es-wompi" target="_blank" rel="noopener noreferrer" className='text-xs underline hover:text-primary'>Los pagos sera procesados por Wompi</a>
                <MdOpenInNew className='text-xs text-info' />
            </div>
        </div>
    );
};
