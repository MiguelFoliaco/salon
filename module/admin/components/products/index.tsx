'use client';

import { useState, useEffect } from 'react';
import { getAdminProducts, toggleProductStatus, createAdminProduct } from '../../actions/products';
import { BsPlusLg, BsSearch, BsToggleOn, BsToggleOff, BsBoxSeam, BsScissors, BsX } from 'react-icons/bs';

export const AdminProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        name: '', description: '', value: '', type: 'service', estimate_time_in_minutes: '30', stock: '0'
    });

    const loadProducts = async (p = 1, s = search) => {
        setLoading(true);
        try {
            const res = await getAdminProducts(p, 10, s);
            setProducts(res.data || []);
            setTotalPages(res.totalPages);
            setPage(p);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadProducts(1, search);
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createAdminProduct({
                name: form.name,
                description: form.description,
                value: parseFloat(form.value),
                is_service: form.type === 'service',
                estimate_time_in_minutes: parseInt(form.estimate_time_in_minutes),
                stock: form.type === 'product' ? parseInt(form.stock) : 0,
                is_active: true
            });
            setIsModalOpen(false);
            setForm({ name: '', description: '', value: '', type: 'service', estimate_time_in_minutes: '30', stock: '0' });
            loadProducts();
        } catch (err) {
            console.error(err);
            alert("Error al crear el producto o servicio");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await toggleProductStatus(id, currentStatus);
            setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
        } catch (error) {
            console.error("Failed to toggle status", error);
            alert("Error al actualizar el estado");
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Productos y Servicios</h1>
                    <p className="text-slate-500 mt-1">Administra el catálogo ofrecido a tus clientes.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary gap-2 text-white"
                >
                    <BsPlusLg />
                    Nuevo Item
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <form onSubmit={handleSearch} className="relative w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar en el catálogo..."
                            className="input input-sm input-bordered w-full pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <BsSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <button type="submit" className="hidden">Buscar</button>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Tipo</th>
                                <th className="p-4 font-semibold">Precio / Tax</th>
                                <th className="p-4 font-semibold text-center">Stock / Tiempo</th>
                                <th className="p-4 font-semibold text-right">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <span className="loading loading-spinner text-[#f76d91]"></span>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No se encontraron productos o servicios.
                                    </td>
                                </tr>
                            ) : (
                                products.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-medium text-slate-900">{item.name}</p>
                                        </td>
                                        <td className="p-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${item.is_service ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                                                {item.is_service ? <BsScissors /> : <BsBoxSeam />}
                                                {item.is_service ? 'Servicio' : 'Producto'}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-slate-900">${item.value}</p>
                                            <p className="text-xs text-slate-500">Tax: {item.taxe?.percentage ? `${item.taxe.percentage * 100}%` : 'N/A'}</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            {item.is_service ? (
                                                <span className="text-sm text-slate-600">{item.estimate_time_in_minutes} min</span>
                                            ) : (
                                                <span className={`text-sm font-semibold ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {item.stock} uni
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(item.id, item.is_active)}
                                                className={`btn btn-sm btn-ghost gap-2 ${item.is_active ? 'text-green-600' : 'text-slate-400'}`}
                                            >
                                                {item.is_active ? 'Activo' : 'Inactivo'}
                                                {item.is_active ? <BsToggleOn size={24} /> : <BsToggleOff size={24} />}
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
                            onClick={() => loadProducts(page - 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Anterior
                        </button>
                        <span className="flex items-center text-sm font-medium text-slate-500 px-4">
                            Página {page} de {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => loadProducts(page + 1)}
                            className="btn btn-sm btn-outline bg-white"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>

            {/* Modal for Creating Product/Service */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Crear Nuevo {form.type === 'service' ? 'Servicio' : 'Producto'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-sm btn-circle btn-ghost"><BsX size={20} /></button>
                        </div>
                        
                        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-2 mb-2 bg-slate-100 p-1 rounded-lg">
                                <button type="button" onClick={() => setForm({ ...form, type: 'service' })} className={`py-2 text-sm font-semibold rounded-md transition-all ${form.type === 'service' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>Servicio</button>
                                <button type="button" onClick={() => setForm({ ...form, type: 'product' })} className={`py-2 text-sm font-semibold rounded-md transition-all ${form.type === 'product' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}>Producto Físico</button>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                                <input type="text" required className="input input-bordered w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
                                <textarea className="textarea textarea-bordered w-full h-20" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Precio base</label>
                                    <input type="number" required min="0" step="0.01" className="input input-bordered w-full" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
                                </div>
                                {form.type === 'service' ? (
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Tiempo est. (min)</label>
                                        <input type="number" required min="1" className="input input-bordered w-full" value={form.estimate_time_in_minutes} onChange={e => setForm({...form, estimate_time_in_minutes: e.target.value})} />
                                    </div>
                                ) : (
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Inicial</label>
                                        <input type="number" required min="0" className="input input-bordered w-full" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                                    </div>
                                )}
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button type="button" className="btn btn-ghost flex-1" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary flex-1 text-white" disabled={submitting}>
                                    {submitting ? <span className="loading loading-spinner"></span> : `Crear ${form.type === 'service' ? 'Servicio' : 'Producto'}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
