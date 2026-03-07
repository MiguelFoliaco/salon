"use client"

import Image from "next/image"
import { cn } from "@/utils/cn"
import { BiPackage } from "react-icons/bi"
import { CgCalendar, CgShoppingCart } from "react-icons/cg"
import { Product } from "../../actions/get-products"



interface ProductCardProps {
  product: Product
  onAction?: (product: Product) => void
}

export function ProductCard({ product, onAction }: ProductCardProps) {


  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
      )}
    >
      {/* Image section */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">

        <Image
          src={product.image || ""}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />


        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-foreground/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Type badge */}
        <div
          className={"absolute top-3 left-3 badge border-primary bg-primary"}
        >
          <>
            <BiPackage className="size-3" />
            {product.type.name}
          </>
        </div>

      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Title and description */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-bold leading-snug text-card-foreground text-balance line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Price and action */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Precio
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-card-foreground">
              ${product.value.toLocaleString("es-CO")}
              <span className="ml-1 text-xs font-medium text-muted-foreground">COP</span>
            </span>
          </div>

          <button
            onClick={() => onAction?.(product)}
            className={"btn btn-sm btn-primary gap-2 "}
          >
            {
              product.is_service ?
                <>
                  <CgCalendar className="size-4" />
                  Programar
                </>
                :
                <>
                  <CgShoppingCart className="size-4" />
                  Agregar
                </>
            }
          </button>
        </div>
      </div>
    </article>
  )
}
