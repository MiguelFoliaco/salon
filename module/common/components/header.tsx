'use client';
import { useUser } from '@/module/auth/context/useUser';
import { SelectBranch } from '@/module/branches/components/select-branch';
import { useBranches } from '@/module/branches/context/use-branches';
import { SearchInput } from '@/module/search/components/input-search';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { BsScissors } from 'react-icons/bs';
import { BiMapPin } from 'react-icons/bi';
import { useEmploye } from '@/module/booking/context/use-employe';

export const Header = () => {

    const { user, clientAdminRole } = useUser(state => state)
    const router = useRouter()
    const { branches } = useBranches()

    return (
        <header className="sticky top-0 z-30 bg-base-100 border-b border-base-200">
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

                    {/* Branch Selector with Location Icon */}
                    {branches.length > 0 && (
                        <div className="hidden lg:flex items-center gap-1.5 text-sm">
                            <BiMapPin className="size-4 text-primary" />
                            <SelectBranch />
                        </div>
                    )}

                    {/* Navigation Links */}
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

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                {
                                    clientAdminRole &&
                                    <Link
                                        className="btn btn-ghost btn-sm text-sm font-medium"
                                        href={'/admin'}
                                    >
                                        Admin
                                    </Link>
                                }
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
                                    className="btn btn-primary btn-sm text-sm font-medium"
                                    href={'/auth/signup'}
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
