'use client';

import { BiBuilding } from "react-icons/bi";
import { useBranches } from "../context/use-branches";
import { useEffect } from "react";


export const SelectBranch = () => {

    const { branches, updateSelectedBranch } = useBranches()

    useEffect(() => {
        if (branches.length > 0) {
            updateSelectedBranch(branches[0])
        }
    }, [branches])

    return (
        <div className="flex items-center w-[200px] join">
            <BiBuilding className="join-item btn btn-primary btn-sm shadow-none" />
            <select onChange={(e) => updateSelectedBranch(branches.find(branch => branch.id === e.target.value)!)} className="select select-sm select-primary w-full outline-none border-primary join-item">
                {
                    branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                    ))
                }
            </select>
        </div>
    )
}
