'use server';

import { createClient } from "@/supabase/server";

export const getProductTypes = async () => {
    const client = await createClient();

    return await client.from('product_types').select('*');
}

export type ProductType = NonNullable<Awaited<ReturnType<typeof getProductTypes>>['data']>[number];