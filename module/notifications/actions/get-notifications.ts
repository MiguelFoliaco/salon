'use server';

import { createClient } from "@/supabase/server";
import { cache } from "react";


const select = `
    created_at,
    description,
    id,
    image,
    title,
    type
    `
export const getRecentActivity = cache(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notification')
        .select(select)
        .order('created_at', { ascending: false })
        .limit(3);

    if (error) {
        console.error("Error fetching recent activity:", error);
        throw new Error("Could not fetch recent activity");
    }

    return data;
})

export type Notification = Awaited<ReturnType<typeof getRecentActivity>>[number]



export const getBasicMetricsNotifications = cache(async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('notification')
        .select('id')
        .order('created_at', { ascending: false })
        .eq('created_at', new Date().toISOString())

    if (error) {
        console.error("Error fetching recent activity:", error);
        throw new Error("Could not fetch recent activity");
    }

    return {
        sendToday: data.length,

    };
})

export type BasicMetricsNotifications = Awaited<ReturnType<typeof getBasicMetricsNotifications>>