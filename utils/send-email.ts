'use server';

import { createClient } from "@/supabase/server";

type agrs = {
    email: string;
    name: string;
    message: string;
}
export const sendEmail = async ({ email, name, message }: agrs) => {
    const supabase = await createClient();
    const { data, error } = await supabase.from('contact_me_public').insert({
        email,
        name,
        message,
    });
    if (error) {
        throw error;
    }
    return data;
}