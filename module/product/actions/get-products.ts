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
    stock,
    taxe:taxes(
        id,
        name,
        percentage,
        code
    ),
    updated_at,
    value,
    is_service,
    estimate_time_in_minutes
`;

type args = {
    query?: string;
    type?: string;
    min?: number;
    max?: number;
    page?: number;
    limit?: number;
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

    let request = client
        .from('products')
        .select(select, { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

    if (query) {
        request = request.ilike('name', `%${query}%`);
    }

    if (type) {
        request = request.eq('product_types.id', type);
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


export const getProductById = async (id: string) => {
    const client = await createClient();
    const { data } = await client.from('products').select(select).eq('id', id).single();
    return data;
}