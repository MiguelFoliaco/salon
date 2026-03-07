
import { Header } from '../common/components/header'
import { useParams } from 'next/navigation'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getProductById } from '../product/actions/get-products'
import { useToast } from '../common/hook/useToast'
import { useProduct } from '../product/context/useProduct'
import { EmployesByService } from './components/employes-by-service'
import { BookingCalendar } from './components/calendar'
import { TimeSlots } from './components/time-slots'
import { useEmploye } from './context/use-employe'
import Image from 'next/image'
import { calculatePrice } from '../utils/calculate-priece'
import clsx from 'clsx'
import { TablesInsert } from '@/supabase/database.types'

export const BookingPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const { selectedEmployee } = useEmploye()
    const { productSelected, setProductSelected } = useProduct()
    const [selectedSlot, setSelectedSlot] = useState<Date>();
    const params = useParams()
    const { openToast } = useToast()
    const router = useRouter()

    useEffect(() => {
        const productSelected = localStorage.getItem('productSelected')
        if (productSelected) {
            setProductSelected(JSON.parse(productSelected))
        }
        else if (params.productId) {
            getProductById(params.productId as string)
                .then((product) => {
                    setProductSelected(product)
                })
                .catch(() => {
                    openToast("No se encontro el producto, redirigiendo...", "info")
                    router.back()
                })
        }

    }, [setProductSelected])


    const handleNextCheckout = () => {
        if (!productSelected) {
            openToast("Debes seleccionar un producto", "error")
            return
        }
        if (!selectedDate) {
            openToast("Debes seleccionar una fecha", "error")
            return
        }

        if (!selectedEmployee) {
            openToast("Debes seleccionar un empleado", "error")
            return
        }

        if (!selectedSlot) {
            openToast("Debes seleccionar una hora", "error")
            return
        }

        const shedule: TablesInsert<'schedules'> = {
            branch_id: 'd52c8bfe-1082-4856-aea5-60ace15af816',
            employee_id: selectedEmployee.employee.id,
            start_time: selectedSlot?.toISOString(),
            end_time: selectedSlot?.toISOString(),
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            client_id: '50e8b971-e7b5-47f3-9f69-c47fb83f779a',
            product_id: productSelected?.id,
            notes: ''

        }

    }

    const disable = !selectedDate || !selectedEmployee


    return (
        <div className='w-full h-screen grid grid-cols-4 grid-rows-4' >
            <div className='col-span-4'>
                <Header />
            </div>

            {
                (productSelected) && (
                    <>

                        <p className='col-span-2 col-start-1 text-center text-2xl font-bold mt-10'>{productSelected?.name}</p>
                        <div className='col-span-3 col-start-1 gap-4 px-20 w-full'>
                            {productSelected && (
                                <EmployesByService serviceId={productSelected.id} />
                            )}
                        </div>

                        <div className={
                            clsx(
                                'col-start-1 col-span-2 w-full lg:w-10/12 px-4 md:px-0 mx-auto mt-10 flex flex-col md:flex-row gap-6 items-start mb-20',
                            )
                        }>
                            <div className='flex-1 w-full max-w-md bg-base-100 flex justify-center items-center rounded-md border-2 border-gray-200 p-4 shadow'>
                                <BookingCalendar disabled={!selectedEmployee} selected={selectedDate} onSelectDate={setSelectedDate} />
                            </div>
                            <div className="flex-1 w-full max-w-md bg-base-100 rounded-md border-2 border-gray-200 p-4 shadow">
                                {selectedDate ? (
                                    <TimeSlots onSlotSelect={setSelectedSlot} selectedDate={selectedDate} durationInMinutes={productSelected?.estimate_time_in_minutes || 30} />
                                ) :
                                    <div className='w-full h-[290px] flex items-center justify-center'>
                                        <p className='text-center text-xl text-base-content/50'>Primero selecciona una fecha</p>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className='col-span-2 col-start-3 row-start-2 row-end-5 w-10/12 mx-auto flex flex-col items-center p-10'>
                            <div className='w-full'>
                                <Image className='w-full h-[300px] object-cover' src={productSelected?.image || ''} alt={productSelected?.name || ''} width={500} height={500} />
                                <p className='mt-3 text-xl font-bold'>{productSelected?.name}</p>
                                <p className='mt-2 text-lg'>{productSelected?.description}</p>
                            </div>
                            <div className='w-full mt-5  border-t-2 border-gray-200'>
                                <p className='text-xl font-bold'>Tiempo estimado</p>
                                <p className='mt-2 text-lg'>{productSelected?.estimate_time_in_minutes} minutos</p>
                                <p className='mt-2 text-lg'>Valor: ${Intl.NumberFormat('es-AR').format(calculatePrice(productSelected))}</p>
                                <p className='mt-2 text-lg'>Fecha: {selectedDate?.toLocaleDateString()}</p>
                                <p className='mt-2 text-lg'>Hora: {selectedSlot?.toLocaleTimeString()}</p>
                                <p className='mt-2 text-lg'>Empleado: {selectedEmployee?.employee.name} {selectedEmployee?.employee.last_name}</p>
                            </div>
                            <button
                                disabled={disable}
                                onClick={handleNextCheckout}
                                className='btn btn-primary w-full mt-10'
                            >
                                Continuar
                            </button>
                        </div>
                    </>
                )
            }

        </div>
    )
}
