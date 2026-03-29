'use client';

import { useState, useEffect } from 'react';
import { getDeliveryEmployees, assignDeliveryEmployee } from '../../actions/orders';
import { BsX, BsPersonBadge, BsTruck } from 'react-icons/bs';

type Employee = {
    id: string;
    name: string;
    last_name: string;
    phone: string | null;
    rol: string | null;
    is_active: boolean | null;
};

type Props = {
    deliveryId: string;
    currentEmployeeId?: string | null;
    onClose: () => void;
    onSuccess: () => void;
};

export const AssignModal = ({ deliveryId, currentEmployeeId, onClose, onSuccess }: Props) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(currentEmployeeId || null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getDeliveryEmployees();
                setEmployees(res || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAssign = async () => {
        setSubmitting(true);
        try {
            await assignDeliveryEmployee(deliveryId, selectedId);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Error al asignar el domiciliario.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white  w-full max-w-md shadow-2xl relative overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <BsTruck className="text-primary" />
                        Asignar Domiciliario
                    </h2>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost"><BsX size={20} /></button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <span className="loading loading-spinner text-primary"></span>
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="text-center p-8 text-slate-500">
                            No se encontraron empleados activos con el rol 'delivery'.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-slate-500 mb-4">Selecciona el motorizado que realizará la entrega.</p>

                            {/* Option to unassign */}
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedId === null ? 'border-primary bg-pink-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                <input
                                    type="radio"
                                    name="delivery_employee"
                                    className="radio radio-primary radio-sm hidden"
                                    checked={selectedId === null}
                                    onChange={() => setSelectedId(null)}
                                />
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedId === null ? 'border-primary' : 'border-slate-300'}`}>
                                    {selectedId === null && <div className="w-2 h-2 rounded-full bg-primary" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-700 text-sm">Sin Asignar</p>
                                </div>
                            </label>

                            {employees.map(emp => (
                                <label key={emp.id} className={`flex items-center gap-3 p-3  border cursor-pointer transition-all ${selectedId === emp.id ? 'border-primary bg-pink-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                                    <input
                                        type="radio"
                                        name="delivery_employee"
                                        className="radio radio-primary radio-sm hidden"
                                        checked={selectedId === emp.id}
                                        onChange={() => setSelectedId(emp.id)}
                                    />
                                    <div className={`w-4 h-4 rounded-full border flex shrink-0 items-center justify-center ${selectedId === emp.id ? 'border-primary' : 'border-slate-300'}`}>
                                        {selectedId === emp.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                    <div className="flex items-center justify-center bg-slate-100 rounded-full w-8 h-8 shrink-0">
                                        <BsPersonBadge className="text-slate-500" />
                                    </div>
                                    <div className="flex-1 truncate">
                                        <p className="font-bold text-slate-900 text-sm truncate">{emp.name} {emp.last_name}</p>
                                        <p className="text-xs text-slate-500">{emp.phone || 'Sin teléfono'}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button type="button" className="btn btn-ghost flex-1" onClick={onClose} disabled={submitting}>Cancelar</button>
                    <button type="button" onClick={handleAssign} className="btn btn-primary flex-1 text-white" disabled={submitting || loading}>
                        {submitting ? <span className="loading loading-spinner"></span> : 'Guardar Asignación'}
                    </button>
                </div>
            </div>
        </div>
    );
};
