'use server';

import { createClient } from "@/supabase/server";
import { buildMessages, openRouter } from "./ia";
import { getProducts } from "../../product/actions/get-products";
import { list_branches, search_product } from "../tools/products";

const select = `
    id,
    user_id,
    created_at,
    messages(
        id,
        role,
        content,
        created_at
    )
`

export const getConversation = async () => {
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return null
    const { data, error } = await supabase.from('conversation').select(select).eq('user_id', user.user.id).limit(1).maybeSingle()
    if (data === null && !error) {
        const { data: newConversation, error: errorNewConversation } = await supabase.from('conversation').insert({
            user_id: user.user.id,
        }).select(select).maybeSingle()
        if (errorNewConversation) return null
        return newConversation
    }
    if (error) return null
    return data
}

export type Conversation = NonNullable<Awaited<ReturnType<typeof getConversation>>>


export const sendMessage = async (message: string, conversation_id: string, branchId: string) => {
    if (!message) return { error: true, message: 'El mensaje no puede estar vacio' }

    try {
        const supabase = await createClient()

        // 1. Guardar mensaje del usuario
        const { error: errorInsert } = await supabase.from('messages').insert({
            conversation_id,
            role: 'user',
            content: message,
        });

        if (errorInsert) {
            console.error('Error al insertar mensaje de usuario:', errorInsert);
            return { error: true, message: 'Error al enviar el mensaje' };
        }

        // 2. Obtener historial reciente para contexto
        const { data: history, error: errorHistory } = await supabase
            .from("messages")
            .select("role, content")
            .eq("conversation_id", conversation_id)
            .order("created_at", { ascending: true })
            .limit(20);

        if (errorHistory) {
            console.error('Error al obtener historial:', errorHistory);
            return { error: true, message: 'Error al procesar el chat' };
        }

        // 3. Primera llamada a OpenRouter
        const contextMessages = buildMessages(history || []);
        const completion = await openRouter.chat.send({
            chatRequest: {
                messages: contextMessages,
                model: 'openrouter/free'
            }
        });

        let assistantMessage = completion.choices[0]?.message?.content || '';
        console.log('AI Response:', assistantMessage);

        // 4. Deteción de herramientas (JSON en la respuesta)
        if (assistantMessage.trim().includes('tool_name')) {
            try {
                const jsonMatch = assistantMessage.match(/```json\n([\s\S]*?)\n```/) || assistantMessage.match(/{[\s\S]*}/);
                const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : assistantMessage;
                console.log('JSON STR: ', jsonStr)
                const toolCall = JSON.parse(jsonStr);

                switch (toolCall.tool_name) {
                    case 'search_products':
                        const toolContextSearch = await search_product(toolCall, contextMessages, assistantMessage, branchId);
                        const finalCompletionSearch = await openRouter.chat.send({
                            chatRequest: {
                                messages: toolContextSearch as any,
                                model: 'openrouter/free'
                            }
                        });

                        assistantMessage = finalCompletionSearch.choices[0]?.message?.content || '';
                        break
                    case 'list_branches':
                        const toolContextBranches = await list_branches(toolCall, contextMessages, assistantMessage);
                        const finalCompletionBranches = await openRouter.chat.send({
                            chatRequest: {
                                messages: toolContextBranches as any,
                                model: 'openrouter/free'

                            }
                        });

                        assistantMessage = finalCompletionBranches.choices[0]?.message?.content || '';
                        break
                }


            } catch (jsonError) {
                console.error('Error al parsear JSON de herramienta:', jsonError);
            }
        }

        // 6. Guardar respuesta final del asistente
        const { error: errorInsertAssistant } = await supabase.from('messages').insert({
            conversation_id,
            role: 'assistant',
            content: assistantMessage,
        });

        if (errorInsertAssistant) {
            console.error('Error al insertar mensaje del asistente:', errorInsertAssistant);
        }

        return { error: false, data: assistantMessage };

    } catch (error) {
        console.error('Error en sendMessage:', error);
        return { error: true, message: 'Ocurrió un error inesperado al procesar el chat' };
    }
}