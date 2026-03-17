'use server';

import { TablesInsert } from "@/supabase/database.types";
import { createClient } from "@/supabase/server";


type ArgsSendNotification = {
    to: string | string[],
    title: string,
    body: string,
    richContent?: {
        image: string;
    }
    data: Record<string, string>,
    sound?: string,
    badge?: number,
    ttl?: number,
    priority?: string,
    channelId?: string,
    mutableContent?: boolean,
    categoryId: "product" | "event_actions" | "promotion" | "location" | "branch"
}

const defaultOptions: ArgsSendNotification = {
    "to": ["ExponentPushToken[xxx]", "ExponentPushToken[yyy]"],
    "title": "🎉 Evento nuevo",
    "body": "Compra tus entradas ahora",
    "data": {
        "type": "EVENT_PROMO",
        "eventId": "evt_123",
        "deepLink": "/events/evt_123"
    },
    "sound": "default",
    "badge": 1,
    "ttl": 3600,
    "priority": "high",
    "channelId": "default",
    "mutableContent": true,
    "categoryId": "event_actions"
}

export const sendNotifications = async (args: ArgsSendNotification) => {
    const options = {
        ...defaultOptions,
        ...args
    }
    const client = await createClient()
    const { data: tokenDevice, error } = await client
        .from("push_token_device_x_user")
        .select("push_token");
    if (!tokenDevice) return { error: "Ocurrio un error en base de datos, intentelo mas tarde: " + error };
    if (tokenDevice.length === 0) return { error: "Aun no hay dispositivos para enviar notificaciones" };
    options.to = tokenDevice.map((item) => item.push_token);

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    })

    return response.json();
}


export const getTokenDevice = async () => {
    const client = await createClient()
    const { data: tokenDevice } = await client
        .from("push_token_device_x_user")
        .select("push_token")
    return tokenDevice
}


export const saveNotificationDB = async (args: TablesInsert<'notification'>) => {
    const client = await createClient()
    const { data: notification, error } = await client
        .from("notification")
        .insert(args)
    if (error) return { error: "Ocurrio un error en base de datos, intentelo mas tarde: " + error };
    return notification
}