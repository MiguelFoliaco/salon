'use client';

import { useCart } from "../context/useCart";
import { BiMinus, BiPlus, BiTrash, BiX } from "react-icons/bi";
import { BsCart3 } from "react-icons/bs";
import Image from "next/image";
import Link from "next/link";

export const CartDrawer = () => {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();

    const totalPrice = getTotalPrice();

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-neutral/50 z-40 transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-base-100 shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-base-200">
                    <div className="flex items-center gap-3">
                        <BsCart3 className="size-6 text-primary" />
                        <h2 className="text-xl font-bold">Tu Carrito</h2>
                        <span className="badge badge-primary badge-sm">{items.length}</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="btn btn-ghost btn-sm btn-circle"
                    >
                        <BiX className="size-6" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4">
                                <BsCart3 className="size-10 text-base-content/30" />
                            </div>
                            <h3 className="text-lg font-semibold mb-1">Tu carrito esta vacio</h3>
                            <p className="text-sm text-base-content/60 mb-4">
                                Agrega productos para comenzar
                            </p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-primary btn-sm"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => {
                                const itemPrice = item.product.value;
                                const itemTax = itemPrice * (item.product.taxe?.percentage || 0);
                                const itemTotal = (itemPrice + itemTax) * item.quantity;

                                return (
                                    <div
                                        key={item.product.id}
                                        className="flex gap-4 p-3 bg-base-200/50 rounded-xl"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                                            <Image
                                                src={item.product.image || "/placeholder.jpg"}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm line-clamp-1">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs text-base-content/60 mb-2">
                                                {item.product.type?.name}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product.id,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="btn btn-xs btn-circle btn-ghost"
                                                    >
                                                        <BiMinus className="size-4" />
                                                    </button>
                                                    <span className="font-semibold w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.product.id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="btn btn-xs btn-circle btn-ghost"
                                                    >
                                                        <BiPlus className="size-4" />
                                                    </button>
                                                </div>
                                                <span className="font-bold text-sm">
                                                    ${itemTotal.toLocaleString("es-CO")}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="btn btn-ghost btn-xs btn-circle text-error self-start"
                                        >
                                            <BiTrash className="size-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-base-200 p-4 space-y-4">
                        {/* Clear Cart */}
                        <button
                            onClick={clearCart}
                            className="btn btn-ghost btn-sm w-full text-error"
                        >
                            <BiTrash className="size-4" />
                            Vaciar carrito
                        </button>

                        {/* Total */}
                        <div className="flex items-center justify-between py-2">
                            <span className="text-base-content/70">Subtotal</span>
                            <span className="text-xl font-bold">
                                ${totalPrice.toLocaleString("es-CO")} COP
                            </span>
                        </div>

                        {/* Checkout Button */}
                        <Link
                            href="/checkout"
                            onClick={() => setIsOpen(false)}
                            className="btn btn-primary w-full"
                        >
                            Proceder al pago
                        </Link>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn btn-ghost btn-sm w-full"
                        >
                            Continuar comprando
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
