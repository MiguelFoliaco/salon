import { AdminEmployee, getAdminEmployee } from "@/module/admin/actions/employees";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";


export type IUserContext = {
    user?: User;
    clientAdminRole?: AdminEmployee;
    updateUser: (user: User) => void
    exit: () => void
}

export const useUser = create<IUserContext>(set => ({
    session: undefined,
    user: undefined,
    clientAdminRole: undefined,
    updateUser: (user: User) => {
        set(state => ({ ...state, user }))
        getAdminEmployee()
            .then(res => {
                set(state => ({ ...state, clientAdminRole: res }))
            })
    },
    exit: () => set({ user: undefined, }),
}))