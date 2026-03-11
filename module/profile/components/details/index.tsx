import { useState } from 'react'
import { BsCalendarCheck, BsClockHistory, BsXCircle, BsPencil, BsTrash, BsCalendar, BsGeoAlt, BsTag, BsStar } from 'react-icons/bs';
import { Client } from '../../actions/get-client'
import { useUser } from '@/module/auth/context/useUser'
import { useProfilePage } from '../../hook/use-profile';
import { Uppcoming } from '../upcomming';



;

const pastExperience = [
    {
        id: 1,
        title: "HydraFacial Deluxe",
        date: "Sept 15, 2023",
        professional: "Jessica M.",
        status: "COMPLETED",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Evening Glam Makeup",
        date: "Aug 28, 2023",
        professional: "Sarah J.",
        status: "CANCELED",
        image: "https://images.unsplash.com/photo-1516975080661-46bfa2c281c7?q=80&w=2574&auto=format&fit=crop"
    }
];

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
                        <span className="bg-[#f76d91] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">2</span>
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
                    <section>
                        <h2 className="text-lg font-bold mb-4 text-slate-400 mt-8">Past Experience</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pastExperience.map((exp) => (
                                <div key={exp.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-full overflow-hidden relative shrink-0 shadow-sm border-2 border-white">
                                            {/* <Image src={exp.image} alt={exp.title} fill className="object-cover" /> */}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">{exp.title}</h3>
                                            <p className="text-xs text-slate-500 font-medium mt-1">{exp.date} &middot; {exp.professional}</p>
                                            <button className="text-xs font-bold text-[#f76d91] mt-2 flex items-center gap-1 hover:underline">
                                                <BsCalendarCheck /> {exp.status === 'COMPLETED' ? 'Book Again' : 'View Details'}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${exp.status === 'COMPLETED' ? 'bg-slate-100 text-slate-500' : 'bg-red-50 text-red-500'}`}>
                                            {exp.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'canceled' && (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                            <BsXCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No canceled appointments</h3>
                        <p className="text-slate-500">You don't have any canceled bookings yet.</p>
                    </div>
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
