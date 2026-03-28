import { useState } from 'react'
import { BsCalendarCheck, BsClockHistory, BsXCircle, BsPencil, BsTrash, BsCalendar, BsGeoAlt, BsTag, BsStar } from 'react-icons/bs';
import { Client } from '../../actions/get-client'
import { useUser } from '@/module/auth/context/useUser'
import { Uppcoming } from '../upcomming';
import { Past } from '../past';
import { Canceled } from '../canceled';
import { TbTruckDelivery } from 'react-icons/tb';
import { Orders } from '../orders';

export const ProfileDetails = ({ clientData, editProfile, setEditProfile }: { clientData: Client, editProfile: boolean, setEditProfile: (value: boolean) => void }) => {
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState('upcoming');
    return (
        <div>


            <>
                {/* Header section */}
                <div className="mb-8 border-b border-slate-200 pb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                            Hola, {clientData?.name || user?.user_metadata?.full_name || 'Gorgeous'}!

                            <div className='tooltip tooltip-right font-light' data-tip="Editar información">
                                <button className='btn btn-circle ml-3 btn-ghost btn-sm' onClick={() => setEditProfile(!editProfile)}>
                                    <BsPencil size={18} />
                                </button>
                            </div>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">Gestiona tus próximas visitas al salón y las anteriores.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`tab flex gap-2 ${activeTab === 'upcoming' ? 'tab-active' : ''}`}
                    >
                        <BsCalendarCheck size={18} />
                        Próximamente
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`tab flex gap-2 ${activeTab === 'past' ? 'tab-active' : ''}`}
                    >
                        <BsClockHistory size={18} />
                        Historia pasada
                    </button>
                    <button
                        onClick={() => setActiveTab('canceled')}
                        className={`tab flex gap-2 ${activeTab === 'canceled' ? 'tab-active' : ''}`}
                    >
                        <BsXCircle size={18} />
                        Cancelado
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`tab flex gap-2 ${activeTab === 'orders' ? 'tab-active' : ''}`}
                    >
                        <TbTruckDelivery size={18} />
                        Mis pedidos
                    </button>
                </div>

                {activeTab === 'upcoming' && (
                    <Uppcoming />
                )}

                {activeTab === 'past' && (
                    <Past />
                )}

                {activeTab === 'canceled' && (
                    <Canceled />
                )}
                {
                    activeTab === 'orders' && (
                        <Orders />
                    )
                }
                {/* Loyalty Program Banner */}
                {/* <div className="mt-12 bg-success/20  p-8 md:p-10 border border-success flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary text-white shadow-md flex items-center justify-center mb-6 -rotate-12">
                        <BsTag size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 mt-2">Join our Loyalty Program</h2>
                    <p className="text-slate-600 mb-8 max-w-md">You're only 2 bookings away from a 15% discount on your next service!</p>
                    <button className="btn btn-primary">
                        View My Rewards
                    </button>
                </div> */}
            </>
        </div>
    )
}
