'use server';
import { TablesInsert } from "@/supabase/database.types";
import { createClient } from "@/supabase/server"
import { generateId } from "@/utils/generate-id";
import { api } from "@/utils/sdk.api";
import { truncate } from "@/utils/truncate";

type Transaction = TablesInsert<'transactions'>

/**
 * 
 * @param data IMPORTANTE: Para servicios no envie la transaccion
 * @returns 
 */
export const saveTransaction = async (data: Transaction) => {

    if (!data.client_id) {
        return {
            success: false,
            message: "No hay cliente registrado para esta compra"
        }
    }

    if (!data?.products || !data?.services) {
        return {
            success: false,
            message: "Debe agregar al menos un producto o servicio"
        }
    }

    const reference = data.schedule_id ? `${data.schedule_id}_${generateId()}` : data.reference_code

    //Esto inicialmente se registra aqui con el estatus 'pedding' en el webhook se actualiza a 'completed' o 'cancelled'
    const supabase = await createClient()
    const { data: purchase, error } = await supabase.from('transactions').insert({
        amount: data.amount,
        transaction_type: data.transaction_type,
        client_id: data.client_id,
        products: data.products,
        services: data.services,
        total_amount: data.total_amount,
        reference_code: reference,
        payment_method: data.payment_method,
        status: 'pending',
        branch_id: data.branch_id,
        tax_amount: data.tax_amount,
        schedule_id: data.schedule_id,
    }).select().single()

    if (error) {
        return {
            success: false,
            message: "Error al guardar la compra"
        }
    }

    return {
        success: true,
        message: "Compra guardada exitosamente",
        data: purchase,
    }
}


type BodySavePurchase = TablesInsert<'purchases'>

// ESTO ES UNICAMENTE PARA PRODUCTOS
export const savePurchase = async (data: BodySavePurchase) => {
    const supabase = await createClient()
    const { data: purchase, error } = await supabase.from('purchases').insert({
        ...data,

    }).select().single()

    console.log("error: ", error)

    if (error) {
        return {
            success: false,
            message: "Error al guardar la compra"
        }
    }

    return {
        success: true,
        message: "Compra guardada exitosamente",
        data: purchase,
    }
}

interface BodyGenerateHash {
    reference: string;
    amount: number;
    currency: 'COP';
    integrity: string;
}

export const generateHash = async (data: BodyGenerateHash) => {

    const time = new Date() // WOMPI NECESITA EL UTC EN 0
    time.setMinutes(time.getMinutes() + 5)


    const { response } = await api.createSha256({
        ...data,
        expirationTime: time.toISOString()
    })
    return {
        response,
        expirationTime: time.toISOString()
    };
}
