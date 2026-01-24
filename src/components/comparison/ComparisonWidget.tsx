'use client'

import Link from 'next/link'
import { useComparison } from './ComparisonContext'
import { Scale, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComparisonWidget() {
  const { items, removeItem, clearAll } = useComparison()

  if (items.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-orange-500" />
            <span className="font-medium text-gray-900">
              Сравнение ({items.length})
            </span>
          </div>
          <button
            onClick={clearAll}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Очистить
          </button>
        </div>

        <div className="space-y-2 mb-4">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="text-gray-600 truncate flex-1">
                {item.name}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {items.length > 3 && (
            <div className="text-sm text-gray-400">
              и ещё {items.length - 3}...
            </div>
          )}
        </div>

        <Link
          href="/sravnenie"
          className="block w-full py-2 bg-orange-500 text-white text-center rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Сравнить товары
        </Link>
      </div>
    </div>
  )
}
