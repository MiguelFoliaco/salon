'use server';

import { TablesInsert } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { cache } from "react";

type args = {
    page?: number
    limit?: number
    search?: string
    branchId: string
}

const select = `
    id,
    product: product_id!inner(
        id,
        name,
        value,
        is_active,
        is_service,
        estimate_time_in_minutes,
        type:product_types(name),
        taxe:taxes(percentage)
    ),
    stock,
    min_stock,
    max_stock,
    branch: branch_id!inner(
        name,
        id,
        address,
        city,
        phone,
        email
    )
`

export const getAdminProducts = cache(async ({ page = 1, limit = 10, search = '', branchId }: args) => {
    const supabase = await createClient();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    let query = supabase
        .from('inventory_by_branch')
        .select(select, { count: 'exact' })
        .eq('branch_id', branchId)
        .order('updated_at', { ascending: false })
        .range(from, to);

    if (search) {
        query = query.ilike('product.name', `%${search}%`);
    }

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching admin products:", error);
        throw new Error("Could not fetch products");
    }

    return {
        data,
        total: count || 0,
        page,
        totalPages: count ? Math.ceil(count / limit) : 1
    };
})

export type AdminProduct = NonNullable<Awaited<ReturnType<typeof getAdminProducts>>['data']>[0];

export async function toggleProductStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) throw new Error("Unauthorized");

    const { data: employe } = await supabase
        .from('employes')
        .select('rol')
        .eq('auth_id', authData.user.id)
        .maybeSingle();

    if (!employe || employe.rol !== 'admin') {
        throw new Error("Unauthorized admin action");
    }

    const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', id);

    if (error) {
        console.error("Error toggling product status:", error);
        throw new Error("Could not update status");
    }

    revalidatePath('/admin/products');
    return true;
}


type ArgsCreateProduct = {
    product: TablesInsert<'products'>;
    gallery?: TablesInsert<'product_gallery'>[];
    inventory?: TablesInsert<'inventory_by_branch'>;
}

export async function createAdminProduct(productData: ArgsCreateProduct) {
    const supabase = await createClient();

    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
        return { error: "Unauthorized", message: 'No se encuentra logueado' }
    };

    const { data: employe } = await supabase
        .from('employes')
        .select('rol')
        .eq('auth_id', authData.user.id)
        .eq('rol', 'admin')
        .maybeSingle();

    if (!employe || employe.rol !== 'admin') {
        return { error: "Unauthorized", message: 'No tiene permisos para realizar esta accion' };
    }

    // Assign missing boolean based on default
    const payload = { ...productData.product, is_active: true };

    const { error, data } = await supabase
        .from('products')
        .insert(payload)
        .select('id')
        .maybeSingle();

    if (error) {
        return { error: "Error", message: 'Error al crear el producto: ' + error.message };
    }

    if (payload.is_service && data) {
        const { error: inventoryError } = await supabase
            .from('inventory_by_branch')
            .insert({
                branch_id: productData.inventory?.branch_id!,
                product_id: data.id,
                stock: 1,
                min_stock: 1,
                max_stock: 1,
            });

        if (inventoryError) {
            return { error: "Error", message: 'Error al crear el inventario del producto: ' + inventoryError.message };
        }

        revalidatePath('/admin/products');
        return { error: null, message: 'Servicio creado exitosamente' }
    }

    if (productData.gallery && productData.gallery?.length > 0 && data) {

        const { error: galleryError } = await supabase
            .from('product_gallery')
            .insert(productData.gallery.map(e => ({ ...e, product_id: data.id })));

        if (galleryError) {
            return { error: "Error", message: 'Error al crear la galeria del producto: ' + galleryError.message };
        }
    }

    if (productData.inventory && data) {
        const { error: inventoryError } = await supabase
            .from('inventory_by_branch')
            .insert({ ...productData.inventory, product_id: data.id });

        if (inventoryError) {
            return { error: "Error", message: 'Error al crear el inventario del producto: ' + inventoryError.message };
        }
    }

    revalidatePath('/admin/products');
    return { error: null, message: 'Producto creado exitosamente' };
}
