'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useComparison } from './ComparisonContext'
import { X, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

interface ComparisonTableProps {
  attributeLabels?: Record<string, string>
}

export function ComparisonTable({ attributeLabels = {} }: ComparisonTableProps) {
  const { items, removeItem, clearAll } = useComparison()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Нет товаров для сравнения
        </h2>
        <p className="text-gray-600 mb-6">
          Добавьте товары к сравнению из каталога
        </p>
        <Link
          href="/katalog"
          className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  // Collect all unique attribute keys from all items
  const allAttributeKeys = new Set<string>()
  items.forEach((item) => {
    if (item.attributes) {
      Object.keys(item.attributes).forEach((key) => allAttributeKeys.add(key))
    }
  })

  const attributeKeys = Array.from(allAttributeKeys)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Сравнение {items.length} {items.length === 1 ? 'товара' : items.length < 5 ? 'товаров' : 'товаров'}
        </p>
        <button
          onClick={clearAll}
          className="text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          Очистить все
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 bg-gray-50 border-b font-medium text-gray-700 w-48">
                Характеристика
              </th>
              {items.map((item) => (
                <th key={item.id} className="p-4 bg-gray-50 border-b min-w-[200px]">
                  <div className="relative">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Убрать из сравнения"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/katalog/${item.category_slug}/${item.slug}`}
                      className="block group"
                    >
                      <div className="w-24 h-24 mx-auto mb-3 bg-gray-100 rounded-lg overflow-hidden relative">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                        {item.name}
                      </span>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Price row */}
            <tr>
              <td className="p-4 border-b font-medium text-gray-700">Цена</td>
              {items.map((item) => (
                <td key={item.id} className="p-4 border-b text-center">
                  {item.price ? (
                    <span className="text-lg font-bold text-orange-500">
                      {formatPrice(item.price)}
                    </span>
                  ) : (
                    <span className="text-gray-400">По запросу</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Attribute rows */}
            {attributeKeys.map((key) => (
              <tr key={key}>
                <td className="p-4 border-b font-medium text-gray-700">
                  {attributeLabels[key] || key}
                </td>
                {items.map((item) => {
                  const value = item.attributes?.[key]
                  return (
                    <td key={item.id} className="p-4 border-b text-center text-gray-600">
                      {value !== null && value !== undefined ? (
                        String(value)
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/katalog/${item.category_slug}/${item.slug}`}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Подробнее: {item.name.slice(0, 20)}...
          </Link>
        ))}
      </div>
    </div>
  )
}
