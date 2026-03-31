'use server';
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

const select = `
    id,
    name,
    description,
    points,
    price,
    branch_id,
    is_active,
    color,
    branch: branch_id!inner(*)
`

export const getPolygons = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('polygons_coverage').select(select)
    if (error) throw error
    revalidatePath('/admin/polygons')
    return data
}

type PolygonsBody = {
    name: string;
    description: string;
    points: [number, number][];
    price: number;
    branch_id: string;
    is_active: boolean;
    color: string;
}

export const createPolygon = async (polygon: PolygonsBody) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('polygons_coverage').insert(polygon).select('id').maybeSingle()
    if (error) return {
        data: null,
        error: error.message
    }
    revalidatePath('/admin/polygons')
    return {
        data,
        error: null
    }
}


export const editPolygon = async (id: string, data: { color: string, price: number }) => {
    const supabase = await createClient()
    const { data: res, error } = await supabase.from('polygons_coverage').update(data).eq('id', id).select('id').maybeSingle()
    if (error) return {
        data: null,
        error: error.message
    }
    revalidatePath('/admin/polygons')
    return {
        data,
        error: null
    }
}

export const deletePolygon = async (id: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('polygons_coverage').delete().eq('id', id).select('id').maybeSingle()
    if (error) return {
        data: null,
        error: error.message
    }
    revalidatePath('/admin/polygons')
    return {
        data,
        error: null
    }
}
