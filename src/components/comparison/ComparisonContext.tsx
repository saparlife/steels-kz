'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Product } from '@/types/database'

interface ComparisonItem {
  id: string
  name: string
  slug: string
  category_slug?: string
  image_url?: string | null
  price?: number | null
  attributes?: Record<string, string | number | null>
}

interface ComparisonContextType {
  items: ComparisonItem[]
  addItem: (item: ComparisonItem) => void
  removeItem: (id: string) => void
  clearAll: () => void
  isInComparison: (id: string) => boolean
  maxItems: number
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined)

const MAX_COMPARISON_ITEMS = 4
const STORAGE_KEY = 'steel_comparison'

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ComparisonItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [items, isInitialized])

  const addItem = useCallback((item: ComparisonItem) => {
    setItems((prev) => {
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        return prev
      }
      if (prev.some((i) => i.id === item.id)) {
        return prev
      }
      return [...prev, item]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setItems([])
  }, [])

  const isInComparison = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  )

  return (
    <ComparisonContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearAll,
        isInComparison,
        maxItems: MAX_COMPARISON_ITEMS,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  )
}

export function useComparison() {
  const context = useContext(ComparisonContext)
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider')
  }
  return context
}
