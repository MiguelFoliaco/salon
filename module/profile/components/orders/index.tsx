'use client';
import React, { useEffect } from 'react'
import { useProfile } from '../../hook/use-profile';
import { useState } from 'react';
import { getOrdersWithDelivery, OrderWithDelivery, OrdersWithDelivery as Ords } from './actions';
import { Table } from '@/module/common/components/table';
import { differenceInDays, format } from 'date-fns';
import { Product } from '@/module/product/actions/get-products';
import { cn } from '@/utils/cn';
import { truncate } from '@/utils/truncate';


const MAPSTATUS: Record<NonNullable<NonNullable<OrderWithDelivery['purchase']>['status']>, string> = {
    'pending': 'Pendiente',
    'in_progress': 'En progreso',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'on_the_way': 'En camino',

}


type Products = (Product & { quantity: number })[]
// En esta seccion se debe especificar el estado del domicilio, agregar a cada order en la consulta con la base de datos.
// UNa vez terminado esto y la vista de las ordenes en el admin se debe pasar actualizar la aplicacion android.
export const Orders = () => {

    const { client } = useProfile()
    const [orders, setOrders] = useState<Ords>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [products, setProducts] = useState<{ order_id: string, products: Products }>({ order_id: '', products: [] });
    const limit = 10;
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        if (!client) return;
        setLoading(true);
        getOrdersWithDelivery({ client_id: client.id, page, limit }).then((res) => {
            setOrders(res.data)
            setTotalPages(res.totalPages)
            setPage(res.page)
            setLoading(false)
        })
    }, [client]);

    return (
        <>
            <div onClick={() => setSelectedImage('')} className={cn(
                'w-screen h-screen fixed top-0 left-0 bg-black/50 flex items-center justify-center z-50',
                selectedImage === '' && 'hidden'
            )}>
                {
                    selectedImage && <img onClick={(e) => {
                        e.stopPropagation()
                    }} src={selectedImage} draggable={false} className='w-1/2 h-1/2 object-contain select-none' alt="" />
                }
            </div>
            <div className='w-full bg-base-100 flex flex-col items-center justify-center p-10 border border-gray-200 gap-5'>
                <h2 className='mb-2'>Tus Ordenes</h2>


                {
                    loading && <span className='loading loading-spinner loading-lg' />
                }

                {
                    (!loading && orders) &&
                    <div>

                        <Table<OrderWithDelivery>

                            headers={[
                                { key: 'created_at', title: 'Fecha' },
                                { key: 'purchase.branch.name', title: 'Sucursal' },
                                { key: 'purchase.status', title: 'Estado de compra' },
                                { key: 'actual_end_time', title: 'Estado de entrega' },
                                { key: 'purchase.address_delivery', title: 'Dirc. De entrega' },
                                { key: 'purchase.reference_code', title: 'Referencia' },
                                { key: 'purchase.products', title: 'Productos' },
                                { key: 'purchase.total_amount', title: 'Total' },
                            ]}

                            onRenderField={(key, value, order) => {
                                if (key === 'created_at') {
                                    return format(value as string, 'yyyy/MM/dd - hh:mm a');
                                }
                                if (key === 'purchase.total_amount') {
                                    return `$${Number(value).toFixed(2)}`;
                                }
                                if (key === 'purchase.products') {
                                    return <button onClick={() => {
                                        if (products.order_id === order.id) {
                                            setProducts({ order_id: '', products: [] })
                                            return
                                        }
                                        setProducts({ order_id: order.id, products: value as unknown as Products })
                                    }} className={
                                        cn(
                                            'btn  btn-xs shadow-none',
                                            products.order_id === order.id ? 'btn-error' : 'btn-info btn-outline'
                                        )
                                    }>
                                        {
                                            products.order_id === order.id ? 'Cerrar' : 'Ver productos'
                                        }
                                    </button>
                                }
                                if (key === 'actual_end_time') {
                                    if (!value) {
                                        return <p className='text-xs text-red-500'>Pendiente</p>
                                    }
                                    const isDelivered = differenceInDays(new Date(), new Date(value as string)) > 0;
                                    return <p className={cn(
                                        'text-xs',
                                        isDelivered ? 'text-green-500' : 'text-red-500'
                                    )}>
                                        {isDelivered ? 'Entregado' : 'Pendiente'}
                                    </p>
                                }
                                if (key === 'purchase.reference_code') {
                                    return <div className='tooltip' data-tip={value as string}>
                                        <p className='text-xs cursor-pointer hover:underline'>{truncate(value as string, 10)}</p>
                                    </div>
                                }

                                if (key === 'purchase.status') {
                                    return <p className='text-xs'>{MAPSTATUS[value as NonNullable<NonNullable<OrderWithDelivery['purchase']>['status']>]}</p>
                                }
                                return value as React.ReactNode;
                            }}

                            data={orders}
                            pageSize={limit}


                        />
                        <p className='opacity-50 mt-2 text-sm'>Total de ordenes: {orders.length} <br /> Total paginas: {totalPages}</p>


                        <div className={cn(
                            'w-full bg-base-100 flex flex-col items-center justify-center p-10 border border-gray-200 gap-5',
                            products.order_id === '' && 'hidden'
                        )}>
                            <h3 className='text-lg'>Productos de la orden {products.order_id}</h3>
                            <Table<Products[0]>
                                headers={[
                                    { key: 'image', title: 'Imagen' },
                                    { key: 'name', title: 'Nombre' },
                                    { key: 'quantity', title: 'Cantidad' },
                                    { key: 'code', title: 'Código' },
                                    { key: 'value', title: 'Precio' },
                                ]}
                                data={products.products}
                                onRenderField={(key, value) => {
                                    if (key === 'image') {
                                        return <img onClick={() => setSelectedImage(value as string)} src={value as string} className='w-10 h-10 object-contain cursor-pointer' alt="" />
                                    }
                                    return value as React.ReactNode;
                                }}
                            />
                        </div>
                    </div>
                }

            </div>
        </>
    )
}