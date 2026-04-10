import { Product } from "@/module/product/actions/get-products";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { calculatePrice } from "@/module/utils/calculate-priece";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const router = useRouter()

    return (
        <div onClick={() => {
            if (product.is_service) {
                router.push(`/booking/${product.id}`)
            } else {
                router.push(`/product/${product.id}`)
            }
        }} className="hover:scale-95 transition-all cursor-pointer card bg-base-100 shadow-xl border border-base-200 h-full">
            <figure className="relative h-48 w-full bg-base-200">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full w-full text-base-content/30">
                        Sin imagen
                    </div>
                )}
            </figure>
            <div className="card-body p-4">
                {product.type && (
                    <div className="badge badge-primary badge-outline text-xs mb-2">
                        {product.type.name}
                    </div>
                )}
                <h2 className="card-title text-lg leading-tight line-clamp-2" title={product.name}>
                    {product.name}
                </h2>
                <p className="text-sm text-base-content/70 line-clamp-2 mt-1 mb-2">
                    {product.description || "Sin descripción"}
                </p>
                <div className="card-actions justify-between items-end mt-auto">
                    <div className="text-xl font-bold text-primary">
                        ${calculatePrice(product).total.toLocaleString()}
                    </div>
                    {(product.inventory[0]?.stock && !product.is_service) && (
                        <div className={`text-xs font-semibold ${(product.inventory[0]?.stock || 0) > 0 ? "text-info" : "text-error"}`}>
                            {(product.inventory[0]?.stock || 0) > 0 ? `${product.inventory[0]?.stock} disponibles` : "Agotado"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
