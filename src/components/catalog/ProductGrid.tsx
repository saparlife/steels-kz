'use client'

import type { Product } from '@/types/database'
import { useTranslations } from 'next-intl'
import { ProductCard } from './ProductCard'

interface ProductImage {
  id: string
  url: string
  is_primary: boolean
  sort_order: number
}

interface ProductWithImages extends Product {
  product_images?: ProductImage[]
}

interface ProductGridProps {
  products: ProductWithImages[]
  locale: string
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  const t = useTranslations('common')

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        {t('noResults')}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => {
        const primaryImage = product.product_images?.find(img => img.is_primary)
          || product.product_images?.sort((a, b) => a.sort_order - b.sort_order)?.[0]
        return (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            imageUrl={primaryImage?.url}
          />
        )
      })}
    </div>
  )
}
