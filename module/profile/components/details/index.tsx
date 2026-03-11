import { useState } from 'react'
import { BsCalendarCheck, BsClockHistory, BsXCircle, BsPencil, BsTrash, BsCalendar, BsGeoAlt, BsTag, BsStar } from 'react-icons/bs';
import { Client } from '../../actions/get-client'
import { useUser } from '@/module/auth/context/useUser'
import { useProfilePage } from '../../hook/use-profile';
import { Uppcoming } from '../upcomming';
import { Past } from '../past';
import { Canceled } from '../canceled';

export const ProfileDetails = ({ clientData }: { clientData: Client }) => {
    const { user } = useUser()
    const [activeTab, setActiveTab] = useState('upcoming');
    const { client, clientLoading } = useProfilePage()
    return (
        <div>

            {
                clientLoading && <div className='w-screen h-screen bg-linear-to-br to-base-100 from-30% from-primary fixed z-30 top-0 left-0 flex items-center justify-center gap-2'>
                    <span className="loading loading-spinner text-secondary loading-md"></span>
                    <p className='text-sm font-semibold text-primary-content'>Cargando...</p>
                </div>
            }

            <>
                {/* Header section */}
                <div className="mb-8 border-b border-slate-200 pb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
                            Hola, {clientData?.name || user?.user_metadata?.full_name || 'Gorgeous'}!
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">Gestiona tus próximas visitas al salón y las anteriores.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upcoming' ? 'border-[#f76d91] text-[#f76d91]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BsCalendarCheck size={18} />
                        Próximamente
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'past' ? 'border-[#f76d91] text-[#f76d91]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BsClockHistory size={18} />
                        Historia pasada
                    </button>
                    <button
                        onClick={() => setActiveTab('canceled')}
                        className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'canceled' ? 'border-[#f76d91] text-[#f76d91]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BsXCircle size={18} />
                        Cancelado
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

                {/* Loyalty Program Banner */}
                <div className="mt-12 bg-orange-50 rounded-3xl p-8 md:p-10 border border-orange-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-[#f76d91] text-white rounded-xl shadow-md flex items-center justify-center mb-6 -rotate-12">
                        <BsTag size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 mt-2">Join our Loyalty Program</h2>
                    <p className="text-slate-600 mb-8 max-w-md">You're only 2 bookings away from a 15% discount on your next service!</p>
                    <button className="bg-[#e45b2f] hover:bg-[#c44b1f] text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105">
                        View My Rewards
                    </button>
                </div>
            </>
        </div>
    )
}
