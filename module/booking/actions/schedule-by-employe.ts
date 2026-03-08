'use server';

import { TablesInsert } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";
import { cache } from "react";

export const getSchedulesByEmployeeAndDate = cache(async ({ employeeId, dateIsoStr }: { employeeId: string, dateIsoStr: string }) => {
    const client = await createClient();

    // Parse the date to get beginning and end of the local day
    // We assume dateIsoStr is a YYYY-MM-DD string or similar
    const startOfDay = new Date(dateIsoStr);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);

    const { data, error } = await client
        .from('schedules')
        .select(`
            id,
            start_time,
            end_time,
            status
        `)
        .eq('employee_id', employeeId)
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .neq('status', 'cancelled'); // Assuming cancelled appointments don't block time

    if (error) {
        console.error("Error fetching schedules:", error);
        return [];
    }

    return data;
}
)


type ArgsInsert = {
    entry: TablesInsert<'schedules'>
}
export const saveSchedule = async ({ entry }: ArgsInsert) => {

    const client = await createClient();

    const insert = await client.from('schedules').insert(entry).select('id').maybeSingle();

    return insert;
}