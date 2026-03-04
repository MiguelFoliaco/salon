import { Product } from "@/module/product/actions/get-products";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="card bg-base-100 shadow-xl border border-base-200 h-full">
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
                    <div className="badge badge-secondary badge-outline text-xs mb-2">
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
                        ${product.value?.toLocaleString()}
                    </div>
                    {product.stock !== undefined && (
                        <div className={`text-xs font-semibold ${(product.stock || 0) > 0 ? "text-success" : "text-error"}`}>
                            {(product.stock || 0) > 0 ? `${product.stock} disponibles` : "Agotado"}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
