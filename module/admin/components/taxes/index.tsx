'use client';

import { useState, useEffect } from 'react';
import { getAdminTaxes, createAdminTax } from '../../actions/taxes';
import { BsPlusLg, BsCashCoin, BsPercent, BsReceiptCutoff } from 'react-icons/bs';
import { format } from 'date-fns';

export const AdminTaxes = () => {
    const [taxes, setTaxes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [percentage, setPercentage] = useState('');
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadTaxes = async () => {
        setLoading(true);
        try {
            const res = await getAdminTaxes();
            setTaxes(res || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTaxes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createAdminTax({
                name,
                percentage: parseFloat(percentage) / 100, // store as decimal
                code
            });
            setIsModalOpen(false);
            setName('');
            setPercentage('');
            setCode('');
            loadTaxes();
        } catch (error) {
            console.error("Failed to create tax", error);
            alert("Error al crear el impuesto. Verifica el código (debe ser único).");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Impuestos (Taxes)</h1>
                    <p className="text-slate-500 mt-1">Configura las tasas impositivas disponibles para tus productos y servicios.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary gap-2 text-white"
                >
                    <BsPlusLg />
                    Nuevo Impuesto
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                                <th className="p-4 font-semibold">Código</th>
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold text-center">Tasa (%)</th>
                                <th className="p-4 font-semibold">Fecha de Creación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        <span className="loading loading-spinner text-primary"></span>
                                    </td>
                                </tr>
                            ) : taxes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No hay impuestos registrados.
                                    </td>
                                </tr>
                            ) : (
                                taxes.map((tax) => (
                                    <tr key={tax.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <BsReceiptCutoff className="text-slate-400" />
                                                <span className="font-bold font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                    {tax.code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-slate-900">{tax.name}</p>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold">
                                                {tax.percentage * 100} <BsPercent size={12} />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm text-slate-600">{format(new Date(tax.created_at), 'MMM d, yyyy')}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Creating Tax */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center">
                                <BsCashCoin size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Impuesto</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: IVA 19%"
                                    className="input input-bordered w-full"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Porcentaje</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            placeholder="19"
                                            className="input input-bordered w-full pr-8"
                                            value={percentage}
                                            onChange={e => setPercentage(e.target.value)}
                                        />
                                        <BsPercent className="absolute right-3 top-3.5 text-slate-400" size={14} />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Código Único</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="IVA_19"
                                        className="input input-bordered w-full uppercase"
                                        value={code}
                                        onChange={e => setCode(e.target.value.toUpperCase())}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    className="btn btn-ghost flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-1 text-white"
                                    disabled={submitting}
                                >
                                    {submitting ? <span className="loading loading-spinner text-white"></span> : 'Guardar Impuesto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
