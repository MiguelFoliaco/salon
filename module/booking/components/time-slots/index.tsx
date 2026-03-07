import { useEffect, useState } from "react";
import { format, addMinutes, isBefore, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { useEmploye } from "../../context/use-employe";
import { getSchedulesByEmployeeAndDate } from "../../actions/schedule-by-employe";

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

    const availableSlots = slots.filter(slot => {
        // Prevent booking in the past
        if (isBefore(slot, now)) return false;

        const slotEnd = addMinutes(slot, duration);

        // Check collision with existing schedules
        const hasCollision = schedules.some(schedule => {
            const schedStart = new Date(schedule.start_time);
            const schedEnd = new Date(schedule.end_time);

            // True if slot overlaps with schedule
            return (slot < schedEnd && slotEnd > schedStart);
        });

        return !hasCollision;
    });

    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold mb-4 text-center">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </h3>

            {loading ? (
                <div className="flex justify-center grow p-4">
                    <span className="loading loading-spinner text-primary loading-md"></span>
                </div>
            ) : availableSlots.length === 0 ? (
                <div className="flex items-center justify-center p-8 border-2 border-gray-200 border-dashed rounded-md text-gray-400">
                    No hay horas disponibles para este día
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto max-h-[300px] pr-2">
                    {availableSlots.map((slot, i) => {
                        const isSelected = selectedSlot?.getTime() === slot.getTime();
                        return (
                            <button
                                key={i}
                                onClick={() => {
                                    setSelectedSlot(slot)
                                    onSlotSelect?.(slot)
                                }}
                                className={`
                                    py-2 px-4 rounded-md border-2 transition-all font-medium text-sm
                                    ${isSelected
                                        ? 'bg-primary border-primary text-primary-content'
                                        : 'border-gray-200 hover:border-primary text-base-content'
                                    }
                                `}
                            >
                                {format(slot, "hh:mm a")}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
