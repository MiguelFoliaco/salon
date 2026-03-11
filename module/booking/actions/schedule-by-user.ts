'use server';


import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

const select = `
    branch:branches(
        name,
        address
    ),
    client_id,
    created_at,
    employee:employes!inner(
        name,
        photo
    ),
    end_time,
    id,
    notes,
    product:products!inner(
        name,
        value,
        estimate_time_in_minutes,
        is_service,
        description,
        image,
        product_type:product_types(
            name
        )
    ),
    start_time,
    status,
    updated_at
`

export const getSchedulesByUser = async () => {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/login');
    }
    const client = await supabase.from('clients').select('id').eq('auth_id', user.id).maybeSingle();

    if (!client.data) {
        redirect('/login');
    }
    const { data: schedules, error } = await supabase
        .from('schedules')
        .select(select)
        .eq('client_id', client.data.id)
        .order('created_at', { ascending: false });

    console.log("SCHEDULES: ", schedules)
    if (error) {
        console.error('Error fetching schedules:', error);
        return [];
    }

    return schedules;
}


export type SchedulesByUser = NonNullable<Awaited<ReturnType<typeof getSchedulesByUser>>>