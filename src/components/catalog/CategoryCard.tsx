'use client'

import { getLocalizedField } from '@/lib/utils'
import type { Category } from '@/types/database'
import { ChevronRight, Folder } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryCardProps {
  category: Category
  locale: string
  basePath?: string
}

export function CategoryCard({ category, locale, basePath = '/katalog' }: CategoryCardProps) {
  const name = getLocalizedField(category, 'name', locale)
  const href = `${basePath}/${category.slug}`

  return (
    <Link
      href={href}
      className="group block p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4">
        {category.image_url ? (
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={category.image_url}
              alt={name}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <Folder className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
            {name}
          </h3>
          {category.products_count > 0 && (
            <p className="text-sm text-gray-500">
              {category.products_count} товаров
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
      </div>
    </Link>
  )
}
