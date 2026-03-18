'use client';

import { Header } from '../common/components/header';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProductById, Product } from '../product/actions/get-products';
import { useToast } from '../common/hook/useToast';
import { useCart } from '../cart/context/useCart';
import Image from 'next/image';
import { BiMinus, BiPlus, BiChevronLeft, BiPackage, BiCheck } from 'react-icons/bi';
import { BsCart3, BsTruck, BsShieldCheck, BsArrowReturnLeft } from 'react-icons/bs';
import Link from 'next/link';

export const ProductDetailPage = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addedToCart, setAddedToCart] = useState(false);
    
    const params = useParams();
    const router = useRouter();
    const { openToast } = useToast();
    const { addItem } = useCart();

    useEffect(() => {
        if (params.productId) {
            setLoading(true);
            getProductById(params.productId as string)
                .then((data) => {
                    if (data) {
                        // Si es un servicio, redirigir a booking
                        if (data.is_service) {
                            router.replace(`/booking/${data.id}`);
                            return;
                        }
                        setProduct(data);
                    } else {
                        openToast("Producto no encontrado", "error");
                        router.back();
                    }
                })
                .catch(() => {
                    openToast("Error al cargar el producto", "error");
                    router.back();
                })
                .finally(() => setLoading(false));
        }
    }, [params.productId, router, openToast]);

    const handleAddToCart = () => {
        if (!product) return;
        
        if (product.stock !== null && product.stock < quantity) {
            openToast("No hay suficiente stock disponible", "error");
            return;
        }

        addItem(product, quantity);
        setAddedToCart(true);
        openToast(`${product.name} agregado al carrito`, "success");
        
        setTimeout(() => setAddedToCart(false), 2000);
    };

    const incrementQuantity = () => {
        if (product?.stock !== null && quantity >= (product?.stock || 0)) {
            openToast("No puedes agregar mas unidades", "warning");
            return;
        }
        setQuantity(q => q + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    // Calcular precio
    const price = product?.value || 0;
    const taxPercentage = product?.taxe?.percentage || 0;
    const taxAmount = price * taxPercentage;
    const totalPrice = price + taxAmount;
    const totalWithQuantity = totalPrice * quantity;

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100">
                <Header />
                <div className="flex items-center justify-center h-[60vh]">
                    <span className="loading loading-spinner loading-lg text-primary" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-base-100">
                <Header />
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <BiPackage className="size-16 text-base-content/30 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Producto no encontrado</h2>
                    <p className="text-base-content/60 mb-4">El producto que buscas no existe o fue removido.</p>
                    <Link href="/" className="btn btn-primary">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100">
            <Header />

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-base-content/60 hover:text-primary transition-colors"
                >
                    <BiChevronLeft className="size-5" />
                    Volver atras
                </button>
            </div>

            {/* Product Detail */}
            <main className="max-w-7xl mx-auto px-4 lg:px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-base-200">
                        <Image
                            src={product.image || "/placeholder.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md bg-primary text-primary-content">
                            {product.type?.name}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        {/* Title & Description */}
                        <div className="mb-6">
                            <h1 className="text-3xl lg:text-4xl font-bold text-base-content mb-3">
                                {product.name}
                            </h1>
                            <p className="text-base-content/70 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="mb-6 p-4 bg-base-200/50 rounded-xl">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold text-base-content">
                                    ${totalPrice.toLocaleString("es-CO")}
                                </span>
                                <span className="text-sm text-base-content/50">COP</span>
                            </div>
                            {taxAmount > 0 && (
                                <p className="text-xs text-base-content/50">
                                    Incluye {(taxPercentage * 100).toFixed(0)}% de impuesto (${taxAmount.toLocaleString("es-CO")})
                                </p>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {product.stock !== null && (
                                <div className={`flex items-center gap-2 text-sm ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                                    <BiCheck className="size-5" />
                                    {product.stock > 0 
                                        ? `${product.stock} unidades disponibles`
                                        : 'Agotado'
                                    }
                                </div>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-base-content/70 mb-2 block">
                                Cantidad
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-base-300 rounded-xl overflow-hidden">
                                    <button
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1}
                                        className="btn btn-ghost btn-sm btn-square disabled:opacity-50"
                                    >
                                        <BiMinus className="size-5" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQuantity}
                                        disabled={product.stock !== null && quantity >= product.stock}
                                        className="btn btn-ghost btn-sm btn-square disabled:opacity-50"
                                    >
                                        <BiPlus className="size-5" />
                                    </button>
                                </div>
                                <span className="text-base-content/60 text-sm">
                                    Total: <strong className="text-base-content">${totalWithQuantity.toLocaleString("es-CO")} COP</strong>
                                </span>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock !== null && product.stock <= 0}
                            className={`btn btn-lg gap-3 mb-6 ${addedToCart ? 'btn-success' : 'btn-primary'} disabled:opacity-50`}
                        >
                            {addedToCart ? (
                                <>
                                    <BiCheck className="size-6" />
                                    Agregado al carrito
                                </>
                            ) : (
                                <>
                                    <BsCart3 className="size-5" />
                                    Agregar al carrito
                                </>
                            )}
                        </button>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-base-200">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                                    <BsTruck className="size-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Envio gratis</p>
                                    <p className="text-xs text-base-content/50">En pedidos +$100.000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                                    <BsShieldCheck className="size-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Garantia</p>
                                    <p className="text-xs text-base-content/50">Productos originales</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-10 h-10 rounded-full bg-base-200 flex items-center justify-center">
                                    <BsArrowReturnLeft className="size-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">Devoluciones</p>
                                    <p className="text-xs text-base-content/50">30 dias para devolver</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
