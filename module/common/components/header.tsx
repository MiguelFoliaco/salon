'use client';
import { useUser } from '@/module/auth/context/useUser';
import { SelectBranch } from '@/module/branches/components/select-branch';
import { useBranches } from '@/module/branches/context/use-branches';
import { SearchInput } from '@/module/search/components/input-search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsScissors, BsList, BsXLg } from 'react-icons/bs';
import { BiMapPin } from 'react-icons/bi';
import { useEmploye } from '@/module/booking/context/use-employe';
import { CartIcon } from '@/module/cart/components/CartIcon';

export const Header = () => {

    const { user, clientAdminRole } = useUser(state => state)
    const router = useRouter()
    const { branches } = useBranches()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-30 bg-base-100 border-b shadow-sm border-base-200">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                        onClick={() => router.push('/')}
                    >
                        <div className="flex items-center justify-center rounded-lg bg-primary p-2">
                            <BsScissors className="size-5 text-primary-content" />
                        </div>
                        <span className="text-lg font-bold tracking-tight hidden sm:block">
                            GLOW SALON
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md hidden md:block">
                        <SearchInput
                            onClick={(product) => router.push(`/product/${product.id}`)}
                        />
                    </div>

                    {/* Branch Selector with Location Icon — desktop only */}
                    {branches.length > 0 && (
                        <div className="hidden lg:flex items-center gap-1.5 text-sm">
                            <BiMapPin className="size-4 text-primary" />
                            <SelectBranch />
                        </div>
                    )}

                    {/* Nav Links — desktop only */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-base-content/70">
                        <Link href="/search" className="hover:text-primary transition-colors">
                            Servicios
                        </Link>
                        <Link href="/search" className="hover:text-primary transition-colors">
                            Estilistas
                        </Link>
                        <Link href="/search" className="hover:text-primary transition-colors">
                            Precios
                        </Link>
                    </nav>

                    {/* Auth + Cart + Hamburger */}
                    <div className="flex items-center gap-2">
                        <CartIcon />

                        {user ? (
                            <>
                                {clientAdminRole && (
                                    <Link
                                        className="btn btn-ghost btn-sm text-sm font-medium hidden sm:flex"
                                        href={'/admin'}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    className="btn btn-primary btn-sm text-sm font-medium"
                                    href={'/profile'}
                                >
                                    Perfil
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    className="btn btn-ghost btn-sm text-sm font-medium hidden sm:flex"
                                    href={'/auth/login'}
                                >
                                    Ingresar
                                </Link>
                                <Link
                                    className="btn btn-primary btn-sm text-sm font-medium hidden sm:flex"
                                    href={'/auth/signup'}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}

                        {/* Hamburger — mobile only */}
                        <button
                            className="btn btn-ghost btn-sm lg:hidden"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label="Abrir menú"
                        >
                            {menuOpen ? <BsXLg className="size-5" /> : <BsList className="size-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile search bar */}
                <div className="pb-3 md:hidden">
                    <SearchInput
                        onClick={(product) => {
                            router.push(`/product/${product.id}`)
                            setMenuOpen(false)
                        }}
                    />
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="lg:hidden border-t border-base-200 bg-base-100 px-4 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    {/* Nav links */}
                    <nav className="flex flex-col gap-1">
                        <Link
                            href="/search"
                            className="py-2 px-3 rounded-lg text-sm font-medium text-base-content/70 hover:text-primary hover:bg-base-200 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            Servicios
                        </Link>
                        <Link
                            href="/search"
                            className="py-2 px-3 rounded-lg text-sm font-medium text-base-content/70 hover:text-primary hover:bg-base-200 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            Estilistas
                        </Link>
                        <Link
                            href="/search"
                            className="py-2 px-3 rounded-lg text-sm font-medium text-base-content/70 hover:text-primary hover:bg-base-200 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            Precios
                        </Link>
                    </nav>

                    {/* Branch selector */}
                    {branches.length > 0 && (
                        <div className="flex items-center gap-1.5 text-sm px-3">
                            <BiMapPin className="size-4 text-primary shrink-0" />
                            <SelectBranch />
                        </div>
                    )}

                    {/* Auth buttons for mobile */}
                    {!user && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-base-200">
                            <Link
                                className="btn btn-ghost btn-sm w-full"
                                href={'/auth/login'}
                                onClick={() => setMenuOpen(false)}
                            >
                                Ingresar
                            </Link>
                            <Link
                                className="btn btn-primary btn-sm w-full"
                                href={'/auth/signup'}
                                onClick={() => setMenuOpen(false)}
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
