'use server';

import { createClient } from "@/supabase/server";
import { cache } from "react";

const select = `
id,
name,
address,
configuration_id,
city,
phone,
email,
created_at
`

export const getBranches = cache(async (configurationId: string) => {
    const client = await createClient();
    const braches = await client.from('branches').select(select).eq('configuration_id', configurationId)
    return braches;
})