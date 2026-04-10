
import { BookingPage } from "@/module/booking";
import { getProductById } from "@/module/product/actions/get-products";

export default function Booking() {
    return <BookingPage />
}

type PageProps = {
    params: Promise<{ productId: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { productId } = await params
    const product = await getProductById(productId)

    if (!product) {
        return {
            title: "Producto no encontrado",
        }
    }

    return {
        title: product.name,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [
                {
                    url: product.image!,
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
        }, twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
            images: [product.image!],
        },
    }
}