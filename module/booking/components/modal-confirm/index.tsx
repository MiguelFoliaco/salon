"use client"

import { EmployeeByService } from "@/module/employe/actions/get-employee-by-service"
import { Product } from "@/module/product/actions/get-products"
import { calculatePrice } from "@/module/utils/calculate-priece"
import { TablesInsert } from "@/supabase/database.types"
import { FiCalendar, FiClock, FiUser, FiScissors, FiX, FiCheck, FiDollarSign } from "react-icons/fi"
import { saveSchedule } from "../../actions/schedule-by-employe"
import { useToast } from "@/module/common/hook/useToast"
import { generateHash, savePurchase } from "@/module/checkout/actions"
import { useRef, useState } from "react"
import { CONSTANT } from "@/constant"


export function ModalConfirmBooking({
    schedule,
    service,
    employe,
    onSuccess,
    onClose
}: { schedule: TablesInsert<'schedules'>, onSuccess?: () => void, onClose: () => void, service: Product, employe: EmployeeByService['employee'] }) {

    const containerCheckout = useRef<HTMLDivElement>(null)
    const { openToast } = useToast()
    const [loading, setLoading] = useState(false)

    //Redireccionar al checkout y almacenar la informacion
    const onConfirm = async () => {
        try {
            setLoading(true)
            const response = await saveSchedule({ entry: schedule })

            if (!response.data?.id) {
                openToast("Ocurrio un error en agendar la cita, por favor intentelo mas tarde", "error")
                setLoading(false)
                return;
            }

            const amount = calculatePrice(service) * 100
            const responseSavePurchase = await savePurchase({
                amount,
                transaction_type: 'income',
                client_id: schedule.client_id,
                products: [],
                services: [service.id],
                total_amount: calculatePrice(service),
                reference_code: schedule.id,
                payment_method: 'cash',
                status: 'pending',
                branch_id: schedule.branch_id,
                tax_amount: 0,
                schedule_id: schedule.id,
            })

            if (!responseSavePurchase.success || !responseSavePurchase.data?.id) {
                openToast(responseSavePurchase.message, "error")
                setLoading(false)
                return
            }

            const hash256 = await generateHash({
                amount,
                currency: 'COP',
                reference: responseSavePurchase.data.id,
                integrity: process.env.NEXT_PUBLIC_INTEGRITY_HASH || ''
            })
            if (!hash256.response.data.hash) {
                openToast("Ocurrio un error al generar el hash, por favor intentelo mas tarde, revise en sus citas e intente pagar desde ahí", "error")
                setLoading(false)
                return
            }
            openToast("Cita agendada exitosamente, para confirmar sera redireccionado ha realizar el pago mediante WOMPI", "success")

            const form = document.createElement('form')
            const script = document.createElement('script')
            script.src = "https://checkout.wompi.co/widget.js"
            script.setAttribute("data-render", "button")
            script.setAttribute("data-expiration-time", hash256.expirationTime)
            script.setAttribute("data-public-key", CONSTANT.WOMPI_PUBLIC_KEY)
            script.setAttribute("data-currency", "COP")
            script.setAttribute("data-amount-in-cents", amount.toString())
            script.setAttribute("data-reference", responseSavePurchase.data.id)
            script.setAttribute("data-signature:integrity", hash256.response.data.hash)
            script.setAttribute("data-redirect-url", CONSTANT.URL_APP)
            form.appendChild(script)
            containerCheckout.current?.appendChild(form)
            setTimeout(() => {
                const button = form.querySelector("button");
                if (!button) {
                    openToast("Ocurrio un error al generar el pago, por favor intentelo mas tarde, revise en sus citas e intente pagar desde ahí", "error")
                    setLoading(false)
                    return
                }
                button.click()
            }, 1000)
            onSuccess?.()
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            openToast("Ocurrio un error en agendar la cita, por favor intentelo mas tarde", "error")
            setLoading(false)
        }


    }
    console.log('WOMPI KEY ', CONSTANT.WOMPI_PUBLIC_KEY)
    return (
        <dialog className="modal modal-open ">
            <div className="modal-box bg-base-100 max-w-md p-0 rounded-2xl ">
                {/* Header */}
                <div className="bg-linear-to-r from-primary to-black p-6 text-white relative">
                    <button
                        onClick={loading ? undefined : onClose}
                        className="btn btn-ghost btn-circle btn-sm absolute top-4 right-4 text-white hover:bg-white/20"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                    <h3 className="text-xl font-bold mb-1">Confirmar Cita</h3>
                    <p className="text-pink-100 text-sm">Revisa los detalles de tu reserva</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Stylist Card */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                        <div className="avatar">
                            <div className="w-16 rounded-full ring ring-primary ring-offset-2">
                                <img src={employe.photo!} alt={schedule.employee_id || ''} />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{employe.name}</h4>
                            <p className="text-primary text-sm uppercase tracking-wide font-medium">
                                {employe.title}
                            </p>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <FiScissors className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Servicio</p>
                                <p className="font-medium">{service.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <FiCalendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
                                <p className="font-medium">{schedule.start_time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                <FiClock className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Hora</p>
                                <p className="font-medium">{schedule.start_time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="divider my-6"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiDollarSign className="w-5 h-5" />
                            <span className="font-medium">Total a pagar</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-800">
                            ${calculatePrice(service).toFixed(2)}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            disabled={loading}
                            onClick={loading ? undefined : onClose}
                            className="btn btn-outline flex-1"
                        >
                            Cancelar
                        </button>
                        <button
                            disabled={loading}
                            onClick={loading ? undefined : onConfirm}
                            className="btn bg-linear-to-r flex-1 from-primary to-black btn-primary"
                        >
                            <FiCheck className="w-5 h-5" />
                            {loading ? 'Procesando...' : 'Confirmar'}
                        </button>
                        <div className="hidden" ref={containerCheckout} />

                    </div>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/50"
                onClick={onClose}
            >
                <button>close</button>

            </form>
        </dialog>
    )
}
