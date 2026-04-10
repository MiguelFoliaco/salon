'use client';

import { getSchedulesByUser, SchedulesByUser } from '@/module/booking/actions/schedule-by-user';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { BsCalendar, BsCalendarCheck, BsXCircle, BsPencil } from 'react-icons/bs';
import { format } from 'date-fns'
import { calculatePrice } from '@/module/utils/calculate-priece';

export const Past = () => {
    const [schedules, setSchedules] = useState<SchedulesByUser>([])
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;

    const load = useCallback(async (isLoadMore: boolean = false, force: boolean = false) => {
        const currentPage = isLoadMore ? page + 1 : 1;

        if (loading) return;
        setLoading(true);

        const response = await getSchedulesByUser({ page: currentPage, limit, filterType: 'past' });

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

    if (schedules.length === 0 && !loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <BsCalendar size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No tienes historia pasada</h3>
                <p className="text-slate-500">Aún no tienes visitas completadas anteriores.</p>
                <button className='btn btn-primary px-10 mt-4' onClick={() => load(false, true)}>
                    Recargar
                </button>
            </div>
        );
    }

    return (
        <section>
            <h2 className="text-lg font-bold mb-4 text-slate-400 mt-8">Historia pasada</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedules.map((exp) => (
                    <div key={exp.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0 shadow-sm border border-slate-100">
                                <Image src={exp.product.image!} alt={exp.product.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">{exp.product.name}</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">{format(exp.start_time, 'MMM d, yyyy')} &middot; <BsPencil className="inline text-primary" /> {exp.employee.name}</p>
                                <button className="text-xs font-bold text-primary mt-2 flex items-center gap-1 hover:underline">
                                    <BsCalendarCheck /> {exp.status === 'completed' ? 'Agendar otra vez' : 'Ver detalles'}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right">
                            <span className="text-sm font-bold text-slate-900">${calculatePrice(exp.product).total.toFixed(2)}</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${exp.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-500'}`}>
                                {exp.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

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
                        Cargar historial anterior
                    </button>
                </div>
            )}
        </section>
    );
}
