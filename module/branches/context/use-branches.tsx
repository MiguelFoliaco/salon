import { Tables } from "@/supabase/database.types";
import { create } from "zustand";
import { getBranches } from "../actions/get-branch";

type BranchesState = {
    branches: Tables<'branches'>[];
    selectedBranch: Tables<'branches'> | null;
    updateSelectedBranch: (branch: Tables<'branches'> | null) => void;
    updateBranches: (branches: Tables<'branches'>[]) => void;
    load: (configurationId: string) => Promise<void>;
    isLoading: boolean;
}

export const useBranches = create<BranchesState>(set => ({
    branches: [],
    selectedBranch: null,
    updateSelectedBranch: (branch: Tables<'branches'> | null) => set({ selectedBranch: branch }),
    updateBranches: (branches: Tables<'branches'>[]) => set({ branches }),
    load: async (configurationId: string) => {
        set({ isLoading: true })
        const branches = await getBranches(configurationId)
        if (!branches.data) {
            set({ isLoading: false })
            return
        }
        set({ branches: branches.data, isLoading: false })
    },
    isLoading: false
}))
