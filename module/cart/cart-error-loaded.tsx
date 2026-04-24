import Link from "next/link"

export const CartErrorLoaded = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center py-24 gap-6 bg-base-100 rounded-2xl border border-base-200">
            <div className="text-center">
                <h2 className="text-xl font-bold text-base-content mb-1">Error al cargar el carrito</h2>
                <p className="text-base-content/50 text-sm">Intenta recargar la página</p>
            </div>
            <Link href="/" className="btn btn-primary btn-wide">
                Recargar
            </Link>
        </div>
    )
}