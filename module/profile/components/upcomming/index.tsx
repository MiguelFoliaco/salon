'use client';

import { getSchedulesByUser, SchedulesByUser } from '@/module/booking/actions/schedule-by-user';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BsCalendar, BsCalendarCheck, BsClockHistory, BsGeoAlt, BsPencil, BsTrash, BsXCircle } from 'react-icons/bs';

import { format } from 'date-fns'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';


export const Uppcoming = () => {

    const [schedules, setSchedules] = useState<SchedulesByUser>([])
    const [loading, setLoading] = useState(false);

    const load = useCallback(async (force?: boolean) => {
        const scheduleLocal = localStorage.getItem('schedules');
        if (scheduleLocal && !force) {
            setSchedules(JSON.parse(scheduleLocal))
            return;
        }
        if (loading) return;
        setLoading(true)
        const _schedules = await getSchedulesByUser();
        setSchedules(_schedules)
        localStorage.setItem('schedules', JSON.stringify(_schedules));
        setLoading(false)
    }, [])


    useEffect(() => {
        load()
    }, [load])


    const nextAppointment = useMemo(() => {
        if (schedules) {
            return schedules[0];
        }
        return null;
    }, [schedules])

    if (!nextAppointment) return <div className='w-full rounded-sm bg-base-100 flex flex-col items-center justify-center p-10 border border-gray-200 gap-5'>
        <p>No hay nada para mostrar</p>
        <button className='btn btn-primary px-10' onClick={() => load(true)} disabled={loading}>
            Recargar
            {
                loading && <span className='loading loading-sm loading-infinity' />
            }
        </button>
    </div>

    return (
        <div className="space-y-10">
            {/* Next Appointment */}
            <section>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-slate-900">
                    <span className="text-[#f76d91] text-xl">!</span> Promximas citas
                </h2>

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col md:flex-row">
                    <div className="w-full md:w-[40%] h-[250px] md:h-auto relative">
                        <Image src={nextAppointment.product.image!} alt="Next appointment" fill className="object-cover" />
                    </div>
                    <div className="w-full md:w-[60%] p-6 md:p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {nextAppointment.status}
                                </span>
                                <span className="text-2xl font-extrabold text-[#f76d91]">
                                    ${
                                        nextAppointment.product.value.toFixed(2)
                                        // DEBO AGREGAR UN CAMPO COMO VALOR TOTAL
                                    }
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-6">{nextAppointment.product.name}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8 text-sm text-slate-600 font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsPencil /></div>
                                    <span className="text-slate-400">Personal:</span> <span className="text-slate-900 font-bold">{nextAppointment.employee.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsCalendar /></div>
                                    <span className="text-slate-900 font-bold flex items-center gap-2">{format(nextAppointment.start_time, 'yyyy/mm/dd')}</span>
                                    <span className="text-slate-900 font-bold flex items-center gap-2">{format(nextAppointment.start_time, 'hh:MM')} <BiRightArrow /> {format(nextAppointment.end_time, 'hh:MM')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsClockHistory /></div>
                                    <span className="text-slate-400">Duración:</span> <span className="text-slate-900 font-bold">{nextAppointment.product.estimate_time_in_minutes}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#f76d91]"><BsGeoAlt /></div>
                                    <span className="text-slate-900 font-bold">{nextAppointment.branch.address}</span>
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
                    {schedules.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start justify-between gap-6">
                            <div className="flex gap-4 items-center">
                                <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 shadow-sm border border-slate-100">
                                    <Image src={booking.product.image!} alt={booking.product.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">{booking.product.name}</h3>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 font-medium mb-2">
                                        <span className="flex items-center gap-1"><BsPencil /> {booking.employee.name}</span>
                                        <span className="flex items-center gap-1"><BsCalendar /> {format(booking.start_time, 'yyyy/mm/dd hh:MM')}</span>
                                        <span className="flex items-center gap-1"><BsClockHistory /> {format(booking.end_time, 'yyyy/mm/dd hh:MM')}</span>
                                    </div>
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider inline-block">
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                                <div className="text-xl font-extrabold text-[#f76d91] md:mb-4">${booking.product.value.toFixed(2)}</div>
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
    )
}
