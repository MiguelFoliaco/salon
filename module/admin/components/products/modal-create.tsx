import React, { useEffect, useMemo, useState } from 'react'
import { createAdminProduct } from '../../actions/products';
import { BsX } from 'react-icons/bs';
import { InputImage } from '@/module/common/components/input-image';
import { AdminTax, getAdminTaxes } from '../../actions/taxes';
import { BiX } from 'react-icons/bi';
import { useBranches } from '@/module/branches/context/use-branches';
import { getProductTypes, ProductType } from '@/module/categories/actions/get-product-types';
import { useToast } from '@/module/common/hook/useToast';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


export const ModalCreateProductOrService = ({ isOpen, onClose, onSubmit }: Props) => {

    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: '', description: '', value: '', type: 'service', estimate_time_in_minutes: '30', stock: '0',
        image: '',
        taxtId: '',
        gallery: [] as string[],
        branchId: '',
        productTypeId: '',
        code: '',

    });
    const { openToast } = useToast()
    const [taxes, setTaxes] = useState<AdminTax[]>([])
    const { branches, selectedBranch, updateSelectedBranch } = useBranches()
    const [productTypes, setProductTypes] = useState<ProductType[]>([])

    useEffect(() => {
        getAdminTaxes().then((res) => {
            setTaxes(res)
        });
        getProductTypes().then((res) => {
            setProductTypes(res.data ?? [])
        })
    }, [])

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.productTypeId) return openToast("Por favor seleccione una categoria", "error")
        if (!form.name) return openToast("Por favor ingrese un nombre", "error")
        if (!form.value) return openToast("Por favor ingrese un valor", "error")
        if (form.type === 'product' && !form.stock) return openToast("Por favor ingrese un stock", "error")
        if (form.type === 'service' && !form.estimate_time_in_minutes) return openToast("Por favor ingrese un tiempo estimado", "error")
        if (!selectedBranch?.id) return openToast("Por favor seleccione una sucursal", "error")
        if (!form.taxtId) return openToast("Por favor seleccione un impuesto", "error")
        if (!form.image) return openToast("Por favor seleccione una imagen", "error")
        if (!form.code) return openToast("Por favor ingrese un código", "error")

        setSubmitting(true);
        try {
            if (form.type === 'product') {

                const gallery = form.gallery.map(e => ({ image_url: e, product_id: '' }))

                const response = await createAdminProduct({
                    product: {
                        name: form.name,
                        description: form.description,
                        value: parseFloat(form.value),
                        is_service: false,
                        estimate_time_in_minutes: parseInt(form.estimate_time_in_minutes),
                        stock: form.type === 'product' ? parseInt(form.stock) : 0,
                        is_active: true,
                        product_type_id: form.productTypeId,
                        image: form.image,
                        tax_id: form.taxtId,
                        code: form.code
                    },
                    gallery,
                    inventory: {
                        branch_id: selectedBranch?.id,
                        stock: parseInt(form.stock),
                        min_stock: parseInt(form.stock),
                        max_stock: parseInt(form.stock),
                        product_id: '',
                        updated_at: new Date().toISOString()
                    }
                });
                if (response.error) {
                    openToast(response.message, "error")
                    return
                }
                openToast(response.message, "success")
            }

            if (form.type === 'service') {

                const response = await createAdminProduct({
                    product: {
                        name: form.name,
                        description: form.description,
                        value: parseFloat(form.value),
                        is_service: true,
                        estimate_time_in_minutes: parseInt(form.estimate_time_in_minutes),
                        stock: 1,
                        is_active: true,
                        product_type_id: form.productTypeId,
                        image: form.image,
                        tax_id: form.taxtId,
                        code: form.code
                    },
                    inventory: {
                        branch_id: selectedBranch?.id,
                        stock: 1,
                        min_stock: 1,
                        max_stock: 1,
                        product_id: '',
                        updated_at: new Date().toISOString()
                    }
                });
                if (response.error) {
                    openToast(response.message, "error")
                    return
                }
                openToast(response.message, "success")
            }

            onClose()
            setForm({ name: '', code: '', productTypeId: '', description: '', value: '', type: 'service', estimate_time_in_minutes: '30', stock: '0', image: '', branchId: '', taxtId: '', gallery: [] });
            onSubmit();
        } catch (err) {
            console.error(err);
            alert("Error al crear el producto o servicio");
        } finally {
            setSubmitting(false);
        }
    };

    const valueIva = useMemo(() => {
        const tax = taxes.find(t => t.id === form.taxtId)
        if (!tax) return 0
        return parseFloat(form.value) * tax.percentage
    }, [form.value, taxes, form.taxtId])


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="bg-white w-full max-w-2xl shadow-2xl relative overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Crear Nuevo {form.type === 'service' ? 'Servicio' : 'Producto'}</h2>
                    <button onClick={() => onClose()} className="btn btn-sm btn-circle btn-ghost"><BsX size={20} /></button>
                </div>

                <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-2 mb-2 bg-slate-100 p-1 rounded-lg">
                        <button type="button" onClick={() => setForm({ ...form, type: 'service' })} className={`py-2 text-sm font-semibold rounded-md transition-all ${form.type === 'service' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>Servicio</button>
                        <button type="button" onClick={() => setForm({ ...form, type: 'product' })} className={`py-2 text-sm font-semibold rounded-md transition-all ${form.type === 'product' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}>Producto Físico</button>
                    </div>

                    <div className='flex gap-3'>
                        <div className='flex-1'>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                            <input type="text" required className="input input-bordered  w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>

                        <div className='flex-1'>
                            <label htmlFor="productTypeId" className='block text-sm font-semibold text-slate-700 mb-1'>Categoria del {form.type === 'product' ? 'producto' : 'servicio'}</label>
                            <select name="productTypeId" id="productTypeId" className="select select-bordered w-full" value={form.productTypeId} onChange={e => setForm({ ...form, productTypeId: e.target.value })}>
                                <option value="">Seleccionar categoria del {form.type === 'product' ? 'producto' : 'servicio'}</option>
                                {productTypes.map(productType => (
                                    <option key={productType.id} value={productType.id}>{productType.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {
                        form.type === "product" ?
                            <div className='w-full flex flex-col'>
                                <InputImage
                                    containerClassName='w-full max-w-full'
                                    containerImageClassName='w-full mt-2 '
                                    label='Imagen del producto Principal'
                                    initialImage={form.image}
                                    onImageUpload={(e) => setForm({ ...form, image: e })}
                                />

                                <p className='mt-2 font-semibold text-slate-700'>Galeria de imagenes</p>
                                <div className='flex flex-start overflow-x-auto gap-2'>
                                    {
                                        form.gallery.map((e, i) => (
                                            <div className='relative' key={i}>
                                                <button type='button' onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, index) => index !== i) })} className='btn-circle btn btn-error absolute top-2 right-0 z-10 btn-xs'>
                                                    <BiX />
                                                </button>
                                                <InputImage
                                                    containerClassName='w-fit my-2 flex flex-col items-center'
                                                    containerImageClassName='w-40 h-40 mt-2 '
                                                    label={`Imagen ${i + 1}`}
                                                    initialImage={e}
                                                    onImageUpload={(e) => setForm({ ...form, gallery: [...form.gallery, e] })}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                                <button type='button' onClick={() => setForm({ ...form, gallery: [...form.gallery, ''] })} className='btn btn-sm btn-primary shadow-none mt-2'>Agregar imagen</button>
                            </div>
                            :
                            <div className='w-full'>
                                <InputImage
                                    containerClassName='w-full max-w-full'
                                    containerImageClassName='w-full mt-2 '
                                    label='Imagen del servicio'
                                    initialImage={form.image}
                                    onImageUpload={(e) => setForm({ ...form, image: e })}
                                />
                            </div>
                    }
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Descripción</label>
                        <textarea className="textarea textarea-bordered w-full h-20" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Precio base </label>
                            <input type="number" required min="0" step="0.01" className="input input-bordered w-full" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                            <span className='font-light opacity-95 mt-2  ml-2 text-xs'>Valor total: {(parseFloat(form.value) + valueIva).toFixed(2)}</span>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Impuestos</label>
                            <select className="select select-bordered w-full" value={form.taxtId} onChange={e => setForm({ ...form, taxtId: e.target.value })}>
                                <option value="">Seleccionar impuesto</option>
                                {taxes.map(tax => (
                                    <option key={tax.id} value={tax.id}>{tax.name}</option>
                                ))}
                            </select>
                            <span className='font-light opacity-95 ml-2 mt-2 text-xs block'>Valor IVA: {valueIva.toFixed(2)}</span>

                        </div>
                    </div>
                    <div className='flex gap-4'>
                        {form.type === 'service' ? (
                            <>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Tiempo est. (min)</label>
                                    <input type="number" required min="1" className="input input-bordered w-full" value={form.estimate_time_in_minutes} onChange={e => setForm({ ...form, estimate_time_in_minutes: e.target.value })} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Code/Slug</label>
                                    <input type="text" className="input input-bordered w-full" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Stock Inicial</label>
                                    <input type="number" required min="0" className="input input-bordered w-full" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                                </div>
                                <div className='flex-1'>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Sucursal</label>
                                    <select className="select select-bordered w-full" value={selectedBranch?.id} onChange={e => updateSelectedBranch(branches.find(b => b.id === e.target.value) || null)}>
                                        <option value="">Seleccionar sucursal</option>
                                        {branches.map(branch => (
                                            <option key={branch.id} value={branch.id}>{branch.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Code/slug</label>
                                    <input type="text" className="input input-bordered w-full" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />
                                </div>
                            </>
                        )}

                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" className="btn btn-ghost flex-1" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary flex-1 text-white" disabled={submitting}>
                            {submitting ? <span className="loading loading-spinner"></span> : `Crear ${form.type === 'service' ? 'Servicio' : 'Producto'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
