import { getProductById } from '@/module/product/actions/get-products'
import { ProductDetailPage } from '@/module/product/component/page'
import { notFound } from 'next/navigation'
import React from 'react'


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
