'use server';

import { createClient } from "@/supabase/server";
import { cache } from "react";

export const getProductTypes = cache(async () => {
    const client = await createClient();

    const { data, error } = await client
        .from('product_types')
        .select('id, name')
        .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching product types", error);
        return [];
    }

    return data;
});

export type ProductType = Awaited<ReturnType<typeof getProductTypes>>[number];
