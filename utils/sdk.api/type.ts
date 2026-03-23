
export type Response<T> = {
    response: T
    signal: AbortSignal
}
export interface BodyGenerateHash {
    reference: string;
    amount: number;
    currency: 'COP';
    integrity: string;
    expirationTime: string;
}

export type ReturncreateSha256 = {
    data: {
        hash: string;
    }
    success: boolean
    message: string
}