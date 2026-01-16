'use client'

import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    return `${baseUrl}?${params.toString()}`
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 2

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <Link
            key={index}
            href={buildUrl(page)}
            className={cn(
              'px-3 py-2 rounded-lg transition-colors min-w-[40px] text-center',
              page === currentPage
                ? 'bg-orange-500 text-white'
                : 'hover:bg-gray-100'
            )}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-2">
            {page}
          </span>
        )
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </nav>
  )
}
