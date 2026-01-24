'use client'

import { useComparison } from './ComparisonContext'
import { Scale, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompareButtonProps {
  item: {
    id: string
    name: string
    slug: string
    category_slug?: string
    image_url?: string | null
    price?: number | null
    attributes?: Record<string, string | number | null>
  }
  variant?: 'icon' | 'button' | 'text'
  className?: string
}

export function CompareButton({ item, variant = 'button', className }: CompareButtonProps) {
  const { addItem, removeItem, isInComparison, items, maxItems } = useComparison()

  const inComparison = isInComparison(item.id)
  const isFull = items.length >= maxItems

  const handleClick = () => {
    if (inComparison) {
      removeItem(item.id)
    } else if (!isFull) {
      addItem(item)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        disabled={!inComparison && isFull}
        className={cn(
          'p-2 rounded-lg transition-colors',
          inComparison
            ? 'bg-orange-100 text-orange-600'
            : isFull
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600',
          className
        )}
        title={
          inComparison
            ? 'Убрать из сравнения'
            : isFull
              ? `Максимум ${maxItems} товара`
              : 'Добавить к сравнению'
        }
      >
        {inComparison ? (
          <Check className="w-5 h-5" />
        ) : (
          <Scale className="w-5 h-5" />
        )}
      </button>
    )
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleClick}
        disabled={!inComparison && isFull}
        className={cn(
          'flex items-center gap-2 text-sm transition-colors',
          inComparison
            ? 'text-orange-600'
            : isFull
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-orange-600',
          className
        )}
      >
        {inComparison ? (
          <>
            <Check className="w-4 h-4" />
            В сравнении
          </>
        ) : (
          <>
            <Scale className="w-4 h-4" />
            Сравнить
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={!inComparison && isFull}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        inComparison
          ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
          : isFull
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600',
        className
      )}
    >
      {inComparison ? (
        <>
          <Check className="w-4 h-4" />
          В сравнении
        </>
      ) : (
        <>
          <Scale className="w-4 h-4" />
          Сравнить
        </>
      )}
    </button>
  )
}
