'use client';

import { useState, useEffect } from 'react';
import { getAdminSettings, updateAdminSettings } from '../../actions/settings';
import { BsBuilding, BsTelephone, BsEnvelopeAt, BsCardText } from 'react-icons/bs';

export const AdminSettings = () => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const res = await getAdminSettings();
            setSettings(res || {});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (settings?.id) {
                // Strip unupdatable fields if any
                const { id, created_at, updated_at, ...updateData } = settings;
                await updateAdminSettings(id, updateData);
                alert("Configuraciones guardadas exitosamente!");
            }
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Error al actualizar las configuraciones");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings((prev: any) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-20">
                <span className="loading loading-spinner text-primary loading-lg"></span>
            </div>
        );
    }

    if (!settings?.id) {
        return (
            <div className="p-8 text-center text-slate-500">
                No hay configuración base en el sistema. Debe inicializarse en la base de datos primero.
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Configuración General</h1>
                <p className="text-slate-500 mt-1">Administra la información de la empresa y facturación.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Empresa Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 overflow-hidden relative">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BsBuilding className="text-primary" /> Información de la Empresa
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de Empresa</label>
                            <input
                                type="text" name="company_name"
                                className="input input-bordered w-full"
                                value={settings.company_name || ''}
                                onChange={handleChange} required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">NIT</label>
                            <input
                                type="text" name="nit"
                                className="input input-bordered w-full"
                                value={settings.nit || ''}
                                onChange={handleChange} required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Principal</label>
                            <div className="relative">
                                <input
                                    type="email" name="email"
                                    className="input input-bordered w-full pl-10"
                                    value={settings.email || ''}
                                    onChange={handleChange}
                                />
                                <BsEnvelopeAt className="absolute left-3 top-3.5 text-slate-400" size={16} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                            <div className="relative">
                                <input
                                    type="tel" name="phone"
                                    className="input input-bordered w-full pl-10"
                                    value={settings.phone || ''}
                                    onChange={handleChange}
                                />
                                <BsTelephone className="absolute left-3 top-3.5 text-slate-400" size={16} />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección Principal</label>
                            <input
                                type="text" name="address"
                                className="input input-bordered w-full"
                                value={settings.address || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Billing Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 overflow-hidden relative">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BsCardText className="text-primary" /> Facturación y DIAN
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Resolución DIAN</label>
                            <input
                                type="text" name="dian_resolution_number"
                                className="input input-bordered w-full"
                                value={settings.dian_resolution_number || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Código Verificación NIT</label>
                            <input
                                type="text" name="code_verification_nit"
                                className="input input-bordered w-full"
                                value={settings.code_verification_nit || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Prefijo Factura</label>
                            <input
                                type="text" name="invoice_prefix"
                                className="input input-bordered w-full font-mono uppercase"
                                value={settings.invoice_prefix || ''}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Consecutivo Desde</label>
                                <input
                                    type="number" name="invoice_from"
                                    className="input input-bordered w-full"
                                    value={settings.invoice_from || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Consecutivo Hasta</label>
                                <input
                                    type="number" name="invoice_to"
                                    className="input input-bordered w-full"
                                    value={settings.invoice_to || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary text-white px-8 md:w-auto w-full"
                    >
                        {saving ? <span className="loading loading-spinner"></span> : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};
