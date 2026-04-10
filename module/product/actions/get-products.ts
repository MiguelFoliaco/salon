'use server';

import { createClient } from "@/supabase/server";
import { cache } from "react";

const select = `
    code,
    created_at,
    description,
    id,
    image,
    is_active,
    name,

    type:product_types(
        id,
        name
    ),

    inventory:inventory_by_branch!inner(
        stock,
        branch_id
    ),

    taxe:taxes(
        id,
        name,
        percentage,
        code
    ),

    updated_at,
    value,
    is_service,
    estimate_time_in_minutes,
    gallery: product_gallery(
        id,
        image_url,
        alt
    )
`;

type args = {
    query?: string;
    type?: string;
    min?: number;
    max?: number;
    page?: number;
    limit?: number;
    branchId: string;
};

export const getProducts = cache(async (q: args) => {
    const client = await createClient();

    const {
        query,
        type,
        min,
        max,
        page = 1,
        limit = 10,
    } = q;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    console.log('Type ID ', type)

    let request = client
        .from('products')
        .select(select, { count: 'exact' })
        .eq('inventory.branch_id', q.branchId)
        .range(from, to)
        .order('created_at', { ascending: false });

    if (query) {
        request = request.ilike('name', `%${query}%`);
    }

    if (type) {
        request = request.eq('product_type_id', type);
    }

    if (min !== undefined) {
        request = request.gte('value', min);
    }

    if (max !== undefined) {
        request = request.lte('value', max);
    }

    const products = await request;
    return products;
});

export type Products = NonNullable<
    Awaited<ReturnType<typeof getProducts>>['data']
>;
export type Product = Products[number];


export const getProductById = cache(async (id: string) => {
    const client = await createClient();

    const isUUID = /^[0-9a-f-]{36}$/i.test(id);

    const query = client.from('products').select(select);
    const { data, error } = isUUID
        ? await query.eq('id', id).single()
        : await query.eq('code', id).single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;
})