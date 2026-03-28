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


const selectOrder = `
  id,
  purchase: purchases(
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
    updated_at
  ),
  purchase_id,
  deliver_id,
  estimate_start_time,
  estimate_end_time,
  actual_end_time,
  actual_start_time,
  created_at,
  updated_at
`


export const getOrdersWithDelivery = cache(async ({ client_id, page, limit }: args) => {
    const supabase = await createClient();
    const from = (page - 1) * limit;
    const to = page * limit - 1;
    const { data, error } = await supabase.from('delivery').select(selectOrder).eq('purchase.client_id', client_id).range(from, to);
    if (error) return { data: [], total: 0, page, totalPages: 0 };
    const { count: total } = await supabase.from('delivery').select('id', { count: 'exact' }).eq('purchase.client_id', client_id);
    return { data, total: total || 0, page, totalPages: Math.ceil((total || 0) / limit) };
})

export type OrdersWithDelivery = NonNullable<Awaited<ReturnType<typeof getOrdersWithDelivery>>>['data']
export type OrderWithDelivery = OrdersWithDelivery[number]