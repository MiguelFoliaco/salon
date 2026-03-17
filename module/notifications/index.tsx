'use client';
import React, { useState } from 'react'
import { IconType } from 'react-icons';
import { BiBookHeart, BiBell } from 'react-icons/bi';
import { BsCup, BsArrowRight, BsSend } from 'react-icons/bs';
import { CiGps, CiStar } from 'react-icons/ci';
import { HiOutlineUsers } from 'react-icons/hi';
import { HeaderNotification } from './components/header';
import { ModalProductNotification } from './components/modal-product-notification';

const items: {
    name: string
    value: string
    icon: IconType
    description: string
    stats: string
    color: string
}[] = [
        // {
        //     name: 'Ubicación',
        //     value: 'location',
        //     icon: CiGps,
        //     description: 'Notifica a usuarios cercanos sobre ofertas locales',
        //     stats: '1.2k usuarios activos',
        //     color: 'bg-info/10 text-info border-info/20'
        // },
        // {
        //     name: 'Promociones',
        //     value: 'promotions',
        //     icon: CiStar,
        //     description: 'Envía ofertas especiales y descuentos exclusivos',
        //     stats: '3.5k suscriptores',
        //     color: 'bg-warning/10 text-warning border-warning/20'
        // },
        {
            name: 'Productos',
            value: 'products',
            icon: BsCup,
            description: 'Anuncia nuevos productos y actualizaciones',
            stats: '890 notificaciones/mes',
            color: 'bg-primary/10 text-primary border-primary/20'
        },
        // {
        //     name: 'Servicios',
        //     value: 'services',
        //     icon: BiBookHeart,
        //     description: 'Comunica mejoras y nuevos servicios disponibles',
        //     stats: '2.1k interacciones',
        //     color: 'bg-success/10 text-success border-success/20'
        // }
    ]

const recentActivity = [
    { type: 'Promoción', message: 'Descuento 20% enviado', time: 'Hace 2h', users: 342 },
    { type: 'Producto', message: 'Nuevo lanzamiento anunciado', time: 'Hace 5h', users: 1205 },
    { type: 'Ubicación', message: 'Alerta zona centro', time: 'Ayer', users: 89 },
]

