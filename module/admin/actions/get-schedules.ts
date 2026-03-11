'use server';

import { createClient } from "@/supabase/server";

export async function getAdminSchedules(page = 1, limit = 10) {
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    let query = supabase
        .from('schedules')
        .select(`
            id,
            start_time,
            end_time,
            status,
            client:clients!inner(name, lastname),
            employee:employes!inner(name, last_name),
            product:products!inner(name, value, is_service)
        `, { count: 'exact' })
        .order('start_time', { ascending: false })
        .range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching admin schedules:", error);
        throw new Error("Could not fetch schedules");
    }

    return {
        data,
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 1
    };
}
