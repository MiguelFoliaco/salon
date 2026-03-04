'use client';
import React from 'react'
import { useProductTypes } from './hook';

export const ProductTypes = () => {

    const { productTypes, selected, typeSelected } = useProductTypes()

    

    return (
        <div className=' w-full flex flex-col'>
            <p className='text-2xl font-semibold mb-4'>Categories</p>
            <div role="tablist" className={"tabs tabs-box transition-all w-fit"}>
                {
                    productTypes.map((productType, index) => (
                        <a onClick={() => selected(productType)} key={index} role="tab" className={
                            (typeSelected?.id === productType.id ? "tab tab-active" : "tab")
                        }>{productType.name}</a>
                    ))
                }
            </div>
        </div>
    )
}
