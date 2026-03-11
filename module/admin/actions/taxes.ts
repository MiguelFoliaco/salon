'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminTaxes() {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    const { data, error } = await supabase
        .from('taxes')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching admin taxes:", error);
        throw new Error("Could not fetch taxes");
    }

    return data;
}

export async function createAdminTax(taxData: { name: string; percentage: number; code: string }) {
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
        .from('taxes')
        .insert([taxData]);

    if (error) {
        console.error("Error creating tax:", error);
        throw new Error("Could not create tax");
    }

    revalidatePath('/admin/taxes');
    return true;
}
