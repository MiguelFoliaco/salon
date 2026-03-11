'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateScheduleStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
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
        .from('schedules')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error("Error updating schedule status:", error);
        throw new Error("Could not update status");
    }

    revalidatePath('/admin');
    return true;
}
