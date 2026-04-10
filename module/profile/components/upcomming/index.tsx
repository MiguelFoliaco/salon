'use client';

import { getSchedulesByUser, SchedulesByUser } from '@/module/booking/actions/schedule-by-user';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsCalendar, BsCalendarCheck, BsClockHistory, BsGeoAlt, BsPencil, BsTrash, BsXCircle } from 'react-icons/bs';

import { format } from 'date-fns'
import { BiRightArrow } from 'react-icons/bi';
import { cn } from '@/utils/cn';
import { IoReload } from 'react-icons/io5';
import { calculatePrice } from '@/module/utils/calculate-priece';

export const Uppcoming = () => {

    const [schedules, setSchedules] = useState<SchedulesByUser>([])
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const load = useCallback(async (isLoadMore: boolean = false, force: boolean = false) => {
        const currentPage = isLoadMore ? page + 1 : 1;

        // Removed localStorage cache logic temporarily to test pagination reliably
        if (loading) return;
        setLoading(true);

        const response = await getSchedulesByUser({ page: currentPage, limit, filterType: 'upcoming' });
        if (isLoadMore) {
            setSchedules(prev => [...prev, ...response.data]);
        } else {
            setSchedules(response.data);
        }

        setPage(response.page);
        setTotalPages(response.totalPages);
        setLoading(false);
    }, [page, loading]);

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const nextAppointment = useMemo(() => {
        if (schedules && schedules.length > 0) {
            return schedules[0];
        }
        return null;
    }, [schedules])

    if (!nextAppointment && !loading) return <div className='w-full bg-base-100 flex flex-col items-center justify-center p-10 border border-gray-200 gap-5'>
        <p>No tienes citas próximamente</p>
        <button className='btn btn-primary px-10' onClick={() => load(false, true)} disabled={loading}>
            Recargar
        </button>
    </div>

    const otherBookings = schedules.slice(1);

    return (
        <div className="space-y-10">
            {/* Next Appointment */}
            {nextAppointment && (
                <section>
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900">
                        <span className="text-primary text-xl">!</span> Próxima cita

                        <button className='btn btn-sm ml-auto btn-primary px-10' onClick={() => load(false, true)} disabled={loading}>
                            Recargar
                            <IoReload />
                        </button>
                    </h2>

                    <div className="bg-white overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
                        <div className="w-full md:w-[40%] h-[250px] md:h-auto relative">
                            <Image src={nextAppointment.product.image!} alt="Next appointment" fill className="object-cover" />
                        </div>
                        <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${nextAppointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {nextAppointment.status}
                                    </span>
                                    <span className="text-2xl font-extrabold text-primary">
                                        ${calculatePrice(nextAppointment.product).total.toFixed(2)}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-6">{nextAppointment.product.name}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8 text-sm text-slate-600 font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary"><BsPencil /></div>
                                        <span className="text-slate-400">Personal:</span> <span className="text-slate-900 font-bold">{nextAppointment.employee.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary"><BsCalendar /></div>
                                        <span className="text-slate-900 font-bold flex items-center gap-2">{format(nextAppointment.start_time, 'yyyy/MM/dd')}</span>
                                        <span className="text-slate-900 font-bold flex items-center gap-2">{format(nextAppointment.start_time, 'hh:mm a')} <BiRightArrow className="text-slate-300 mx-1" /> {format(nextAppointment.end_time, 'hh:mm a')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary"><BsClockHistory /></div>
                                        <span className="text-slate-400">Duración:</span> <span className="text-slate-900 font-bold">{nextAppointment.product.estimate_time_in_minutes} min</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary"><BsGeoAlt /></div>
                                        <span className="text-slate-900 font-bold">{nextAppointment.branch.address}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <button className="flex-1 bg-white hover:bg-slate-50 text-primary border-2 border-slate-100 hover:text-primary/30 font-bold py-3 px-4  transition-all flex items-center justify-center gap-2">
                                    <BsXCircle /> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Other Upcoming Bookings */}
            {otherBookings.length > 0 && (
                <section>
                    <h2 className="text-lg font-bold mb-4 text-slate-900">Otras citas próximas</h2>
                    <div className="space-y-4">
                        {otherBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start justify-between gap-6">
                                <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20  overflow-hidden relative shrink-0 shadow-sm border border-slate-100">
                                        <Image src={booking.product.image!} alt={booking.product.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{booking.product.name}</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 font-medium mb-2">
                                            <span className="flex items-center gap-1"><BsPencil className="text-primary" /> {booking.employee.name}</span>
                                            <span className="flex items-center gap-1"><BsCalendar className="text-primary" /> {format(booking.start_time, 'yyyy/MM/dd hh:mm a')}</span>
                                        </div>
                                        <span className={
                                            cn(
                                                "bg-blue-50  text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block",
                                                booking.status === "confirmed" && "bg-green-50 text-green-600",
                                                booking.status === "pending" && "bg-blue-50 text-info",
                                                booking.status === "cancelled" && "bg-red-50 text-red-600",
                                            )
                                        }>
                                            {booking.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                    <div className="text-xl font-extrabold text-primary md:mb-4">${calculatePrice(booking.product).total.toFixed(2)}</div>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <button className="hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-lg hover:bg-red-50" title="Cancelar"><BsXCircle size={18} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {loading && (
                <div className="flex justify-center my-8">
                    <span className="loading loading-spinner text-primary loading-md"></span>
                </div>
            )}

            {page < totalPages && !loading && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => load(true)}
                        className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-semibold py-2.5 px-6 rounded-full transition-all text-sm shadow-sm"
                    >
                        Cargar más citas
                    </button>
                </div>
            )}
        </div>
    )
}