export const NotificationsPages = () => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [typeSelected, setTypeSelected] = useState<string>('')

    const handleSendNotification = async () => {
        if (!selectedItem) return;
        setLoading(true);
        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSelectedItem(null);
    }

    return (
        <div className='min-h-screen bg-linear-to-br from-base-200 via-base-100 to-base-200 p-6 lg:p-8'>
            {/* Header */}
            <HeaderNotification />

            {/* Main Grid Layout */}
            <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>

                {/* Cards Grid - Takes 2 columns on xl */}
                <div className='xl:col-span-2'>
                    <div className='bg-base-100 rounded-box border-2 border-base-300 p-6 shadow-lg h-full'>
                        <div className='flex items-center justify-between mb-6'>
                            <div>
                                <h2 className='text-lg font-semibold text-base-content'>Tipos de Notificación</h2>
                                <p className='text-sm text-base-content/60'>Selecciona una categoría para enviar</p>
                            </div>
                            {selectedItem && (
                                <button
                                    onClick={handleSendNotification}
                                    disabled={loading}
                                    className='btn btn-primary btn-sm gap-2'
                                >
                                    {loading ? (
                                        <span className="loading loading-spinner loading-xs"></span>
                                    ) : (
                                        <BsSend className='text-sm' />
                                    )}
                                    Enviar
                                </button>
                            )}
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            {items.map((item) => {
                                const isSelected = selectedItem === item.value;
                                return (
                                    <div
                                        key={item.value}
                                        onClick={() => {
                                            setSelectedItem(isSelected ? null : item.value)
                                            setTypeSelected(isSelected ? '' : item.value)
                                        }}
                                        className={`
                                            group relative overflow-hidden
                                            bg-base-100 rounded-box border-2 
                                            p-5 cursor-pointer
                                            transition-all duration-300 ease-out
                                            hover:shadow-xl hover:-translate-y-1
                                            ${isSelected
                                                ? 'border-primary shadow-lg ring-2 ring-primary/20'
                                                : 'border-base-300 hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        {/* Background decoration */}
                                        <div className={`
                                            absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-50
                                            transition-transform duration-500 group-hover:scale-150
                                            ${item.color.split(' ')[0]}
                                        `} />

                                        <div className='relative z-10'>
                                            {/* Icon & Badge */}
                                            <div className='flex items-start justify-between mb-4'>
                                                <div className={`
                                                    w-12 h-12 rounded-box flex items-center justify-center
                                                    border-2 transition-colors duration-300
                                                    ${item.color}
                                                `}>
                                                    <item.icon className='text-2xl' />
                                                </div>
                                                {isSelected && (
                                                    <span className='badge badge-primary badge-sm'>Seleccionado</span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <h3 className='font-semibold text-base-content mb-1 text-lg'>
                                                {item.name}
                                            </h3>
                                            <p className='text-sm text-base-content/60 mb-4 line-clamp-2'>
                                                {item.description}
                                            </p>

                                            {/* Footer */}
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-1.5 text-xs text-base-content/50'>
                                                    <HiOutlineUsers className='text-sm' />
                                                    <span>{item.stats}</span>
                                                </div>
                                                <div className={`
                                                    flex items-center gap-1 text-xs font-medium
                                                    transition-all duration-300
                                                    ${isSelected ? 'text-primary' : 'text-base-content/40 group-hover:text-primary'}
                                                `}>
                                                    <span>Configurar</span>
                                                    <BsArrowRight className='transition-transform group-hover:translate-x-1' />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Activity & Quick Actions */}
                <div className='space-y-6'>
                    {/* Quick Stats */}
                    <div className='bg-base-100 rounded-box border-2 border-base-300 p-5 shadow-lg'>
                        <h3 className='font-semibold text-base-content mb-4 flex items-center gap-2'>
                            <span className='w-2 h-2 rounded-full bg-success animate-pulse'></span>
                            Estadísticas Rápidas
                        </h3>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='bg-primary/5 rounded-box p-3 border border-primary/10'>
                                <p className='text-2xl font-bold text-primary'>89%</p>
                                <p className='text-xs text-base-content/60'>Tasa de apertura</p>
                            </div>
                            <div className='bg-success/5 rounded-box p-3 border border-success/10'>
                                <p className='text-2xl font-bold text-success'>2.4k</p>
                                <p className='text-xs text-base-content/60'>Enviadas hoy</p>
                            </div>
                            <div className='bg-warning/5 rounded-box p-3 border border-warning/10'>
                                <p className='text-2xl font-bold text-warning'>156</p>
                                <p className='text-xs text-base-content/60'>Pendientes</p>
                            </div>
                            <div className='bg-info/5 rounded-box p-3 border border-info/10'>
                                <p className='text-2xl font-bold text-info'>12</p>
                                <p className='text-xs text-base-content/60'>Programadas</p>
                            </div>
                        </div>
                    </div>
                    {
                        typeSelected !== '' && (
                            <div onClick={() => setTypeSelected('')} className='bg-black/50 w-screen h-screen fixed top-0 left-0 right-0 bottom-0 z-100 flex items-center justify-center'>
                                {
                                    typeSelected === 'products' && (
                                        <ModalProductNotification
                                            onClose={() => setTypeSelected('')}
                                            onSubmit={() => {
                                                setTypeSelected('')
                                            }}
                                        />
                                    )
                                }
                            </div>
                        )
                    }
                    {/* Recent Activity */}
                    <div className='bg-base-100 rounded-box border-2 border-base-300 p-5 shadow-lg'>
                        <h3 className='font-semibold text-base-content mb-4'>Actividad Reciente</h3>
                        <div className='space-y-3'>
                            {recentActivity.map((activity, idx) => (
                                <div

                                    key={idx}
                                    className='flex items-start gap-3 p-3 rounded-box bg-base-200/50 hover:bg-base-200 transition-colors'
                                >
                                    <div className='w-2 h-2 rounded-full bg-primary mt-2 shrink-0'></div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='text-sm font-medium text-base-content truncate'>
                                            {activity.message}
                                        </p>
                                        <div className='flex items-center gap-2 mt-1'>
                                            <span className='badge badge-ghost badge-xs'>{activity.type}</span>
                                            <span className='text-xs text-base-content/50'>{activity.time}</span>
                                        </div>
                                    </div>
                                    <div className='text-right shrink-0'>
                                        <p className='text-sm font-semibold text-base-content'>{activity.users}</p>
                                        <p className='text-xs text-base-content/50'>usuarios</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className='btn btn-ghost btn-sm w-full mt-4 text-primary'>
                            Ver todo el historial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
