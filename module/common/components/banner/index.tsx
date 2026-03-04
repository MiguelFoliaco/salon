import Image from 'next/image';
import React from 'react'


type Props = {
    code?: string;
    size?: {
        width: string;
        height: string;
    }
}

const defaultURL = `/default_banner.jpg`

export const Banner = ({ code = 'default', size }: Props) => {
    return (
        <div style={size} className='w-10/12 h-[500px] mx-auto rounded-2xl overflow-hidden relative shadow'>
            <Image src={defaultURL} className='w-full h-full object-cover' quality={100} width={1000} height={800} alt="banner" />
            <div className='w-full h-full absolute bg-primary/60 z-10 top-0 left-0 px-10 py-10 flex flex-col' >
                <div className='w-fit px-3 py-2 text-sm rounded-full font-bold uppercase bg-primary/50 text-neutral-50 my-2'>SWEET INDULGENCE</div>
                <h1 className='text-4xl text-neutral-50 font-semibold mt-4'>Radiant Your Inner<br />Glow</h1>

                <p className=' mt-3 w-[50%] text-primary-content'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, voluptatum corrupti cupiditate aliquam nihil necessitatibus quasi rerum illum dignissimos repellat laudantium ut pariatur eius tempore dolorum ab asperiores, minima voluptas?</p>


                <button className='btn btn-primary mt-auto w-fit'>Schedule a Consultation</button>
            </div>
        </div>
    )
}
