'use client';

import { useState, useEffect } from 'react';
import { getAdminProducts, toggleProductStatus, createAdminProduct, type AdminProduct } from '../../actions/products';
import { BsPlusLg, BsSearch, BsToggleOn, BsToggleOff, BsBoxSeam, BsScissors, BsX, BsClock } from 'react-icons/bs';
import { useBranches } from '@/module/branches/context/use-branches';
import { useConfigurations } from '@/module/configurations/context/use-configurations';
import { useToast } from '@/module/common/hook/useToast';
import { Table } from '@/module/common/components/table';
import { ModalCreateProductOrService } from './modal-create';

export const AdminProducts = () => {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const { openToast } = useToast()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const { branches, load, selectedBranch, updateSelectedBranch } = useBranches()
    const { configuration } = useConfigurations()
    const [isModalOpen, setIsModalOpen] = useState(false);


    const loadProducts = async (p = 1, s = search, branchId: string) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await getAdminProducts({ page: p, limit: 10, search: s, branchId: branchId });
            console.log(res.data)
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
        if (configuration) {
            load(configuration.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedBranch?.id) {
            loadProducts(1, search, selectedBranch.id);
        }
    }, [selectedBranch]);

    const handleSearch = async (e: React.FormEvent) => {
        if (!selectedBranch?.id) {
            openToast("Por favor seleccione una sucursal", "info")
            return
        }
        e.preventDefault();
        try {
            await loadProducts(1, search, selectedBranch.id);
        } catch (error) {
            console.error(error);
            openToast("Error al buscar productos", "error")
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

            <div className=" shadow-sm  overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
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

                    <select name="branch-id" className="select select-sm ml-auto" onChange={(e) => {
                        if (e.target.value === "") {
                            updateSelectedBranch(null)
                        } else {
                            const branch = branches.find((branch) => branch.id === e.target.value)
                            if (branch) {
                                updateSelectedBranch(branch)
                                loadProducts(1, search, branch.id)
                            }
                        }
                    }}>
                        <option value="">Todas las sucursales</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                    <button className="btn btn-sm btn-primary shadow-none" onClick={() => loadProducts(1, search, selectedBranch?.id || "")}>Recargar</button>
                </div>

                <div className="overflow-x-auto">
                    {
                        products?.length === 0 ? (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-slate-500">
                                    {
                                        selectedBranch ? (
                                            <>
                                                No se encontraron productos para la sucursal {selectedBranch.name}
                                            </>
                                        ) : (
                                            <>
                                                Seleccione una sucursal para ver los productos
                                            </>
                                        )
                                    }
                                </p>
                            </div>
                        ) : (
                            <Table<AdminProduct>
                                data={products}
                                headers={[
                                    { key: 'product.name', title: 'Nombre' },
                                    { key: 'product.is_service', title: 'Tipo' },
                                    { key: 'product.value', title: 'Precio' },
                                    { key: 'product.stock', title: 'Stock / Tiempo' },
                                    { key: 'product.is_active', title: 'Estado', },
                                ]}
                                ActionFielComponent={(item) => {
                                    return (
                                        <div className="flex gap-2">
                                            <button className="btn btn-xs btn-primary shadow-none" onClick={() => handleToggleStatus(item.id, item.product.is_active!!)}>
                                                {item.product.is_active ? 'Inactivar' : 'Activar'}
                                            </button>
                                        </div>
                                    )
                                }}
                                onRenderField={(key, value, item) => {
                                    if (key === 'product.is_service') {
                                        return <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${item.product.is_service ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {item.product?.is_service ? <BsScissors /> : <BsBoxSeam />}
                                            {item.product?.is_service ? 'Servicio' : 'Producto'}
                                        </div>
                                    }
                                    if (key === 'product.value') {
                                        return `$${item.product.value}`;
                                    }
                                    if (key === 'product.stock') {
                                        return <div className="flex items-center gap-2">{
                                            item.product.is_service ? (
                                                <span className="text-xs flex gap-1 items-center justify-center">
                                                    <BsClock /> {item.product.estimate_time_in_minutes} min
                                                </span>
                                            ) : (
                                                <span className="text-xs font-medium">{item.stock}</span>
                                            )
                                        }
                                        </div>;
                                    }
                                    if (key === 'product.is_active') {
                                        return item.product.is_active ? 'Activo' : 'Inactivo';
                                    }
                                    return value;
                                }}

                                FooterComponent={() => (
                                    <div className="p-4 border-t border-slate-200 flex justify-center gap-2 bg-slate-50">
                                        <button
                                            disabled={page === 1}
                                            onClick={() => loadProducts(page - 1, search, selectedBranch?.id || "")}
                                            className="btn btn-sm btn-outline bg-white"
                                        >
                                            Anterior
                                        </button>
                                        <span className="flex items-center text-sm font-medium text-slate-500 px-4">
                                            {
                                                loading ? <span className="loading loading-spinner"></span> : `Página ${page} de ${totalPages}`
                                            }
                                        </span>
                                        <button
                                            disabled={page === totalPages}
                                            onClick={() => loadProducts(page + 1, search, selectedBranch?.id || "")}
                                            className="btn btn-sm btn-outline bg-white"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            />
                        )
                    }
                </div>


            </div>

            {/* Modal for Creating Product/Service */}
            {isModalOpen && (
                <ModalCreateProductOrService
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={() => loadProducts(1, search, selectedBranch?.id || "")}
                />
            )}
        </div>
    );
};
