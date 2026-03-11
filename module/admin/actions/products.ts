'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminProducts(page = 1, limit = 10, search = '') {
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    let query = supabase
        .from('products')
        .select(`
            id,
            name,
            value,
            stock,
            is_active,
            is_service,
            estimate_time_in_minutes,
            type:product_types(name),
            taxe:taxes(percentage)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching admin products:", error);
        throw new Error("Could not fetch products");
    }

    return {
        data,
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 1
    };
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
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
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) {
        console.error("Error toggling product status:", error);
        throw new Error("Could not update status");
    }

    revalidatePath('/admin/products');
    return true;
}

export async function createAdminProduct(productData: any) {
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

    // Assign missing boolean based on default
    const payload = { ...productData, is_active: true };

    const { error } = await supabase
        .from('products')
        .insert([payload]);

    if (error) {
        console.error("Error creating product:", error);
        throw new Error("Could not create product");
    }

    revalidatePath('/admin/products');
    return true;
}
