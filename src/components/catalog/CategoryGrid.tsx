'use client'

import type { Category } from '@/types/database'
import { CategoryCard } from './CategoryCard'

interface CategoryGridProps {
  categories: Category[]
  locale: string
  basePath?: string
}

export function CategoryGrid({ categories, locale, basePath }: CategoryGridProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          locale={locale}
          basePath={basePath}
        />
      ))}
    </div>
  )
}
