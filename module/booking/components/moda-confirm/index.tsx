"use client"

import { EmployeeByService } from "@/module/employe/actions/get-employee-by-service"
import { Product } from "@/module/product/actions/get-products"
import { calculatePrice } from "@/module/utils/calculate-priece"
import { TablesInsert } from "@/supabase/database.types"
import { FiCalendar, FiClock, FiUser, FiScissors, FiX, FiCheck, FiDollarSign } from "react-icons/fi"
import { saveSchedule } from "../../actions/schedule-by-employe"
import { useToast } from "@/module/common/hook/useToast"

interface BookingData {
    stylist: {
        name: string
        role: string
        image: string
    }
    service: string
    date: string
    time: string
    price: number
}


export function ModalConfirmBooking({
    schedule,
    service,
    employe,
    onSuccess,
    onClose
}: { schedule: TablesInsert<'schedules'>, onSuccess: () => void, onClose: () => void, service: Product, employe: EmployeeByService['employee'] }) {

    const { openToast } = useToast()

    const onConfirm = async () => {
        const response = await saveSchedule({ entry: schedule })
        if (response.data?.id) {
            openToast("Se agendo la cita con exito, debe confirmar la cita en el panel del perfil", "success");
            onSuccess()
            return;
        }
        console.error(response)
        openToast("Ocurrio un error en agendar la cita, por favor intentelo mas tarde", "error")
    }
    return (
        <dialog className="modal modal-open">
            <div className="modal-box bg-white max-w-md p-0 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-pink-500 to-pink-400 p-6 text-white relative">
                    <button
                        onClick={onClose}
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
                            <div className="w-16 rounded-full ring ring-pink-500 ring-offset-2">
                                <img src={employe.photo!} alt={schedule.employee_id || ''} />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{employe.name}</h4>
                            <p className="text-pink-500 text-sm uppercase tracking-wide font-medium">
                                {employe.title}
                            </p>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                <FiScissors className="w-5 h-5 text-pink-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Servicio</p>
                                <p className="font-medium">{service.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                <FiCalendar className="w-5 h-5 text-pink-500" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha</p>
                                <p className="font-medium">{schedule.start_time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                <FiClock className="w-5 h-5 text-pink-500" />
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
                            onClick={onClose}
                            className="btn btn-outline flex-1 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn bg-linear-to-r from-pink-500 to-pink-400 border-none text-white flex-1 rounded-xl hover:from-pink-600 hover:to-pink-500"
                        >
                            <FiCheck className="w-5 h-5" />
                            Confirmar
                        </button>
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
