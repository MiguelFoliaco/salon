import { EmployeeByService, getEmployeeByService } from "@/module/employe/actions/get-employee-by-service";
import { create } from "zustand";

type State = {
    employes: EmployeeByService[];
    selectedEmployee: EmployeeByService | null;
    setSelectedEmployee: (employee: EmployeeByService | null) => void;
    load: (serviceId: string) => Promise<void>;
    loading: boolean;
}

export const useEmploye = create<State>((set) => ({
    employes: [],
    selectedEmployee: null,
    setSelectedEmployee: (employee: EmployeeByService | null) => set({ selectedEmployee: employee }),
    load: async (serviceId: string) => {
        set({ loading: true })
        const employes = await getEmployeeByService({ serviceId })
        set({ employes, loading: false })
    },
    loading: false
}))