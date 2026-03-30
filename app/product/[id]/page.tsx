import { getProductById } from '@/module/product/actions/get-products'
import { ProductDetailPage } from '@/module/product/component/page'
import { notFound } from 'next/navigation'


type PageProps = {
    params: Promise<{ id: string }>
}
export const ProductPage = async ({ params }: PageProps) => {
    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
        notFound()
    }

    return <ProductDetailPage product={product} />
}

export default ProductPage


export async function generateMetadata({ params }: PageProps) {
    const { id } = await params
    const product = await getProductById(id)

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