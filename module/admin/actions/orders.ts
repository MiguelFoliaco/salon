'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminOrders(page = 1, limit = 10, search = '') {
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // First check auth
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    // We fetch from 'delivery' but inner join with 'purchases' so we only get those with a purchase.
    // If search is provided, we might want to filter by reference_code in purchase.
    let query = supabase
        .from('delivery')
        .select(`
            id,
            purchase_id,
            deliver_id,
            estimate_start_time,
            estimate_end_time,
            actual_end_time,
            actual_start_time,
            created_at,
            purchase:purchases!inner(
                id,
                reference_code,
                status,
                address_delivery,
                city_delivery,
                total_amount,
                products,
                branch:branch_id(name)
            ),
            employe:employes!delivery_deliver_id_fkey(
                id,
                name,
                last_name,
                phone
            )
        `, { count: 'exact' });

    if (search) {
        query = query.ilike('purchases.reference_code', `%${search}%`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching admin orders:", error);
        throw new Error("Could not fetch orders");
    }

    return {
        data,
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 1
    };
}

export type AdminOrder = NonNullable<Awaited<ReturnType<typeof getAdminOrders>>['data']>[number];

export async function getDeliveryEmployees() {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from('employes')
        .select('id, name, last_name, phone, rol, is_active')
        .eq('is_active', true)
        .eq('rol', 'delivery'); 

    if (error) {
        console.error("Error fetching delivery employees:", error);
        throw new Error("Could not fetch delivery employees");
    }

    return data;
}

export async function assignDeliveryEmployee(deliveryId: string, employeeId: string | null) {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('delivery')
        .update({ deliver_id: employeeId })
        .eq('id', deliveryId);

    if (error) {
        console.error("Error assigning employee to delivery:", error);
        throw new Error("Could not assign employee");
    }

    revalidatePath('/admin/orders');
    return true;
}
