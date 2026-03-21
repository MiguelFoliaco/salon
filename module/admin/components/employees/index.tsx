'use client';

import { useState, useEffect } from 'react';
import { getAdminEmployees, updateEmployee, createEmployee, searchClientForEmployee } from '../../actions/employees';
import { BsSearch, BsPersonVcard, BsTelephone, BsCheckCircle, BsXCircle, BsShieldLock, BsScissors, BsCashCoin, BsX, BsPlusLg } from 'react-icons/bs';
import { format } from 'date-fns';

export const AdminEmployees = () => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        auth_id: '', name: '', last_name: '', phone: '', title: '', rol: 'stylist' as 'admin' | 'cashier' | 'stylist'
    });

    const [userSearch, setUserSearch] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearchingUser, setIsSearchingUser] = useState(false);

    const loadEmployees = async (p = 1, s = search) => {
        setLoading(true);
        try {
            const res = await getAdminEmployees(p, 10, s);
            setEmployees(res.data || []);
            setTotalPages(res.totalPages);
            setPage(p);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadEmployees(1, search);
    };

    const handleClientSearch = async (val: string) => {
        setUserSearch(val);
        if (val.length < 3) return setSearchResults([]);
        setIsSearchingUser(true);
        try {
            const res = await searchClientForEmployee(val);
            setSearchResults(res || []);
        } catch {
            // ignore
        } finally {
            setIsSearchingUser(false);
        }
    };

    const selectUser = (user: any) => {
        setForm(prev => ({
            ...prev,
            auth_id: user.auth_id,
            name: user.name,
            last_name: user.lastname || ''
        }));
        setUserSearch(user.email);
        setSearchResults([]);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.auth_id) return alert("Debes seleccionar un usuario válido o ingresar un auth_id");

        setSubmitting(true);
        try {
            await createEmployee(form);
            setIsModalOpen(false);
            setForm({ auth_id: '', name: '', last_name: '', phone: '', title: '', rol: 'stylist' });
            setUserSearch('');
            loadEmployees();
        } catch (err) {
            console.error(err);
            alert("Error al crear el empleado. Verifica que el usuario no exista previamente.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await updateEmployee(id, { is_active: !currentStatus });
            setEmployees(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
        } catch (error) {
            console.error("Failed to toggle status", error);
            alert("Error al actualizar el estado");
        }
    };

    const handleRoleChange = async (id: string, newRole: 'admin' | 'cashier' | 'stylist') => {
        try {
            await updateEmployee(id, { rol: newRole });
            setEmployees(prev => prev.map(p => p.id === id ? { ...p, rol: newRole } : p));
        } catch (error) {
            console.error("Failed to change role", error);
            alert("Error al cambiar de rol");
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <BsShieldLock className="text-purple-500" />;
            case 'cashier': return <BsCashCoin className="text-green-500" />;
            case 'stylist': return <BsScissors className="text-blue-500" />;
            default: return <BsPersonVcard className="text-slate-500" />;
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8 gap-4 flex-col md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Empleados</h1>
                    <p className="text-slate-500 mt-1">Gestiona los permisos y accesos del personal al sistema.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary gap-2 text-white"
                >
                    <BsPlusLg />
                    Nuevo Empleado
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o teléfono..."
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
                                <th className="p-4 font-semibold">Empleado</th>
                                <th className="p-4 font-semibold">Contacto</th>
                                <th className="p-4 font-semibold">Rol</th>
                                <th className="p-4 font-semibold text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            ) : employees.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No se encontraron empleados.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-slate-900">{emp.name} {emp.last_name}</p>
                                            <p className="text-xs text-slate-500">{emp.title || 'Sin Título'}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 text-sm text-slate-600">
                                                {emp.phone ? (
                                                    <span className="flex items-center gap-2"><BsTelephone className="text-slate-400" /> {emp.phone}</span>
                                                ) : <span className="text-slate-400 italic">Sin teléfono</span>}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-white border text-sm font-semibold border-slate-200 rounded-lg pr-1 overflow-hidden flex items-center shadow-sm">
                                                    <div className="px-2 border-r border-slate-100 bg-slate-50 py-2">
                                                        {getRoleIcon(emp.rol)}
                                                    </div>
                                                    <select
                                                        className="select select-ghost select-sm px-2 focus:bg-transparent font-medium capitalize"
                                                        value={emp.rol || ''}
                                                        onChange={(e) => handleRoleChange(emp.id, e.target.value as any)}
                                                    >
                                                        <option value="stylist">Stylist</option>
                                                        <option value="cashier">Cashier</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(emp.id, emp.is_active)}
                                                className={`btn btn-sm btn-ghost gap-2 ${emp.is_active ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                            >
                                                {emp.is_active ? 'Activo' : 'Inactivo'}
                                                {emp.is_active ? <BsCheckCircle size={18} /> : <BsXCircle size={18} />}
                                            </button>
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
                            onClick={() => loadEmployees(page - 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center text-sm font-medium text-slate-500 px-4">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => loadEmployees(page + 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for Creating Employee */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold text-slate-800">Registrar Nuevo Empleado</h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost"><BsX size={20} /></button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

                            {/* User Search Section */}
                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-6">
                                <label className="block text-sm font-semibold text-indigo-900 mb-1">1. Buscar Usuario (Requerido)</label>
                                <p className="text-xs text-indigo-600 mb-3">Busca un cliente registrado por email o nombre para vincular su cuenta.</p>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Escribe email o nombre..."
                                        className="input input-sm input-bordered w-full pl-8 border-indigo-200 focus:border-indigo-400"
                                        value={userSearch}
                                        onChange={(e) => handleClientSearch(e.target.value)}
                                    />
                                    <BsSearch className="absolute left-2.5 top-2.5 text-indigo-400" size={14} />
                                    {isSearchingUser && <span className="loading loading-spinner loading-xs absolute right-3 top-2.5 text-indigo-500"></span>}
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="mt-2 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden absolute z-10 w-[calc(100%-2rem)] max-h-40 overflow-y-auto">
                                        {searchResults.map(u => (
                                            <button
                                                key={u.auth_id}
                                                type="button"
                                                onClick={() => selectUser(u)}
                                                className="w-full text-left px-4 py-2 hover:bg-indigo-50 border-b border-slate-50 text-sm flex flex-col transition-colors"
                                            >
                                                <span className="font-semibold text-slate-800">{u.name} {u.lastname}</span>
                                                <span className="text-slate-500 text-xs">{u.email}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {form.auth_id && (
                                    <div className="mt-3 text-xs flex items-center gap-1.5 text-green-700 bg-green-50 p-2 rounded-md border border-green-200">
                                        <BsCheckCircle /> Usuario vinculado: <span className="font-mono">{form.auth_id.slice(0, 8)}...</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                                    <input type="text" required className="input input-bordered w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido</label>
                                    <input type="text" required className="input input-bordered w-full" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                                    <input type="tel" className="input input-bordered w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Título / Ocupación</label>
                                    <input type="text" placeholder="Ej: Senior Barber" className="input input-bordered w-full" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Rol en el sistema</label>
                                <select className="select select-bordered w-full font-medium" value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value as any })}>
                                    <option value="stylist">🌟 Stylist (Estilista/Barbero)</option>
                                    <option value="cashier">💰 Cashier (Cajero/Recepción)</option>
                                    <option value="admin">🔒 Admin (Administrador total)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" className="btn btn-ghost flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary flex-1 text-white" disabled={submitting || !form.auth_id}>
                                    {submitting ? <span className="loading loading-spinner"></span> : 'Crear Empleado'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
