'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export async function getAdminEmployees(page = 1, limit = 10, search = '') {
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    let query = supabase
        .from('employes')
        .select(`
            id,
            name,
            last_name,
            phone,
            rol,
            is_active,
            title,
            created_at
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (search) {
        query = query.or(`name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching admin employees:", error);
        throw new Error("Could not fetch employees");
    }

    return {
        data,
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 1
    };
}

export async function updateEmployee(id: string, updateData: { rol?: 'admin' | 'cashier' | 'stylist', is_active?: boolean }) {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    const { data: employe } = await supabase
        .from('employes')
        .select('rol')
        .eq('auth_id', authData.user.id)
        .maybeSingle();

    if (!employe || employe.rol !== 'admin') {
        throw new Error("Unauthorized admin action");
    }

    const { error } = await supabase
        .from('employes')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error("Error updating employee:", error);
        throw new Error("Could not update employee");
    }

    revalidatePath('/admin/employees');
    return true;
}

export async function searchClientForEmployee(searchTerm: string) {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from('clients')
        .select('auth_id, email, name, lastname')
        .or(`email.ilike.%${searchTerm}%,name.ilike.%${searchTerm}%`)
        .limit(5);

    if (error) {
        console.error("Error searching client:", error);
        throw new Error("Could not search for users");
    }

    return data;
}

export async function createEmployee(data: { auth_id: string, name: string, last_name: string, phone: string, rol: 'admin' | 'cashier' | 'stylist', title: string }) {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    const { data: employe } = await supabase
        .from('employes')
        .select('rol')
        .eq('auth_id', authData.user.id)
        .maybeSingle();

    if (!employe || employe.rol !== 'admin') {
        throw new Error("Unauthorized admin action");
    }

    const { error } = await supabase
        .from('employes')
        .insert([{
            ...data,
            is_active: true
        }]);

    if (error) {
        console.error("Error creating employee:", error);
        throw new Error("Could not create employee");
    }

    revalidatePath('/admin/employees');
    return true;
}

export const getAdminEmployee = cache(async () => {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");
    const { data, error } = await supabase
        .from('employes')
        .select('id, name, last_name, phone, rol, is_active, title, created_at')
        .eq('auth_id', authData.user.id)
        .eq('rol', 'admin')
        .maybeSingle();

    if (error) {
        console.error("Error fetching admin employees:", error);
        throw new Error("Could not fetch employees");
    }

    return data;
})

export const getStylistEmployee = cache(async (id: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('employes')
        .select('id, name, last_name, hours_available, title')
        .eq('rol', 'stylist')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error("Error fetching stylist employees:", error);
        throw new Error("Could not fetch employees");
    }

    return data;
})

export type AdminEmployee = Awaited<ReturnType<typeof getAdminEmployee>>