'use client';

import { useState, useEffect } from 'react';
import { getAdminOrders, AdminOrder } from '../../actions/orders';
import { Table } from '@/module/common/components/table';
import { AssignModal } from './assign-modal';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/utils/cn';
import { truncate } from '@/utils/truncate';
import { BsSearch, BsTruck, BsPersonBadge } from 'react-icons/bs';

const MAPSTATUS: Record<string, string> = {
    'pending': 'Pendiente',
    'in_progress': 'En progreso',
    'completed': 'Completado',
    'cancelled': 'Cancelado',
    'on_the_way': 'En camino',
};

export const AdminOrdersTable = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    // Modal state
    const [modalData, setModalData] = useState<{ deliveryId: string, employeeId: string | null } | null>(null);

    const loadOrders = async (p = 1, s = search) => {
        setLoading(true);
        try {
            const res = await getAdminOrders(p, 10, s);
            setOrders(res.data || []);
            setTotalPages(res.totalPages);
            setPage(p);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadOrders(1, search);
    };

    const handleAssignSuccess = () => {
        setModalData(null);
        loadOrders(page, search);
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 gap-4 flex-col md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold">Domicilios / Órdenes</h1>
                    <p className="text-slate-500 mt-1">Gestiona las entregas de productos y asigna domiciliarios.</p>
                </div>
            </div>

            <div className="bg-base-100 shadow-sm border border-base-200 overflow-hidden">
                <div className="p-4 border-b border-base-200 bg-base-50 flex justify-between gap-4">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar por código de referencia..."
                            className="input input-sm input-bordered w-full pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <BsSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    </form>
                </div>

                <div className="p-0">
                    {loading && orders.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <span className="loading loading-spinner text-primary"></span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No se encontraron domicilios.
                        </div>
                    ) : (
                        <Table<AdminOrder>
                            headers={[
                                { key: 'created_at', title: 'Fecha' },
                                { key: 'purchase.reference_code', title: 'Cod. Ref.' },
                                { key: 'purchase.branch.name', title: 'Sucursal' },
                                { key: 'purchase.status', title: 'Estado Compra' },
                                { key: 'actual_end_time', title: 'Estado Entrega' },
                                { key: 'purchase.address_delivery', title: 'Dirección' },
                                { key: 'employe.name', title: 'Domiciliario' },
                                { key: 'purchase.total_amount', title: 'Total' },
                            ]}

                            // Remove borders internally and rely on container
                            tableClassNameContent="border-none w-full  border-collapse"
                            containerClassName="border-none shadow-none  w-full"

                            onRenderField={(key, value, row) => {
                                if (key === 'created_at') {
                                    return <span className="text-xs whitespace-nowrap">{format(new Date(value as string), 'yyyy/MM/dd HH:mm')}</span>;
                                }
                                if (key === 'purchase.total_amount') {
                                    return <span className="font-semibold text-xs whitespace-nowrap">${Number(value).toFixed(2)}</span>;
                                }
                                if (key === 'actual_end_time') {
                                    if (!value) {
                                        return <span className="badge badge-error badge-sm">Pendiente</span>;
                                    }
                                    const isDelivered = differenceInDays(new Date(), new Date(value as string)) > 0;
                                    return <span className={cn('badge badge-sm', isDelivered ? 'badge-success' : 'badge-error')}>
                                        {isDelivered ? 'Entregado' : 'Pendiente'}
                                    </span>;
                                }
                                if (key === 'purchase.reference_code') {
                                    return <div className='tooltip' data-tip={value as string}>
                                        <p className='text-xs font-mono bg-slate-100 px-2 py-1 rounded'>{truncate(value as string, 8)}</p>
                                    </div>;
                                }
                                if (key === 'purchase.status') {
                                    return <span className='text-xs font-medium text-slate-600'>{MAPSTATUS[value as string] || value}</span>;
                                }
                                if (key === 'employe.name') {
                                    const employee = row.employe;
                                    if (!employee) {
                                        return (
                                            <button
                                                onClick={() => setModalData({ deliveryId: row.id, employeeId: null })}
                                                className="btn btn-xs btn-outline btn-primary shrink-0"
                                            >
                                                Asignar
                                            </button>
                                        );
                                    }
                                    return (
                                        <div className="flex items-center gap-2">
                                            <div className="flex flex-col flex-1 truncate">
                                                <span className="text-xs font-bold text-slate-800 truncate">{employee.name} {employee.last_name}</span>
                                            </div>
                                            <button
                                                onClick={() => setModalData({ deliveryId: row.id, employeeId: employee.id })}
                                                className="btn btn-xs btn-ghost btn-circle text-slate-400 hover:text-primary"
                                                title="Cambiar domiciliario"
                                            >
                                                <BsTruck />
                                            </button>
                                        </div>
                                    );
                                }
                                if (key === 'purchase.address_delivery') {
                                    return <div className="text-xs max-w-[150px] truncate" title={value as string}>{value} <span className="text-slate-400 block truncate">{row.purchase?.city_delivery}</span></div>;
                                }
                                return <span className="text-xs">{value as React.ReactNode}</span>;
                            }}

                            data={orders}
                            pageSize={10}
                            showPagination={false} // We implement custom outer pagination below
                        />
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200 flex justify-center gap-2 bg-slate-50">
                        <button
                            disabled={page === 1}
                            onClick={() => loadOrders(page - 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center text-sm font-medium text-slate-500 px-4">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => loadOrders(page + 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            {modalData && (
                <AssignModal
                    deliveryId={modalData.deliveryId}
                    currentEmployeeId={modalData.employeeId}
                    onClose={() => setModalData(null)}
                    onSuccess={handleAssignSuccess}
                />
            )}
        </div>
    );
};
