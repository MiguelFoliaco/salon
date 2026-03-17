'use server';

import { createClient } from "@/supabase/server";
import { cache } from "react";

export const getUsers = cache(async () => {
    const client = await createClient()

    return (await client.rpc('get_unique_clients'))
}
)