"use client";

import { useBranches } from "@/module/branches/context/use-branches";
import { useState, useRef, useEffect, Fragment } from "react";
import { useToast } from '@/module/common/hook/useToast'
import {
    BiBot,
    BiChat,
    BiX,
    BiSend,
    BiUser,
} from "react-icons/bi";
import { GiSparkles } from "react-icons/gi";
import { MessageIA } from "./message-ia";
import { sendMessage } from "../actions/service";
import { useUser } from "@/module/auth/context/useUser";

type Props = {
    conversationId: string;
    messages: {
        role: "system" | "user" | "assistant";
        content: string;
    }[];

    updateMessages: (messages: {
        role: "system" | "user" | "assistant";
        content: string;
    }) => void;

    onClose: () => void;
};

export const MessageList = ({
    messages,
    onClose,
    conversationId,
    updateMessages,
}: Props) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { openToast } = useToast()
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = async () => {

        try {
            if (!user) return openToast('Debes iniciar sesion para enviar un mensaje', 'info')
            if (!message) return openToast('El mensaje no puede estar vacio', 'error')
            const userMsg = message
            setMessage('')
            updateMessages({ role: 'user', content: userMsg })

            setLoading(true)
            const res = await sendMessage(conversationId, message, user.id);
            if (!res) {
                openToast('Error al enviar el mensaje', 'error')
                setLoading(false)
                return
            }
            if (res.error || !res.data) {
                console.log(res)
                openToast(res.msg || 'Error al enviar el mensaje', 'error')
                setLoading(false)
                return
            }
            updateMessages({ role: 'assistant', content: res.data.reply })
            setLoading(false)
        } catch (error) {
            console.log(error)
            openToast('Error al enviar el mensaje', 'error')
            setLoading(false)
        }
    }
    return (
        <div className="w-[50vw] h-[95vh] bg-base-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-base-300">
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-primary/80 p-4 flex items-center gap-3">
                <div className="avatar placeholder">
                    <div className="bg-primary-content text-primary rounded-full w-10 h-10 flex items-center justify-center">
                        <BiBot className="text-xl" />
                    </div>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-primary-content text-lg">ReserIA</h3>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-primary-content/70 text-xs">En línea</span>
                    </div>
                </div>
                <button
                    className="btn btn-ghost btn-sm btn-circle text-primary-content hover:bg-primary-content/20"
                    onClick={onClose}
                >
                    <BiX className="text-xl" />
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200/30">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                        <div className="bg-primary/10 p-6 rounded-full mb-4">
                            <GiSparkles className="text-5xl text-primary" />
                        </div>
                        <h4 className="font-bold text-base-content text-lg mb-2">
                            ¡Hola! Soy ReserIA
                        </h4>
                        <p className="text-base-content/60 text-sm leading-relaxed">
                            Tu asistente virtual. Pregúntame sobre nuestros productos,
                            disponibilidad o cualquier cosa que necesites.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2 justify-center">
                            {["¿Qué productos tienen?", "Horarios", "Reservar"].map(
                                (suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setMessage(suggestion)}
                                        className="btn btn-xs btn-outline btn-primary rounded-full"
                                    >
                                        {suggestion}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => (
                            <Fragment key={index}>
                                {
                                    msg.role === 'user' ? <>
                                        <div

                                            className={`chat chat-end`}
                                        >
                                            <div className="chat-image avatar placeholder">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-secondary text-secondary-content`}
                                                >
                                                    {msg.role === "user" ? (
                                                        <BiUser className="text-sm" />
                                                    ) : (
                                                        <BiBot className="text-sm" />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="chat-header text-xs opacity-60 mb-1">
                                                Tú
                                            </div>
                                            <div
                                                className={`chat-bubble text-sm leading-relaxed bg-secondary text-secondary-content`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </>
                                        :
                                        <MessageIA msg={msg} index={index} />
                                }

                            </Fragment>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="chat chat-start">
                                <div className="chat-image avatar placeholder">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                                        <BiBot className="text-sm" />
                                    </div>
                                </div>
                                <div className="chat-bubble bg-base-100 shadow-sm">
                                    <span className="loading loading-dots loading-sm text-primary" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-base-100 border-t border-base-300">
                <div className="join w-full">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !loading && handleSendMessage()}
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        className="input input-bordered join-item flex-1 focus:outline-primary"
                        disabled={loading}
                    />
                    <button
                        disabled={loading || !message.trim()}
                        onClick={handleSendMessage}
                        className="btn btn-primary join-item px-4"
                    >
                        {loading ? (
                            <span className="loading loading-spinner loading-sm" />
                        ) : (
                            <BiSend className="text-lg" />
                        )}
                    </button>
                </div>
                <p className="text-center text-xs text-base-content/40 mt-2">
                    Powered by ReserIA
                </p>
            </div>
        </div>
    );
};

