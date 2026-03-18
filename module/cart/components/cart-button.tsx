'use client';

import { useCart } from "../context/useCart";
import { BsCart3 } from "react-icons/bs";

export const CartButton = () => {
    const { getTotalItems, setIsOpen } = useCart();
    const totalItems = getTotalItems();

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="btn btn-ghost btn-sm btn-circle relative"
        >
            <BsCart3 className="size-5" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                </span>
            )}
        </button>
    );
};
