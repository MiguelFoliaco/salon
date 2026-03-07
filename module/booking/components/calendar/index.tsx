import { useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/style.css";
import { useEmploye } from "../../context/use-employe";
import { useToast } from "@/module/common/hook/useToast";



type BookingCalendarProps = {
    selected?: Date;
    onSelectDate: (date?: Date) => void;
    disabled?: boolean;
};

export const BookingCalendar = ({ selected, onSelectDate, disabled }: BookingCalendarProps) => {
    const { selectedEmployee } = useEmploye()
    const { openToast } = useToast()
    const generateHiddenDays = useMemo(() => {
        if (!selectedEmployee) return []
        const { employee } = selectedEmployee;
        const hoursAvailable = employee?.hours_available as HoursAvailable;
        if (!hoursAvailable) return [];

        const dayMap: Record<DaysOfWeek, number> = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6
        };

        const hiddenDaysOfWeek: number[] = [];

        (Object.keys(dayMap) as DaysOfWeek[]).forEach(day => {
            const hours = hoursAvailable[day];
            if (!hours || hours.length === 0) {
                hiddenDaysOfWeek.push(dayMap[day]);
            }
        });

        return hiddenDaysOfWeek;
    }, [selectedEmployee])



    return (
        <DayPicker
            className="rounded-md border-2 border-gray-200 p-4 shadow w-fit calendar"
            animate
            mode="single"
            selected={selected}
            onSelect={onSelectDate}
            onDayClick={(e) => {
                if (disabled) {
                    openToast("Debes seleccionar un empleado primero", "error")
                    return;
                }
                onSelectDate(e)
            }}

            disabled={{ before: new Date() }}
            hidden={{ dayOfWeek: generateHiddenDays }}
            classNames={{
                selected: 'bg-primary rounded-full text-secondary-content',
                month_caption: 'font-semibold mb-2 ',
                button_next: 'mb-4 ml-3',
                button_previous: 'mb-4',
                today: 'text-primary',
                disabled: 'text-gray-500'
            }}
        />
    );
}


type DaysOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type HoursAvailable = {
    // example: {end: '12:00', start: '08:30'}
    [key in DaysOfWeek]: { end: string, start: string }[];
}