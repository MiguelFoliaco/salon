"use client"

import Image from "next/image"
import { cn } from "@/utils/cn"
import { Product } from "../../actions/get-products"
import clsx from "clsx"
import { calculatePrice } from "@/module/utils/calculate-priece"



interface ProductCardProps {
  product: Product
  onAction?: (product: Product) => void
  /*
  * this is only for products are not services
  */
  onAddToCard?: (product: Product) => void
}

export function ProductCard({ product, onAction, onAddToCard }: ProductCardProps) {

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden  bg-base-100 border border-base-300",
        "transition-all duration-300 ease-out",
        "hover:shadow-xl hover:-translate-y-1"
      )}
    >
      {/* Image section */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-base-200">
        <Image
          src={product.image || ""}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-linear-to-t from-neutral/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Type badge */}
        <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-md bg-primary text-primary-content">
          {product?.type?.name}
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Title */}
        <h3 className="text-base font-bold leading-snug text-base-content line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-base-content/60 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        {/* Price and action */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold tracking-tight text-base-content">
              ${calculatePrice(product).total.toLocaleString("es-CO")}
            </span>
            <span className="text-xs font-medium text-base-content/50">COP</span>
          </div>
          <div className="join">
            {
              !product.is_service && <button onClick={() => onAction?.(product)} className="btn btn-primary btn-sm join-item shadow-none">
                Ver
              </button>
            }
            <button
              onClick={() => product.is_service ? onAction?.(product) : onAddToCard?.(product)}
              className={
                clsx(
                  "btn btn-primary btn-outline btn-sm shadow-none",
                  !product.is_service && 'join-item'
                )
              }
            >
              {product.is_service ? 'Programar' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
