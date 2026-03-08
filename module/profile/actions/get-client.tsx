'use server';

import { createClient } from "@/supabase/server";

const select = `
    id,
    auth_id,
    identity_type,
    identity_value,
    name,
    lastname,
    lastname_2,
    phone,
    code_phone,
    client_type,
    code_verification,
    address,
    email,
    created_at,
    updated_at
`

export const getClient = async () => {
    const client = await createClient();
    const { data: user } = await client.auth.getUser();
    if (!user?.user) return null;
    const { data: clientData } = await client.from('clients').select(select).eq('auth_id', user.user.id).single();

    return clientData;
}

export const getClientById = async (id: string, fields: string = select) => {
    const client = await createClient();
    const { data: clientData } = await client.from('clients').select(fields).eq('identity_value', id).single();
    return clientData;
}

export type Client = NonNullable<Awaited<ReturnType<typeof getClient>>>