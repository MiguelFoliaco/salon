'use server';

import { City, Regions } from "../type";

const base_api = 'https://api-colombia.com/api/v1/'

export const getRegion = async () => {
    const response = await fetch(`${base_api}Department`)
    const data = await response.json()
    return data as Regions;
}


export const getCities = async (id: number) => {
    const response = await fetch(`${base_api}Department/${id}/cities`)
    const data = await response.json()
    return data as City[];
}