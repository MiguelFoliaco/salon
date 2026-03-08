'use client';
import { useEffect } from "react"
import { create } from "zustand"
import { type Client, getClient } from "../actions/get-client"

export const useProfilePage = () => {

    const { load, client, loading } = useProfile()

    useEffect(() => {
        load()
    }, [])

    return {
        client,
        clientLoading: loading
    }
}

type ProfileState = {
    client: Client | null;
    setClient: (client: Client) => void
    load: () => Promise<void>;
    clear: () => void;
    loading: boolean;
}

export const useProfile = create<ProfileState>(set => ({
    client: null,
    setClient: (client) => set({ client }),
    load: async () => {
        set({ loading: true });
        const client = await getClient();
        if (client) {
            set({ client, loading: false });
        }
    },
    clear: () => set({ client: null }),
    loading: false,
}))