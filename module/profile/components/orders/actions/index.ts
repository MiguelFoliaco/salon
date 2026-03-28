'use server';
import { createClient } from "@/supabase/server";
import { cache } from "react";



type args = {
    client_id: string;
    page: number;
    limit: number;
}

const select = ` 
    address_delivery,
    branch: branch_id!inner(id, name),
    city_delivery,
    client_id,
    country_delivery,
    created_at,
    department_delivery,
    id,
    latitude_delivery,
    longitude_delivery,
    products,
    reference_code,
    service_id,
    shedule_id,
    status,
    total_amount,
    updated_at`

export const getOrders = cache(async ({ client_id, page, limit }: args) => {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = page * limit - 1;
    const { data, error } = await supabase.from('purchases').select(select).eq('client_id', client_id).range(from, to);
    if (error) return { data: [], total: 0, page, totalPages: 0 };
    const { count: total } = await supabase.from('purchases').select('id', { count: 'exact' }).eq('client_id', client_id);
    return { data, total: total || 0, page, totalPages: Math.ceil((total || 0) / limit) };
})

export type Orders = NonNullable<Awaited<ReturnType<typeof getOrders>>>['data']
export type Order = Orders[number]