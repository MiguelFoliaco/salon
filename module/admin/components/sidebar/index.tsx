'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BsCalendarCheck,
    BsBoxSeam,
    BsPersonBadge,
    BsPeople,
    BsCashCoin,
    BsGear,
    BsBoxArrowLeft,
    BsTruck
} from 'react-icons/bs';
import { useUser } from '@/module/auth/context/useUser';
import { logout } from '@/module/auth/actions/session';
import { BiShapePolygon } from 'react-icons/bi';
import { CONSTANT } from '@/constant';

export const SidebarAdmin = () => {
    const pathname = usePathname();
    const { exit: _exit } = useUser();

    const menuItems = [
        { name: 'Citas', path: '/admin', icon: <BsCalendarCheck size={20} /> },
        { name: 'Productos', path: '/admin/products', icon: <BsBoxSeam size={20} /> },
        { name: 'Empleados', path: '/admin/employees', icon: <BsPersonBadge size={20} /> },
        { name: 'Clientes', path: '/admin/clients', icon: <BsPeople size={20} /> },
        { name: 'Domicilios', path: '/admin/orders', icon: <BsTruck size={20} /> },
        { name: 'Poligonos', path: '/admin/polygons', icon: <BiShapePolygon size={20} /> },
        { name: 'Impuestos', path: '/admin/taxes', icon: <BsCashCoin size={20} /> },
        { name: 'Configuración', path: '/admin/settings', icon: <BsGear size={20} /> },
        { name: 'Notificaciones', path: '/admin/notifications', icon: <BsGear size={20} /> },
    ];

    const handleLogout = async () => {
        await logout();
        _exit();
        window.location.href = '/login';
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-base-100 border-r border-base-200 h-full p-4 relative z-20 shadow-sm">
                <div className="mb-8 px-4 py-2">
                    <h1 className="text-2xl font-black tracking-tight">Admin<span className="text-primary">{CONSTANT.NAME}</span></h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 font-medium transition-all ${isActive
                                    ? 'bg-primary text-primary-content shadow-md shadow-primary/20'
                                    : 'text-base-content hover:bg-base-50 hover:text-base-900'
                                    }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto pt-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:text-red-500 w-full transition-all"
                    >
                        <BsBoxArrowLeft size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-3 flex justify-between pb-safe">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg ${isActive
                                ? 'text-primary'
                                : 'text-slate-400'
                                }`}
                        >
                            <div className={`${isActive ? 'bg-pink-50 p-2 rounded-full mb-1' : 'mb-1'}`}>
                                {item.icon}
                            </div>
                            <span className="text-[10px] font-semibold">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </>
    );
};
