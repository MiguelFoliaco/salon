'use server';
import { CONSTANT } from "@/constant";
import { createClient } from "@/supabase/server";

export const getConversation = async (userId: string,) => {

    const client = await createClient();
    const session = await client.auth.getSession();

    if (!session.data.session) {
        return null;
    }

    const response = await fetch(`${CONSTANT.API_WEB}/chat/conversation/${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${session.data.session.access_token}`,
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    console.log("DATA: ", data)

    return data as {
        data?: {
            id: string,
            messages: {
                id: string,
                role: "system" | "user" | "assistant",
                content: string,
                created_at: string
            }[]
        }
        error: any;
        msg: string
    };
}

export const sendMessage = async (conversationId: string, message: string, userId: string) => {

    const client = await createClient();
    const session = await client.auth.getSession();

    if (!session.data.session) {
        return null;
    }

    const response = await fetch(`${CONSTANT.API_WEB}/chat/conversation/${userId}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${session.data.session.access_token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            conversationId,
            message
        }),
    });

    const data = await response.json();

    return data as {
        data?: {
            reply: string
        }
        error: any;
        msg: string
    };
}