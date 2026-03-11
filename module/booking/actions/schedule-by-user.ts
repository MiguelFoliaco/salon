'use server';


import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

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

export const getSchedulesByUser = cache(async ({
    page = 1,
    limit = 10,
    filterType = 'upcoming'
}: {
    page?: number,
    limit?: number,
    filterType?: 'upcoming' | 'past' | 'cancelled'
} = {}) => {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/login');
    }

    const client = await supabase.from('clients').select('id').eq('auth_id', user.id).maybeSingle();

    if (!client.data) {
        redirect('/login');
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('schedules')
        .select(select, { count: 'exact' })
        .eq('client_id', client.data.id)
        .order('start_time', { ascending: filterType === 'upcoming' });

    // Apply filters
    const nowIso = new Date().toISOString();

    if (filterType === 'upcoming') {
        // Not cancelled AND start_time is in the future
        query = query.neq('status', 'cancelled').gte('start_time', nowIso);
    } else if (filterType === 'past') {
        // Completed OR (start_time in the past AND not cancelled)
        // Since Supabase doesn't easily do OR across same column without or syntax:
        query = query.or(`status.eq.completed,and(start_time.lt.${nowIso},status.neq.cancelled)`);
    } else if (filterType === 'cancelled') {
        query = query.eq('status', 'cancelled');
    }

    // Apply pagination
    const { data: schedules, count, error } = await query.range(from, to);

    if (error) {
        console.error('Error fetching schedules:', error);
        return { data: [], total: 0, page, totalPages: 0 };
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
        data: schedules as any[], // Typing bypass for complex query
        total,
        page,
        totalPages
    };
})

export type SchedulesByUserResponse = Awaited<ReturnType<typeof getSchedulesByUser>>;
export type SchedulesByUser = SchedulesByUserResponse['data'];