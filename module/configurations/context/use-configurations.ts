import { create } from "zustand";
import { Configuration } from "../actions/get-configurations";

type ConfigurationsState = {
    configuration: Configuration | null;
    updateConfiguration: (configuration: Configuration) => void;
}

export const useConfigurations = create<ConfigurationsState>(set => ({
    configuration: null,
    updateConfiguration: (configuration: Configuration) => set({ configuration })
}))