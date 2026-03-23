import { CONSTANT } from "@/constant";
import { BodyGenerateHash, Response, ReturncreateSha256 } from "./type";


const fetcher = async <OUTPUT>(url: string, options: RequestInit): Promise<Response<OUTPUT>> => {
    const data = await fetch(`${CONSTANT.API_WEB}${url}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    }).then(res => res.json() as Promise<OUTPUT>)

    return {
        response: data,
        signal: AbortSignal.timeout(5000)
    }
}

export const api = {
    createSha256: async (data: BodyGenerateHash) => {
        return fetcher<ReturncreateSha256>('/checkout/create-sha256', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }
}