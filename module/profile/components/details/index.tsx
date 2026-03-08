import { useState } from 'react'
import { BsCalendarCheck, BsClockHistory, BsXCircle, BsPencil, BsTrash, BsCalendar, BsGeoAlt, BsTag, BsStar } from 'react-icons/bs';
import { Client } from '../../actions/get-client'
import { useUser } from '@/module/auth/context/useUser'
import { useProfilePage } from '../../hook/use-profile';



// Mocks based on the UI provided
const nextAppointment = {
    title: "Full Set Acrylics & Design",
    professional: "Sarah Jenkins",
    duration: "90 mins",
    date: "Oct 24, 2023",
    time: "10:00 AM",
    location: "Main Street Studio",
    price: 65.00,
    status: "CONFIRMED",
    image: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=2695&auto=format&fit=crop"
};

const otherBookings = [
    {
        id: 1,
        title: "Balayage & Hair Treatment",
        professional: "Marcus Rivera",
        date: "Nov 12, 2023",
        time: "2:30 PM",
        price: 180.00,
        status: "PAYMENT PENDING",
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669&auto=format&fit=crop"
    }
];

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
                    <div className="space-y-10">
                        {/* Next Appointment */}
                        <section>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900">
                                <span className="text-[#f76d91] text-xl">!</span> Next Appointment
                            </h2>

                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
                                <div className="w-full md:w-[40%] h-[250px] md:h-auto relative">
                                    {/* <Image src={nextAppointment.image} alt="Next appointment" fill className="object-cover" /> */}
                                </div>
                                <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {nextAppointment.status}
                                            </span>
                                            <span className="text-2xl font-extrabold text-[#f76d91]">
                                                ${nextAppointment.price.toFixed(2)}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-slate-900 mb-6">{nextAppointment.title}</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8 text-sm text-slate-600 font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsPencil /></div>
                                                <span className="text-slate-400">Professional:</span> <span className="text-slate-900 font-bold">{nextAppointment.professional}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsCalendar /></div>
                                                <span className="text-slate-900 font-bold">{nextAppointment.date} &middot; {nextAppointment.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsClockHistory /></div>
                                                <span className="text-slate-400">Duration:</span> <span className="text-slate-900 font-bold">{nextAppointment.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsGeoAlt /></div>
                                                <span className="text-slate-900 font-bold">{nextAppointment.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-auto">
                                        <button className="flex-1 bg-[#f76d91] hover:bg-[#e45b7f] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
                                            <BsCalendarCheck /> Reschedule
                                        </button>
                                        <button className="flex-1 bg-white hover:bg-slate-50 text-[#f76d91] border-2 border-slate-100 hover:border-[#f76d91]/30 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                            <BsXCircle /> Cancel Booking
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Other Upcoming Bookings */}
                        <section>
                            <h2 className="text-lg font-bold mb-4 text-slate-900">Other Upcoming Bookings</h2>
                            <div className="space-y-4">
                                {otherBookings.map((booking) => (
                                    <div key={booking.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start justify-between gap-6">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 shadow-sm border border-slate-100">
                                                {/* <Image src={booking.image} alt={booking.title} fill className="object-cover" /> */}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1">{booking.title}</h3>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 font-medium mb-2">
                                                    <span className="flex items-center gap-1"><BsPencil /> {booking.professional}</span>
                                                    <span className="flex items-center gap-1"><BsCalendar /> {booking.date}</span>
                                                    <span className="flex items-center gap-1"><BsClockHistory /> {booking.time}</span>
                                                </div>
                                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                            <div className="text-xl font-extrabold text-[#f76d91] md:mb-4">${booking.price.toFixed(2)}</div>
                                            <div className="flex items-center gap-3 text-slate-400">
                                                <button className="hover:text-[#f76d91] transition-colors p-2 bg-slate-50 rounded-lg hover:bg-pink-50"><BsPencil size={18} /></button>
                                                <button className="hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-lg hover:bg-red-50"><BsTrash size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
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
