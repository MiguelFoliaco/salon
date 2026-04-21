import React from 'react'
import { BiBot } from 'react-icons/bi';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';

type Props = {
    msg: {
        role: "system" | "user" | "assistant";
        content: string;
    };
    index: number;
}

export const MessageIA = ({ msg, index }: Props) => {
    console.log(msg)
    return (
        <div
            key={index}
            className={`chat chat-start`}
        >
            <div className="chat-image avatar placeholder">
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-content`}
                >
                    <BiBot className="text-sm" />
                </div>
            </div>
            <div className="chat-header text-xs opacity-60 mb-1">
                ReserIA
            </div>
            <div
                className={`chat-bubble text-sm leading-relaxed ${msg.role === "user"
                    ? "bg-primary text-primary-content"
                    : "bg-base-100 text-base-content shadow-sm"
                    }`}
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={MarkdownComponents}
                >
                    {msg.content}
                </ReactMarkdown>
            </div>
        </div>
    )
}


const MarkdownComponents = {
    table: ({ children }: any) => (
        <div className="overflow-x-auto my-4">
            <table className="table table-zebra table-sm w-full">
                {children}
            </table>
        </div>
    ),

    thead: ({ children }: any) => (
        <thead className="bg-base-200 text-base-content">
            {children}
        </thead>
    ),

    tbody: ({ children }: any) => <tbody>{children}</tbody>,

    tr: ({ children }: any) => (
        <tr className="hover">{children}</tr>
    ),

    th: ({ children }: any) => (
        <th className="text-xs font-semibold uppercase tracking-wide">
            {children}
        </th>
    ),

    td: ({ children }: any) => (
        <td className="text-sm align-middle whitespace-nowrap">
            {children}
        </td>
    ),

    // 👇 IMPORTANTE para el título
    h3: ({ children }: any) => (
        <h3 className="font-semibold text-base mb-2 mt-2">
            {children}
        </h3>
    ),

    // 👇 Para la nota
    blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-primary pl-3 italic text-sm opacity-80 my-3">
            {children}
        </blockquote>
    ),

    // 👇 Para negritas
    strong: ({ children }: any) => (
        <span className="font-semibold">
            {children}
        </span>
    ),

    // 👇 párrafos
    p: ({ children }: any) => (
        <p className="mb-2 last:mb-0">
            {children}
        </p>
    ),

    img: ({ src, alt }: any) => (
        <img src={src} alt={alt} className="h-20 w-20 object-cover rounded-lg my-2" />
    ),
};
