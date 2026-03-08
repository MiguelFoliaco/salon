'use client';

import { useUser } from "@/module/auth/context/useUser";
import { useBranches } from "@/module/branches/context/use-branches";
import { Configuration } from "@/module/configurations/actions/get-configurations";
import { useProfile } from "@/module/profile/hook/use-profile";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";


type LayoutClientProps = {
    children: React.ReactNode;
    user: User | null;
    configuration: Configuration;
}

export const LayoutClient = ({ children, user, configuration }: LayoutClientProps) => {

    const updateUser = useUser(state => state.updateUser)
    const { load } = useBranches()
    const { load: loadProfile } = useProfile()
    useEffect(() => {

        if (user) {
            updateUser(user)
        }
        load(configuration.id)
        loadProfile()
    }, [user, updateUser])


    return children
}
