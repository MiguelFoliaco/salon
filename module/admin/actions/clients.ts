'use server';

import { createClient } from "@/supabase/server";

export async function getAdminClients(page = 1, limit = 10, search = '') {
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    let query = supabase
        .from('clients')
        .select(`
            id,
            name,
            lastname,
            email,
            phone,
            client_type,
            identity_type,
            identity_value,
            created_at
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (search) {
        // Simple search on multiple fields by chaining OR. 
        // Supabase `or` expects a string of conditions.
        query = query.or(`name.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching admin clients:", error);
        throw new Error("Could not fetch clients");
    }

    return {
        data,
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 1
    };
}
