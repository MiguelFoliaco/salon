'use server';

import { TablesInsert, TablesUpdate } from "@/supabase/database.types";
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
    updated_at,
    departament,
    city_or_municipality,
    country,
    postal_code,
    latitude,
    longitude
`

type Args =
    | {
        type: 'insert';
        entry: TablesInsert<'clients'>;
    }
    | {
        type: 'update';
        entry: TablesUpdate<'clients'>;
    };

export const saveClient = async ({ entry, type }: Args) => {
    const client = await createClient();
    if (type == 'insert') {
        const _client = await getClientById(entry.identity_value, 'identity_value');

        if (_client) {
            return {
                status: 'fail',
                msg: 'Ya existe un cliente con esta identificacion',
                data: null
            }
        }
        const insert = await client.from('clients').insert(entry).select(select).maybeSingle()

        return {
            data: insert.data,
            msg: insert.data ? 'Se creo el cliente correctamente' : insert.error?.message,
            status: !!insert.data
        }
    }

    if (type == 'update' && entry.id) {
        const update = await client.from('clients').update(entry).eq('id', entry.id).select(select).maybeSingle()
        return {
            data: update.data,
            msg: update.data ? 'Se actualizo el cliente correctamente' : update.error?.message,
            status: !!update.data
        }
    }
    else {
        return {
            status: 'fail',
            msg: 'No se especifico el tipo de operacion o el id del cliente',
            data: null
        }
    }
}