'use server';

import { CONSTANT } from "@/constant";
import { createClient } from "@/supabase/server";


export const login = async (email: string, password: string) => {
    const client = await createClient();

    return await client.auth.signInWithPassword({ email, password });
}


export const logout = async () => {
    const client = await createClient()

    return await client.auth.signOut()
}

export const signUp = async (email: string, password: string) => {
    const client = await createClient()
    const response = await client.auth.signUp({
        email, password, options: {
            emailRedirectTo: CONSTANT.URL_APP + '/auth/confirm-email'
        }
    })
    return response
}


export const getInfoUserByToken = async (token: string) => {
    const client = await createClient();
    const user = await client.auth.getUser(token)
    if (!user.data.user) {
        return { user: null, profile: null }
    }
    const profile = await client.from('clients').select('*').eq('auth_id', user.data.user.id).single()
    return { user: user.data.user, profile: profile.data }
}