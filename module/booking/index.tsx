
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
import { calculatePrice } from '../utils/calculate-priece'
import { TablesInsert } from '@/supabase/database.types'
import { BiCalendar, BiRightArrow } from 'react-icons/bi'
import { BsClock, BsInfo } from 'react-icons/bs'
import { useBranches } from '../branches/context/use-branches'
import { useProfile } from '../profile/hook/use-profile'
import { ModalConfirmBooking } from './components/modal-confirm'
import Image from 'next/image'

export const BookingPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [schedule, setSchedule] = useState<TablesInsert<'schedules'> | null>(null)
    const { selectedEmployee, setSelectedEmployee } = useEmploye()
    const { selectedBranch } = useBranches()
    const { client } = useProfile()
    const { productSelected, setProductSelected } = useProduct()
    const [selectedSlot, setSelectedSlot] = useState<Date>();
    const params = useParams()
    const { openToast } = useToast()
    const router = useRouter()

    useEffect(() => {
        if (params.productId) {
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
        if (!client) {
            openToast("Debes registrate como cliente para continuar", "error")
            return
        }
        if (!selectedBranch) {
            openToast("Debes seleccionar una sucursal", "error")
            return
        }
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
            branch_id: selectedBranch.id,
            employee_id: selectedEmployee.employee.id,
            start_time: selectedSlot?.toISOString(),
            end_time: addMinutes(selectedSlot, productSelected?.estimate_time_in_minutes || 30).toISOString(),
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            client_id: client?.id,
            product_id: productSelected?.id,
            notes: ''

        }
        setSchedule(shedule)
    }

    const onSuccess = () => {
        setSchedule(null)
        setSelectedDate(undefined)
        setSelectedSlot(undefined)
        setSelectedEmployee(null)
        setProductSelected(null)
        router.push('/profile')
    }

    const disable = !selectedDate || !selectedEmployee


    return (
        <div className='w-full min-h-screen bg-slate-50 md:pb-40 pb-80 font-sans '>
            {
                (schedule && productSelected && selectedEmployee) && (
                    <ModalConfirmBooking
                        schedule={schedule}
                        service={productSelected}
                        employe={selectedEmployee.employee}
                        onSuccess={onSuccess}
                        onClose={() => setSchedule(null)}
                    />
                )
            }
            <Header />

            {
                productSelected && (
                    <main className='max-w-5xl mx-auto px-4 py-8 md:py-12'>
                        <div className='w-full h-[400px] relative mb-2 shadow'>
                            <Image src={productSelected.image!} alt={productSelected.name} quality={100} fill className='object-cover' />
                        </div>
                        {/* Header Details */}
                        <div className='mb-10'>
                            <h1 className='text-4xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight'>Book Your Glow</h1>
                            <p className='text-lg text-primary font-medium'>Pick a date and time for your sweet transformation</p>
                        </div>

                        <div className='space-y-12'>
                            {/* Select Stylist */}
                            <section>
                                <EmployesByService serviceId={productSelected.id} />
                            </section>

                            {/* Calendar & Time Slots */}
                            <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
                                <section className='flex-[0.45] w-full'>
                                    <h2 className='text-xl md:text-2xl font-bold flex items-center gap-2 mb-6 text-slate-900'>
                                        <span className='text-primary text-2xl'><BiCalendar /></span> Choose Date
                                    </h2>
                                    <div className='w-full flex justify-center bg-white  p-6 shadow-sm border border-slate-100'>
                                        <BookingCalendar disabled={!selectedEmployee} selected={selectedDate} onSelectDate={setSelectedDate} />
                                    </div>
                                </section>

                                <section className='flex-[0.55] w-full'>
                                    <h2 className='text-xl md:text-2xl font-bold flex items-center gap-2 mb-6 text-slate-900'>
                                        <span className='text-primary text-2xl'><BsClock /></span> Seleccionar hora
                                    </h2>
                                    <div className='w-full lg:max-h-[500px] max-h-[700px] overflow-auto py-5'>
                                        {selectedDate ? (
                                            <TimeSlots onSlotSelect={setSelectedSlot} selectedDate={selectedDate} durationInMinutes={productSelected?.estimate_time_in_minutes || 30} />
                                        ) : (
                                            <div className='w-full h-full flex items-center justify-center min-h-[300px] bg-white  border border-slate-100'>
                                                <p className='text-center text-lg text-slate-400 font-medium'>Primero selecciona una fecha</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                        <div role="alert" className='w-full alert alert-info alert-soft mt-5'>
                            <BsInfo className="w-5 h-5" />
                            <span>Recuerda que debes hacer tu pago para confirmar tu cita, si no realizas el pago en los proximos 15 minutos, tu cita sera cancelada</span>
                        </div>
                    </main>
                )
            }

            {/* Bottom Floating Summary Bar */}
            {
                productSelected && (
                    <div className='fixed bottom-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[90%] md:max-w-5xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]  py-5 px-6 md:px-8 z-50'>
                        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                            <div className='flex-1 w-full'>
                                <p className='text-xs font-bold text-slate-400 tracking-widest uppercase mb-1'>Booking Summary</p>
                                <div className='flex items-baseline gap-2'>
                                    <span className='text-lg font-bold text-primary'>
                                        {selectedEmployee ? `${selectedEmployee.employee.name}` : 'Stylist'}
                                    </span>
                                    <span className='text-slate-700 font-bold'>for {productSelected.name}</span>
                                </div>
                                <div className='text-sm text-slate-500 font-medium mt-1 flex items-center gap-2'>
                                    <BiCalendar />
                                    {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'No date'}
                                    {selectedSlot ? ` @ ${selectedSlot.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}
                                </div>
                            </div>

                            <div className='flex flex-col sm:flex-row items-center justify-between w-full md:w-auto gap-8'>
                                <p className='text-2xl md:text-3xl font-extrabold text-slate-900'>
                                    ${Intl.NumberFormat('en-US').format(calculatePrice(productSelected))}
                                </p>
                                <button
                                    disabled={disable}
                                    onClick={handleNextCheckout}
                                    className='bg-primary hover:bg-primary/80 text-white font-bold py-3 px-8  shadow-lg shadow-primary/30 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none flex items-center gap-2 whitespace-nowrap'
                                >
                                    Continue to Checkout
                                    <BiRightArrow className='text-xl' />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}


const addMinutes = (date: Date, minutes: number) => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + minutes);
    return newDate;
}