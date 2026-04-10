'use client';

import { useState, useEffect } from 'react';
import { getAdminSchedules } from './actions/get-schedules';
import { updateScheduleStatus } from './actions/update-schedule-status';
import { format } from 'date-fns';
import { BsCheckCircle, BsXCircle, BsPlayCircle } from 'react-icons/bs';
import { useToast } from '../common/hook/useToast';

export const AdminPage = () => {
    const [schedules, setSchedules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const { openToast } = useToast()
    const [totalPages, setTotalPages] = useState(1);

    const loadSchedules = async (p = 1) => {
        setLoading(true);
        try {
            const res = await getAdminSchedules(p, 10);
            setSchedules(res.data || []);
            setTotalPages(res.totalPages);
            setPage(p);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') => {
        try {
            await updateScheduleStatus(id, status);
            // update locally
            setSchedules(prev => prev.map(s => s.id === id ? { ...s, status } : s));
            openToast('Estado actualizado correctamente', 'success');
        } catch (error) {
            console.error("Failed to change status", error);
            openToast('Error al actualizar el estado', 'error');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Citas Programadas</h1>
                    <p className="text-slate-500 mt-1">Gestiona las citas de todos los clientes y empleados.</p>
                </div>
            </div>

            <div className="bg-white  border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="p-4 font-semibold">Cliente</th>
                                <th className="p-4 font-semibold">Servicio / Producto</th>
                                <th className="p-4 font-semibold">Empleado</th>
                                <th className="p-4 font-semibold">Fecha y Hora</th>
                                <th className="p-4 font-semibold">Estado actual</th>
                                <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            ) : schedules.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        No hay citas registradas.
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((schedule) => (
                                    <tr key={schedule.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-slate-900">{schedule.client?.name} {schedule.client?.lastname}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-slate-900">{schedule.product?.name}</p>
                                            <p className="text-xs text-slate-500">${schedule.product?.value}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-slate-700">{schedule.employee?.name} {schedule.employee?.last_name}</p>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <p className="font-medium text-slate-900">{format(new Date(schedule.start_time), 'MMM d, yyyy')}</p>
                                            <p className="text-xs text-slate-500">{format(new Date(schedule.start_time), 'h:mm a')}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(schedule.status)}`}>
                                                {schedule.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                {schedule.status === 'pending' && (
                                                    <button onClick={() => handleStatusChange(schedule.id, 'confirmed')} className="btn btn-sm btn-circle btn-ghost text-blue-500" title="Confirmar">
                                                        <BsCheckCircle size={18} />
                                                    </button>
                                                )}
                                                {(schedule.status === 'pending' || schedule.status === 'confirmed') && (
                                                    <button onClick={() => handleStatusChange(schedule.id, 'completed')} className="btn btn-sm btn-circle btn-ghost text-green-500" title="Completar">
                                                        <BsPlayCircle size={18} />
                                                    </button>
                                                )}
                                                {schedule.status !== 'cancelled' && schedule.status !== 'completed' && (
                                                    <button onClick={() => handleStatusChange(schedule.id, 'cancelled')} className="btn btn-sm btn-circle btn-ghost text-red-500" title="Cancelar">
                                                        <BsXCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200 flex justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => loadSchedules(page - 1)}
                            className="btn btn-sm btn-outline"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center text-sm font-medium text-slate-500 px-4">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => loadSchedules(page + 1)}
                            className="btn btn-sm btn-outline"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
