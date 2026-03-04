'use client';
import { useUser } from '@/module/auth/context/useUser';
import { SearchInput } from '@/module/search/components/input-search';
import Link from 'next/link'
import { BiSearch } from 'react-icons/bi';
import { BsScissors } from 'react-icons/bs';
import { GiSofa } from 'react-icons/gi';

export const Header = () => {

    const user = useUser(state => state.user)

    return (
        <div className="flex justify-between p-3  shadow top-0 sticky z-30 bg-base-100">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center rounded-lg bg-primary p-2">
                        <BsScissors className="size-5 text-primary-foreground" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-card-foreground">
                        BarberShop
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 w-[50%]">
                <SearchInput />
            </div>
            <div className="join join-horizontal">

                {
                    user ?
                        <Link className="join-item btn btn-primary btn-sm shadow-none" href={'/admin'} >Admin</Link>
                        :
                        <>
                            <Link className="join-item btn btn-primary btn-sm shadow-none" href={'/auth/login'} >Login</Link>
                            <Link className="join-item btn btn-neutral btn-outline btn-sm shadow-none" href={'/auth/signup'} >Sign Up</Link>
                        </>
                }
            </div>
        </div>
    )
}
