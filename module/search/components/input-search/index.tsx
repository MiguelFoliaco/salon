'use client';
import { useToast } from '@/module/common/hook/useToast';
import { getProducts, Products } from '@/module/product/actions/get-products';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'

type Props = {
    onClick?: (item: Products[number]) => void;
    showMore?: boolean;
};

export const SearchInput = ({ onClick, showMore = true }: Props) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<Products>([]);
    const { openToast } = useToast()
    const searchParams = useSearchParams()


    const search = useCallback(async (open?: boolean) => {
        if (!query) return openToast('Digite algo para buscar', 'warning')
        if (loading) return
        setLoading(true)
        const response = await getProducts({
            query: query,
            page: 1,
            limit: 10
        });
        setLoading(false)
        setOpen(open ?? true)
        if (response.error) {
            return openToast(response.error.message, 'error')
        }

        setResult(response.data)
    }, [query, loading, openToast, searchParams])

    const validateQuery = useCallback(() => {
        if (searchParams.get('q')) {
            setQuery(searchParams.get('q') || '')
            search(false)
        }
    }, [searchParams, search])

    useEffect(() => {
        if (result.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            validateQuery();
        }
    }, [searchParams, result, validateQuery])
    return (
        <div className="relative w-full ">
            <div className="join w-full">
                <input
                    type="text"
                    className="input input-primary join-item w-full"
                    placeholder="Buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (result.length > 0) {
                            setOpen(true)
                        } else {
                            setOpen(false)
                        }
                    }}
                    // onBlur={(e) => {
                    //     e.stopPropagation();
                    //     if (e.relatedTarget?.id === "ver-todos") return
                    //     setOpen(false)
                    // }}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            search()
                        }
                    }}
                />
                <button
                    disabled={loading}
                    className="btn btn-primary join-item shadow-none"
                    onClick={() => search(true)}
                >
                    {
                        loading && (
                            <span className="loading loading-spinner loading-sm" />
                        )
                    }
                    <BiSearch />
                </button>
            </div>

            {open && result.length > 0 && (
                <ul className="menu bg-base-100 border border-base-300 rounded-box mt-1 shadow absolute w-full z-50">
                    {result.map(item => (
                        <li role='button' key={item.id} onClick={() => {
                            onClick?.(item)
                            console.log('Item', item)
                            setOpen(false)
                        }} className='w-full flex gap-2 items-center'>
                            <button className="text-left w-full">
                                <Image src={item.image || ""} alt={item.name} width={50} height={50} />
                                {item.name}
                            </button>
                        </li>
                    ))}
                    {
                        showMore && (
                            <li className='w-full' >
                                <Link href={`/search?q=${query}`} id="ver-todos" className="text-left w-full text-primary underline">Ver todos</Link>
                            </li>
                        )
                    }
                </ul>
            )}

            {open && result.length === 0 && query && (
                <div className="bg-base-100 border border-base-300 rounded-box mt-1 shadow p-3 text-sm absolute w-full z-50">
                    No se encontraron resultados
                </div>
            )}
        </div>
    )
}