import { TablesInsert } from '@/supabase/database.types'
import React, { useEffect, useState } from 'react'
import { useUser } from '@/module/auth/context/useUser'
import { useToast } from '@/module/common/hook/useToast'
import { useProfile } from '../../hook/use-profile'
import { saveClient } from '../../actions/save-client'
import { BsPersonVcard, BsPerson, BsTelephone, BsArrowLeft, } from 'react-icons/bs'
import { Client } from '../../actions/get-client'
import { BiLocationPlus } from 'react-icons/bi'
import { useRegion } from '@/module/domicilios/context/use-region'
import { Map } from '@/module/domicilios/map'
import { FaMapLocation } from 'react-icons/fa6'

const defaultInto: TablesInsert<'clients'> = {
    auth_id: '',
    identity_type: 'DNI',
    identity_value: '',
    lastname: '',
    name: '',
    phone: ''
}

type Props = {
    client: Client | null
    editProfile: boolean
    setEditProfile: (value: boolean) => void
}

export const FormCreateClient = ({ client, editProfile, setEditProfile }: Props) => {
    const [formClient, setFormClient] = useState<TablesInsert<'clients'>>(client ?? defaultInto)
    const { regions, loadCities, cities } = useRegion()
    const [loadingCities, setLoadingCities] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingLocation, setLoadingLocation] = useState(false)
    const { setClient } = useProfile()
    const { user } = useUser()
    const { openToast } = useToast()
    const { load } = useProfile()

    useEffect(() => {
        if (client) {
            setFormClient(client)
        }
    }, [client])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name == 'phone') {
            const textRegx = /[^0-9]/
            const newValue = value.replace(textRegx, '')
            setFormClient(prev => ({ ...prev, [name]: newValue }))
            return;
        }

        console.log(name, value)
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
            const result = await saveClient({ entry, type: client ? 'update' : 'insert' })

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

    const handleRegionChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value !== '') {
            setFormClient({ ...formClient, departament: event.target?.value })
            const _region = regions.find(e => e.name.toLocaleLowerCase() === event.target?.value.toLocaleLowerCase()) || null
            setLoadingCities(true)
            await loadCities(_region?.id || 0)
            setLoadingCities(false)
        }
    }

    const loadLocation = async () => {
        if (navigator.geolocation) {
            setLoadingLocation(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormClient({
                        ...formClient,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    })
                    openToast('Ubicación cargada correctamente', 'success')
                    setLoadingLocation(false)
                },
                (error) => {
                    openToast(error.message, 'error')
                    setLoadingLocation(false)
                }
            )
        }
    }


    return (
        <div className='w-full max-w-2xl mx-auto bg-white border border-slate-100 shadow-sm p-8 md:p-10'>
            <div className='mb-8 text-center'>
                <h2 className='text-2xl font-bold text-slate-900 mb-2'>Completa tu Perfil
                    {
                        client &&
                        <button onClick={() => setEditProfile(false)} className='btn btn-circle btn-sm btn-ghost ml-3' title="Volver">
                            <BsArrowLeft />
                        </button>
                    }
                </h2>
                <p className='text-neutral/70'>Necesitamos algunos datos para gestionar tus reservas.</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Name */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPerson className='text-primary' /> Nombre
                        </label>
                        <input
                            type='text'
                            name='name'
                            required
                            value={formClient.name}
                            onChange={handleChange}
                            className='w-full input'
                            placeholder='Ej: Laura'
                        />
                    </div>

                    {/* Lastname */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPerson className='text-primary' /> Apellido
                        </label>
                        <input
                            type='text'
                            name='lastname'
                            required
                            value={formClient.lastname}
                            onChange={handleChange}
                            className='w-full input'
                            placeholder='Ej: Rodríguez'
                        />
                    </div>
                    {/* Lastname 2*/}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPerson className='text-primary' /> Segundo Apellido
                        </label>
                        <input
                            type='text'
                            name='lastname_2'
                            required
                            value={formClient.lastname_2 || ''}
                            onChange={handleChange}
                            className='w-full input'
                            placeholder='Ej: Rodríguez'
                        />
                    </div>

                    {/* Identity Type */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-primary' /> Tipo de Persona
                        </label>
                        <select
                            name='client_type'
                            required
                            value={formClient.client_type || 'natural'}
                            onChange={handleChange}
                            className='w-full input'
                        >
                            <option value='natural'>Natural</option>
                            <option value='juridico'>Juridica</option>
                        </select>
                    </div>

                    {/* Identity Type */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-primary' /> Tipo de Documento
                        </label>
                        <select
                            name='identity_type'
                            required
                            value={formClient.identity_type}
                            onChange={handleChange}
                            className='w-full input'
                        >
                            <option value='DNI'>DNI / Cédula</option>
                            <option value='PASSPORT'>Pasaporte</option>
                            <option value='ID'>Otro ID</option>
                        </select>
                    </div>

                    {/* Identity Value */}
                    <div className='space-y-2'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-primary' /> Número de Documento
                        </label>
                        <input
                            type='text'
                            name='identity_value'
                            required
                            value={formClient.identity_value}
                            onChange={handleChange}
                            className='w-full input'
                            placeholder='Ej: 1023456789'
                        />
                    </div>

                    {/* Phone */}
                    <div className='space-y-2 md:col-span-1'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsTelephone className='text-primary' /> Teléfono
                        </label>
                        <div
                            className='w-full input'
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
                            <BsPersonVcard className='text-primary' /> Correo electronico
                        </label>
                        <input
                            type='email'
                            name='email'
                            required
                            value={formClient?.email || user?.email || ''}
                            onChange={handleChange}
                            className='w-full input'
                            placeholder='Ej: Cartagena de indias, Villa grande'
                        />
                    </div>

                    <div className="space-y-2 md:col-span-1">
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BiLocationPlus className='text-primary' /> Departamento
                        </label>
                        <select
                            value={formClient?.departament ?? ''}
                            onChange={handleRegionChange}
                            name="departament" id="departament" className='w-full input'>
                            <option value="">Seleccione un departamento</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.name}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-1">
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BiLocationPlus className='text-primary' /> Ciudad
                            {loadingCities && <span className="loading loading-spinner loading-xs"></span>}
                        </label>
                        <select
                            disabled={cities.length === 0}
                            value={formClient?.city_or_municipality!}
                            onChange={(event) => {
                                if (event.target.value !== '') {
                                    setFormClient({ ...formClient, city_or_municipality: event.target.value })
                                }
                            }}
                            name="city_or_municipality" id="city_or_municipality" className='w-full input'>
                            <option value="">{
                                formClient?.city_or_municipality ?? 'Seleccione una ciudad'
                            }</option>
                            {cities?.map((city) => (
                                <option key={city.id} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='space-y-2 md:col-span-1'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-primary' /> Codigo Postal
                        </label>
                        <input
                            type='number'
                            name='postal_code'
                            required
                            value={formClient?.postal_code || ''}
                            onChange={handleChange}
                            className='w-full input'
                            placeholder='Ej: 130001'
                        />
                    </div>

                    { /* Direction */}
                    <div className='space-y-2 md:col-span-1'>
                        <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                            <BsPersonVcard className='text-primary' /> Dirección
                        </label>
                        <input
                            type='text'
                            name='address'
                            required
                            value={formClient?.address || ''}
                            onChange={handleChange}
                            className='w-full input'
                            placeholder='Ej: Cartagena de indias, Villa grande'
                        />
                    </div>
                    <div className='divider col-span-2' />
                    <div className='space-y-2 md:col-span-2 grid grid-cols-2 gap-2'>
                        <p className='text-sm text-slate-500 col-span-2'>Le recomendamos ingresar las coordenadas para presicion en la entrega de sus productos.</p>

                        <fieldset >
                            <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                                <BiLocationPlus className='text-primary' /> Latitud
                            </label>
                            <input
                                type='text'
                                name='latitude'
                                required
                                disabled
                                value={formClient?.latitude || ''}
                                // onChange={handleChange}
                                className='w-full input'
                                placeholder='Ej: 10.4203'
                            />
                        </fieldset>
                        <fieldset>
                            <label className='text-sm font-bold text-slate-700 flex items-center gap-2'>
                                <BiLocationPlus className='text-primary' /> Longitud
                            </label>
                            <input
                                type='text'
                                disabled
                                name='longitude'
                                required
                                value={formClient?.longitude || ''}
                                // onChange={handleChange}
                                className='w-full input'
                                placeholder='Ej: -75.5667'
                            />
                        </fieldset>
                    </div>

                    <button type='button' onClick={loadLocation} disabled={loadingLocation} className='w-fit col-span-2 btn btn-sm btn-primary mx-auto'>
                        {loadingLocation ? (
                            <>
                                <span className='loading loading-spinner loading-sm'></span>
                                Cargando...
                            </>
                        ) : (
                            'Cargar ubicación'
                        )}
                    </button>

                    <div className="w-full h-[300px] border border-dotted col-span-2 border-neutral/20 flex items-center justify-center">
                        {
                            formClient?.latitude && formClient?.longitude && (
                                <Map width='100%' height='100%' position={[Number(formClient?.latitude!), Number(formClient?.longitude!)]} />
                            )
                        }
                        {
                            !formClient?.latitude && !formClient?.longitude && (
                                <FaMapLocation className='text-neutral/50' size={200} />
                            )
                        }
                    </div>

                </div>

                <div className='pt-4'>
                    <button
                        type='submit'
                        disabled={loading}
                        className='btn btn-primary w-full '
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
            </form >
        </div >
    )
}