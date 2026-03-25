import { create } from "zustand";
import { City, Region, Regions } from "../type";
import { getCities, getRegion } from "../actions/api-colombia";

type RegionState = {
    regions: Regions;
    // Esta es la region seleccionada para la pagina
    regionSelected?: Region;
    load: () => Promise<void>;
    setRegionSelected: (region: Region) => void;
    cities: City[];
    setCities: (cities: City[]) => void;
    loadCities: (departmentId: number) => Promise<void>;
}

export const useRegion = create<RegionState>((set) => ({
    regions: [],
    load: async () => {
        const localRegions = localStorage.getItem('regions');
        if (localRegions) {
            set({ regions: JSON.parse(localRegions) });
            return;
        }
        const regions = await getRegion();
        localStorage.setItem('regions', JSON.stringify(regions));
        set({ regions });
    },
    setRegionSelected: (region: Region) => {
        set({ regionSelected: region });
    },
    cities: [],
    loadCities: async (departmentId: number) => {
        const localCities = localStorage.getItem(`cities-${departmentId}`);
        if (localCities) {
            set({ cities: JSON.parse(localCities) });
            return;
        }
        const cities = await getCities(departmentId);
        localStorage.setItem(`cities-${departmentId}`, JSON.stringify(cities));
        set({ cities });
    },
    setCities: (cities: City[]) => {
        set({ cities });
        localStorage.setItem(`cities-${cities[0]?.departmentId}`, JSON.stringify(cities));
    },
}))