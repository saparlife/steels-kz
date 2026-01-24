import Link from 'next/link'
import Image from 'next/image'
import { Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/database'

interface RelatedProductsProps {
  title?: string
  products: Product[]
  className?: string
}

export function RelatedProducts({
  title = 'Похожие товары',
  products,
  className = '',
}: RelatedProductsProps) {
  if (!products.length) return null

  return (
    <section className={`py-12 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative bg-gray-100">
              {product.source_url ? (
                <Image
                  src={product.source_url}
                  alt={product.name_ru}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-300" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                {product.name_ru}
              </h3>

              {product.price ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.old_price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.old_price)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm text-gray-500">Цена по запросу</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
