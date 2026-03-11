import { useEffect, useState } from "react";
import { format, addMinutes, isBefore, startOfToday } from "date-fns";
import { useEmploye } from "../../context/use-employe";
import { getSchedulesByEmployeeAndDate } from "../../actions/schedule-by-employe";
import { TbClockCheck, TbClockExclamation } from "react-icons/tb";
import clsx from "clsx";

type TimeSlotsProps = {
    selectedDate?: Date;
    durationInMinutes: number;
    onSlotSelect?: (slot: Date) => void;
};

type Schedule = {
    id: string;
    start_time: string;
    end_time: string;
    status: string;
};

export const TimeSlots = ({ selectedDate, durationInMinutes, onSlotSelect }: TimeSlotsProps) => {
    const { selectedEmployee } = useEmploye();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

    // Default duration to 30 min if 0 or not set
    const duration = durationInMinutes || 30;
    useEffect(() => {
        if (!selectedDate || !selectedEmployee) {
            setSchedules([]);
            return;
        }

        const fetchSchedules = async () => {
            setLoading(true);
            try {
                // To avoid timezone issues passing to DB, use local date formatted (or ISO of local start/end)
                // getSchedulesByEmployeeAndDate handles start/end of day using ISO string
                // Pass a local string like 'YYYY-MM-DD' instead of standard ISO to avoid UTC shift
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                const day = String(selectedDate.getDate()).padStart(2, '0');

                const data = await getSchedulesByEmployeeAndDate({
                    employeeId: selectedEmployee.employee.id,
                    dateIsoStr: `${year}-${month}-${day}T00:00:00`
                });
                setSchedules(data as Schedule[]);
            } catch (error) {
                console.error("Error fetching schedules:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
        setSelectedSlot(null); // reset selected slot on date change
    }, [selectedDate, selectedEmployee]);

    if (!selectedDate) {
        return (
            <div className="flex items-center justify-center p-8 border-2 border-gray-200 border-dashed rounded-md text-gray-400">
                Selecciona una fecha en el calendario
            </div>
        );
    }

    if (!selectedEmployee) {
        return (
            <div className="flex items-center justify-center p-8 border-2 border-gray-200 border-dashed rounded-md text-gray-400">
                Selecciona un empleado primero
            </div>
        );
    }

    const { employee } = selectedEmployee;
    const hoursAvailable = employee?.hours_available as any; // Record<DaysOfWeek, {start, end}[]>

    if (!hoursAvailable) {
        return <div>No hay horarios configurados para este empleado.</div>;
    }

    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeekStr = dayMap[selectedDate.getDay()];
    const todayHours = hoursAvailable[dayOfWeekStr] || [];

    if (todayHours.length === 0) {
        return (
            <div className="flex items-center justify-center p-8 border-2 border-gray-200 border-dashed rounded-md text-gray-400">
                No hay agenda disponible para este día
            </div>
        );
    }

    // Generate slots
    const slots: Date[] = [];

    todayHours.forEach((block: { start: string, end: string }) => {
        const [startHour, startMin] = block.start.split(':').map(Number);
        const [endHour, endMin] = block.end.split(':').map(Number);

        let currentSlot = new Date(selectedDate);
        currentSlot.setHours(startHour, startMin, 0, 0);

        const endSlotLimit = new Date(selectedDate);
        endSlotLimit.setHours(endHour, endMin, 0, 0);

        while (true) {
            const nextSlot = addMinutes(currentSlot, duration);
            if (nextSlot > endSlotLimit) break;

            slots.push(new Date(currentSlot));
            currentSlot = nextSlot;
        }
    });

    const now = new Date();

    const processedSlots: { isDisabled: boolean, slot: Date, passTime: boolean }[] = slots.map(slot => {
        // Prevent booking in the past
        let isPast = isBefore(slot, now);
        let passTime = false;
        let isDisabled = isPast;

        if (isPast) {
            passTime = true;
        }

        if (!isPast) {
            const slotEnd = addMinutes(slot, duration);
            // Check collision with existing schedules
            isDisabled = schedules.some(schedule => {
                const schedStart = new Date(schedule.start_time);
                const schedEnd = new Date(schedule.end_time);

                // True if slot overlaps with schedule
                return (slot < schedEnd && slotEnd > schedStart);
            });
        }

        return { slot, isDisabled, passTime };
    });

    return (
        <div className="flex flex-col h-full w-full">
            {loading ? (
                <div className="flex justify-center grow p-4">
                    <span className="loading loading-spinner text-[#f76d91] loading-md"></span>
                </div>
            ) : processedSlots.length === 0 ? (
                <div className="flex items-center justify-center p-8 border border-slate-100 rounded-4xl text-slate-400 font-medium bg-slate-50">
                    No hay horas disponibles para este día
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[400px] pr-2 pb-4 scrollbar-hide">
                    {processedSlots.map(({ slot, isDisabled, passTime }, i) => {
                        const isSelected = selectedSlot?.getTime() === slot.getTime();
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    if (isDisabled) return;
                                    setSelectedSlot(slot)
                                    onSlotSelect?.(slot)
                                }}
                                disabled={isDisabled}
                                className={
                                    clsx(
                                        " flex flex-col items-center justify-center py-3 px-2 rounded-4xl border transition-all shadow-sm",
                                        isDisabled ?
                                            (passTime ? 'border-red-200 bg-red-50 cursor-not-allowed' : 'border-info bg-info/10 cursor-not-allowed')
                                            : isSelected
                                                ? 'border-[#f76d91] bg-pink-50/50'
                                                : 'border-slate-100 bg-white hover:border-[#f76d91]/50 hover:shadow-md'
                                    )
                                }
                            >
                                <span className={
                                    clsx(
                                        "font-bold text-base flex items-center gap-2 ",
                                        (isDisabled && passTime) && 'text-error',
                                        (isDisabled && !passTime) && 'text-info',
                                        isSelected && 'text-[#f76d91]',
                                    )}>
                                    {format(slot, "hh:mm a")}
                                    {
                                        passTime && <TbClockExclamation className="text-error" />
                                    }
                                    {
                                        (isDisabled && !passTime) && <TbClockCheck className="text-info" />
                                    }
                                </span>
                                <span className={
                                    clsx(
                                        "text-xs mt-0.5 font-medium",
                                        passTime && 'text-error',
                                        !passTime && isDisabled && 'text-info',
                                        !isDisabled && !passTime && 'text-slate-400',
                                        isSelected && 'text-[#f76d91]'
                                    )
                                }>
                                    {
                                        passTime && 'Fuera de horario'
                                    }
                                    {
                                        (!passTime && isDisabled && !isSelected) && 'Ocupado'
                                    }
                                    {
                                        (!isDisabled && !passTime && !isSelected) && 'Disponible'
                                    }
                                    {
                                        isSelected && 'Seleccionado'
                                    }
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
