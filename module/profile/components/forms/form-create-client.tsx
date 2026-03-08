import { TablesInsert } from '@/supabase/database.types'
import React, { useState } from 'react'
import { useUser } from '@/module/auth/context/useUser'
import { useToast } from '@/module/common/hook/useToast'
import { useProfile, useProfilePage } from '../../hook/use-profile'
import { saveClient } from '../../actions/save-client'
import { BsPersonVcard, BsPerson, BsTelephone } from 'react-icons/bs'

const defaultInto: TablesInsert<'clients'> = {
    auth_id: '',
    identity_type: 'DNI',
    identity_value: '',
    lastname: '',
    name: '',
    phone: ''
}

export const FormCreateClient = () => {
    const [formClient, setFormClient] = useState<TablesInsert<'clients'>>(defaultInto)
    const [loading, setLoading] = useState(false)
    const { setClient } = useProfile()
    const { user } = useUser()
    const { openToast } = useToast()
    const { load } = useProfile()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name == 'phone') {
            const textRegx = /[^0-9]/
            const newValue = value.replace(textRegx, '')
            setFormClient(prev => ({ ...prev, [name]: newValue }))
            return;
        }
        setFormClient(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user?.id) {
            openToast('No se encontró el usuario actual. Por favor, intente iniciar sesión nuevamente.', 'error')
            return
        }

        setLoading(true)
        try {
            const entry = { ...formClient, auth_id: user.id }
            const result = await saveClient({ entry })

            if (result.status && result.data) {
                openToast(result.msg || 'Perfil creado correctamente', 'success')
                setClient(result.data)
                await load()
            } else {
                openToast(result.msg || 'Hubo un error al crear el perfil', 'error')
            }
        } catch (error) {
            console.error(error)
            openToast('Error interno al crear el perfil', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full max-w-2xl mx-auto bg-white border border-slate-100 shadow-sm rounded-4xl p-8 md:p-10'>
            <div className='mb-8 text-center'>
                <h2 className='text-2xl font-bold text-slate-900 mb-2'>Completa tu Perfil</h2>
                <p className='text-slate-500'>Necesitamos algunos datos para gestionar tus reservas.</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Name */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPerson className='text-[#f76d91]' /> Nombre
                        </label>
                        <input
                            type='text'
                            name='name'
                            required
                            value={formClient.name}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white'
                            placeholder='Ej: Laura'
                        />
                    </div>

                    {/* Lastname */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPerson className='text-[#f76d91]' /> Apellido
                        </label>
                        <input
                            type='text'
                            name='lastname'
                            required
                            value={formClient.lastname}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white'
                            placeholder='Ej: Rodríguez'
                        />
                    </div>
                    {/* Lastname 2*/}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPerson className='text-[#f76d91]' /> Segundo Apellido
                        </label>
                        <input
                            type='text'
                            name='lastname_2'
                            required
                            value={formClient.lastname_2 || ''}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white'
                            placeholder='Ej: Rodríguez'
                        />
                    </div>

                    {/* Identity Type */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-[#f76d91]' /> Tipo de Persona
                        </label>
                        <select
                            name='client_type'
                            required
                            value={formClient.client_type || 'natural'}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white appearance-none'
                        >
                            <option value='natural'>Natural</option>
                            <option value='juridico'>Juridica</option>
                        </select>
                    </div>

                    {/* Identity Type */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-[#f76d91]' /> Tipo de Documento
                        </label>
                        <select
                            name='identity_type'
                            required
                            value={formClient.identity_type}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white appearance-none'
                        >
                            <option value='DNI'>DNI / Cédula</option>
                            <option value='PASSPORT'>Pasaporte</option>
                            <option value='ID'>Otro ID</option>
                        </select>
                    </div>

                    {/* Identity Value */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-[#f76d91]' /> Número de Documento
                        </label>
                        <input
                            type='text'
                            name='identity_value'
                            required
                            value={formClient.identity_value}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white'
                            placeholder='Ej: 1023456789'
                        />
                    </div>

                    {/* Phone */}
                    <div className='space-y-2 md:col-span-1'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsTelephone className='text-[#f76d91]' /> Teléfono
                        </label>
                        <div
                            className='w-full px-4 py-2 flex rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white'
                        >
                            <select className='select w-fit select-sm border-none' defaultValue={'+57'}>
                                <option value='+57'>+57 </option>
                            </select>
                            <input
                                type='text'
                                name='phone'
                                maxLength={10}
                                required
                                value={formClient.phone}
                                onChange={handleChange}
                                className='pl-3 w-fit'
                                placeholder='Ej: 300 123 4567'
                            />
                        </div>
                    </div>
                    { /* Direction */}
                    <div className='space-y-2 md:col-span-1'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-[#f76d91]' /> Correo electronico
                        </label>
                        <input
                            type='email'
                            name='email'
                            required
                            value={formClient?.email || user?.email || ''}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white'
                            placeholder='Ej: Cartagena de indias, Villa grande'
                        />
                    </div>
                    { /* Direction */}
                    <div className='space-y-2 md:col-span-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-[#f76d91]' /> Dirección
                        </label>
                        <input
                            type='text'
                            name='address'
                            required
                            value={formClient?.address || ''}
                            onChange={handleChange}
                            className='w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#f76d91] focus:ring-2 focus:ring-[#f76d91]/20 outline-none transition-all text-slate-900 bg-slate-50 focus:bg-white'
                            placeholder='Ej: Cartagena de indias, Villa grande'
                        />
                    </div>

                </div>

                <div className='pt-4'>
                    <button
                        type='submit'
                        disabled={loading}
                        className='btn btn-primary w-full btn-lg'
                    >
                        {loading ? (
                            <>
                                <span className='loading loading-spinner loading-sm'></span>
                                Guardando...
                            </>
                        ) : (
                            'Guardar Perfil'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}