'use server';

import { createClient } from "@/supabase/server";

type Args = {
    serviceId: string;
};

const select = `
    employee:employes!inner(*),
    service:products!inner(*)
`

export const getEmployeeByService = async ({ serviceId }: Args) => {
    const client = await createClient();
    const { data, error } = await client
        .from('services_x_employee')
        .select(select)
        .eq('service_id', serviceId)

    if (error) {
        throw error;
    }

    return data;
};


export type EmployeeByService = Awaited<ReturnType<typeof getEmployeeByService>>[0];