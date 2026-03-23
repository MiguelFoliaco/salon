import { useState } from 'react'
import { BsCalendarCheck, BsClockHistory, BsXCircle, BsPencil, BsTrash, BsCalendar, BsGeoAlt, BsTag, BsStar } from 'react-icons/bs';
import { Client } from '../../actions/get-client'
import { useUser } from '@/module/auth/context/useUser'
import { Uppcoming } from '../upcomming';
import { Past } from '../past';
import { Canceled } from '../canceled';

export const ProfileDetails = ({ clientData }: { clientData: Client }) => {
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
                        </h1>
                        <p className="text-lg text-slate-500 font-medium">Gestiona tus próximas visitas al salón y las anteriores.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'upcoming' ? 'text-primary ' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BsCalendarCheck size={18} />
                        Próximamente
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'past' ? 'text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <BsClockHistory size={18} />
                        Historia pasada
                    </button>
                    <button
                        onClick={() => setActiveTab('canceled')}
                        className={`pb-4 text-base font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'canceled' ? 'text-primary ' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
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
