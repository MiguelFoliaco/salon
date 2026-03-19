'use client';

import { useState, useEffect } from 'react';
import { getAdminClients } from '../../actions/clients';
import { BsSearch, BsPersonBadge, BsTelephone, BsEnvelopeAt } from 'react-icons/bs';
import { format } from 'date-fns';

export const AdminClients = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const loadClients = async (p = 1, s = search) => {
        setLoading(true);
        try {
            const res = await getAdminClients(p, 10, s);
            setClients(res.data || []);
            setTotalPages(res.totalPages);
            setPage(p);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadClients(1, search);
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Clientes</h1>
                    <p className="text-slate-500 mt-1">Directorio de todos los clientes registrados en la plataforma.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, correo o teléfono..."
                            className="input input-sm input-bordered w-full pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <BsSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="p-4 font-semibold">Cliente</th>
                                <th className="p-4 font-semibold">Contacto</th>
                                <th className="p-4 font-semibold">Identificación</th>
                                <th className="p-4 font-semibold">Tipo</th>
                                <th className="p-4 font-semibold">Fecha de Registro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No se encontraron clientes.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{client.name} {client.lastname}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                {client.email && (
                                                    <span className="flex items-center gap-2"><BsEnvelopeAt className="text-slate-400" /> {client.email}</span>
                                                )}
                                                {client.phone && (
                                                    <span className="flex items-center gap-2"><BsTelephone className="text-slate-400" /> {client.phone}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                <span className="flex items-center gap-2"><BsPersonBadge className="text-slate-400" /> {client.identity_type}</span>
                                                <span className="font-medium text-slate-800">{client.identity_value}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${client.client_type === 'natural' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                {client.client_type}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-600">{format(new Date(client.created_at), 'MMM d, yyyy')}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="p-4 border-t border-slate-200 flex justify-center gap-2 bg-slate-50">
                        <button
                            disabled={page === 1}
                            onClick={() => loadClients(page - 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center text-sm font-medium text-slate-500 px-4">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => loadClients(page + 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
