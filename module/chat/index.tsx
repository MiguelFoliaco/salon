'use client';
import { BiBot } from "react-icons/bi"
import { useEffect, useState } from "react"
import { MessageList } from "./components/message-list";
import { useUser } from "../auth/context/useUser";
import { Conversation, getConversation } from "./actions/message";

export const ChatMain = () => {

    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<{ role: "system" | "user" | "assistant", content: string }[]>([]);

    useEffect(() => {
        if (user) {
            getConversation()
                .then(res => {
                    if (res) {
                        setConversation(res)
                        setMessages(res.messages as any || [])
                    }
                })
        }
    }, [user])

    const handleUpdateMessages = (newMessage: { role: "system" | "user" | "assistant", content: string }) => {
        setMessages(prev => [...prev, newMessage])
    }

    return (
        <div className="fixed bottom-3 right-3 w-fit h-fit flex flex-col z-30">

            <div className="relative w-full h-full min-w-[50px] min-h-[50px] rounded-sm overflow-hidden shadow-2xl">
                {open && <MessageList
                    conversationId={conversation?.id || ''}
                    onClose={() => setOpen(false)}
                    messages={messages}
                    updateMessages={handleUpdateMessages}
                />}

                {
                    !open && <button className="absolute bottom-0 right-0 btn btn-circle btn-lg ml-auto" onClick={() => setOpen(!open)}>
                        <BiBot />
                    </button>
                }
            </div>

        </div>
    )
}
