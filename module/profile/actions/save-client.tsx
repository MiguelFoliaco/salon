'use server';

import { TablesInsert } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";
import { getClientById } from "./get-client";

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

type Args = {
    entry: TablesInsert<'clients'>;
}

export const saveClient = async ({ entry }: Args) => {
    const _client = await getClientById(entry.identity_value, 'identity_value');

    if (_client) {
        return {
            status: 'fail',
            msg: 'Ya existe un cliente con esta identificacion',
            data: null
        }
    }
    const client = await createClient();
    const insert = await client.from('clients').insert(entry).select(select).maybeSingle()

    return {
        data: insert.data,
        msg: insert.data ? 'Se creo el cliente correctamente' : insert.error?.message,
        status: !!insert.data
    }
}