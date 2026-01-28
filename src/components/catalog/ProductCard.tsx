'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { LeadForm } from '@/components/blocks/LeadForm'
import { formatPrice, getLocalizedField } from '@/lib/utils'
import type { Product } from '@/types/database'
import { Package, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  locale: string
  imageUrl?: string
}

export function ProductCard({ product, locale, imageUrl }: ProductCardProps) {
  const t = useTranslations('common')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const name = getLocalizedField(product, 'name', locale)
  const shortDescription = getLocalizedField(product, 'short_description', locale)

  return (
    <>
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all overflow-hidden">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-gray-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[48px]">
            {name}
          </h3>
        </Link>

        {shortDescription && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {shortDescription}
          </p>
        )}

        <div className="mt-3">
          {product.price ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.old_price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.old_price, product.currency)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-500">{t('getPrice')}</span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsModalOpen(true)
            }}
          >
            {t('getPrice')}
          </Button>
        </div>

        <div className="mt-2">
          {product.in_stock ? (
            <span className="text-sm text-green-600">{t('inStock')}</span>
          ) : (
            <span className="text-sm text-red-500">{t('outOfStock')}</span>
          )}
        </div>
      </div>
    </div>

    {isModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsModalOpen(false)}
        />
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t('getPrice')}
            </h2>
            <p className="text-gray-600 mb-4 text-sm line-clamp-2">
              {name}
            </p>
            <LeadForm
              type="price_request"
              productId={product.id}
              buttonText="Отправить заявку"
              className="border-0 shadow-none p-0"
            />
          </div>
        </div>
      </div>
    )}
    </>
  )
}
