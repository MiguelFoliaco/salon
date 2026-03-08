'use server';

import { createClient } from "@/supabase/server";

export const getConfiguration = async () => {
    const client = await createClient();
    const configurations = await client.from('configurations').select('*').limit(1).maybeSingle()

    return configurations;
}

export type Configuration = NonNullable<Awaited<ReturnType<typeof getConfiguration>>['data']>