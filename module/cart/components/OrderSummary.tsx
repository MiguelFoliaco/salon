'use client';

import { BiShield } from 'react-icons/bi';
import { useCart } from '../context/useCart';
import { useUser } from '@/module/auth/context/useUser';
import { useRouter } from 'next/navigation';
import { MdOpenInNew } from 'react-icons/md';
import { useCallback, useRef, useState } from 'react';
import { useProfile } from '@/module/profile/hook/use-profile';
import { calculatePrice } from '@/module/utils/calculate-priece';
import { generateHash, savePurchase, saveTransaction } from '@/module/checkout/actions';
import { CONSTANT } from '@/constant';
import { generateId } from '@/utils/generate-id';
import { useBranches } from '@/module/branches/context/use-branches';
import { useToast } from '@/module/common/hook/useToast';
import { getPolygonsByBranch, Polygons } from '@/module/polygons/actions';
import { calculatePolygons } from '@/module/polygons/utils/calculate-polygons';


export const OrderSummary = () => {
    const { items, clearCart, priceDelivery, type, setPriceDelivery, setType } = useCart();
    const { selectedBranch } = useBranches()
    const { client } = useProfile()
    const { user } = useUser((s) => s);
    const router = useRouter();
    const { openToast } = useToast()
    const [loading, setLoading] = useState(false);

    // getRawTotal() returns sum of product.value * quantity
    let total = 0 + (type === 'delivery' ? priceDelivery || 0 : 0);
    let sub = 0;
    let taxAmount = 0;

    items.forEach(item => {
        const itemPrice = calculatePrice(item.product, item.quantity);
        total += itemPrice.total;
        sub += itemPrice.subtotal;
        taxAmount += itemPrice.tax;
    });

    const loadPolygons = useCallback(async () => {
        try {
            if (!selectedBranch) return
            setLoading(true)
            const data = await getPolygonsByBranch(selectedBranch.id)
            if (data) {
                console.log(data)
                const polygon = calculatePolygons(data, Number(client?.latitude), Number(client?.longitude))
                if (polygon) {
                    setPriceDelivery(polygon.price)

                } else {
                    openToast('No se encontro un polígono para su dirección, por favor intente de nuevo más tarde.', 'error')
                    setType('local')
                }
            }
        }
        catch (err) {
            console.log(err);
            openToast('Error al cargar los polígonos, por favor intente de nuevo más tarde.', 'error')
        }
        finally {
            setLoading(false)
        }
    }, [])

    const handleCheckout = async () => {
        if (!selectedBranch) {
            router.push('/branches');
            return;
        }
        if (!user) {
            router.push('/auth/login?redirect=/cart');
            return;
        }
        if (!client?.address || !client?.city_or_municipality || !client?.departament) {
            openToast("Por favor complete su dirección de entrega", "error")
            return
        }

        const products = items.map(e => {
            const product = e.product
            return {
                ...product,
                quantity: e.quantity,
            }
        })
        const reference = `order_${generateId()}`
        const purchase = await savePurchase({
            address_delivery: client?.address,
            city_delivery: client?.city_or_municipality,
            department_delivery: client?.departament,
            country_delivery: 'Colombia',
            products,
            total_amount: total,
            reference_code: reference,
            status: 'pending',
            branch_id: selectedBranch.id,
            client_id: client?.id,
            latitude_delivery: Number(client?.latitude),
            longitude_delivery: Number(client?.longitude),
            service_id: null,
            shedule_id: null,
        })
        if (!purchase.success) {
            openToast(purchase?.message || 'Error al guardar el pedido', 'error');
            return;
        }
        const responseSaveTransaction = await saveTransaction({
            amount: total,
            transaction_type: 'income',
            client_id: client?.id,
            branch_id: selectedBranch.id,
            tax_amount: taxAmount,
            products,
            services: [],
            total_amount: total,
            reference_code: reference,
            payment_method: 'other',
            status: 'pending',
        });

        if (!responseSaveTransaction.success) {
            openToast(responseSaveTransaction?.message || 'Error al guardar el pedido', 'error');
            return;
        }
        const hash = await generateHash({
            amount: total * 100,
            currency: 'COP',
            integrity: CONSTANT.WOMPI_INTEGRITY_HASH,
            reference: responseSaveTransaction.data?.reference_code!,
        })


        if (!hash.response.data.hash) {
            openToast("Ocurrio un error al generar el hash, por favor intentelo mas tarde, revise en sus citas e intente pagar desde ahí", "error")
            return
        }

        openToast("Cita agendada exitosamente, para confirmar sera redireccionado ha realizar el pago mediante WOMPI", "success")

        const form = document.createElement('form')
        const script = document.createElement('script')
        script.src = "https://checkout.wompi.co/widget.js"
        script.setAttribute("data-render", "button")
        script.setAttribute("data-expiration-time", hash.expirationTime)
        script.setAttribute("data-public-key", CONSTANT.WOMPI_PUBLIC_KEY)
        script.setAttribute("data-currency", "COP")
        script.setAttribute("data-amount-in-cents", (total * 100).toString())
        script.setAttribute("data-reference", responseSaveTransaction.data?.reference_code!)
        script.setAttribute("data-signature:integrity", hash.response.data.hash)
        form.style.display = 'none';
        form.appendChild(script)
        document.body.appendChild(form)
        // TODO: connect to payment/order flow
        setTimeout(() => {
            const button = form.querySelector("button");
            if (!button) {
                openToast("Ocurrio un error al generar el pago, por favor intentelo mas tarde, revise en sus citas e intente pagar desde ahí", "error")
                return
            }
            button.click()
            clearCart();
        }, 1000)
    };

    const handleChangeType = async (type: 'local' | 'delivery') => {
        if (type === 'delivery') {
            await loadPolygons()
        }
        setType(type);
    }


    const isValidPass = (client?.address && type === 'delivery' || type === 'local') && (client?.phone && client?.identity_value && client?.identity_type)


    return (
        <div className="bg-base-100 border-2 border-base-200 shadow-lg p-6 flex flex-col gap-4 sticky top-20">
            <h2 className="text-lg font-bold text-base-content">Resumen del pedido</h2>

            <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-base-content/70">
                    <span>Subtotal</span>
                    <span>${sub.toLocaleString('es-CO', { maximumFractionDigits: 2 })} COP</span>
                </div>

                {taxAmount > 0 && (
                    <div className="flex justify-between text-base-content/70">
                        <span>Impuestos</span>
                        <span>${taxAmount.toLocaleString('es-CO', { maximumFractionDigits: 2 })} COP</span>
                    </div>
                )}

                <div className="flex flex-col text-base-content/70">
                    <div className='join'>
                        <button disabled={loading} className={`btn btn-sm shadow-none  join-item ${type === 'local' ? 'btn-primary' : ''}`} onClick={() => handleChangeType('local')}>Recoger en el local</button>
                        <button disabled={loading} className={`btn btn-sm shadow-none  join-item ${type === 'delivery' ? 'btn-primary' : ''}`} onClick={() => handleChangeType('delivery')}>Domicilio</button>
                        {
                            loading && <span className="ml-2 loading loading-spinner loading-sm"></span>
                        }
                    </div>
                </div>

                {
                    type == 'delivery' &&
                    <div className='flex flex-col text-base-content/70'>
                        <p className='text-primary font-semibold'>Dirección de entrega</p>
                        <p className='text-sm'>Departamento: {client?.departament}</p>
                        <p className='text-sm'>Ciudad: {client?.city_or_municipality}</p>
                        <p className='text-sm'>Dirección: {client?.address}</p>
                        <p className='text-sm'>Precio de domicilio: {priceDelivery ? `$${priceDelivery.toLocaleString('es-CO', { maximumFractionDigits: 2 })} COP` : 'Gratis'}</p>
                    </div>
                }
                <div className="divider my-0" />

                <div className="flex justify-between font-bold text-base-content text-base">
                    <span>Total</span>
                    <span className="text-primary text-xl">${total.toLocaleString('es-CO', { maximumFractionDigits: 2 })} COP</span>
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
                disabled={items.length === 0 || !isValidPass || (type == 'delivery' && !priceDelivery)}
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
