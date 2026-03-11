'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAdminSettings() {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    // Taking the first configuration, usually the system only needs one globally or per branch.
    const { data, error } = await supabase
        .from('configurations')
        .select('*')
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error("Error fetching admin settings:", error);
        throw new Error("Could not fetch settings");
    }

    return data;
}

export async function updateAdminSettings(id: string, updateData: any) {
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
        .from('configurations')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error("Error updating settings:", error);
        throw new Error("Could not update settings");
    }

    revalidatePath('/admin/settings');
    return true;
}
