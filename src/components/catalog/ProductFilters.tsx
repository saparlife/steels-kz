'use client'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { getLocalizedField } from '@/lib/utils'
import type { AttributeDefinition } from '@/types/database'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

interface FilterValue {
  value: string
  count: number
}

interface Filter {
  attribute: AttributeDefinition
  values: FilterValue[]
  type: 'select' | 'range'
  min?: number
  max?: number
}

interface ProductFiltersProps {
  filters: Filter[]
  locale: string
}

export function ProductFilters({ filters, locale }: ProductFiltersProps) {
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [openFilters, setOpenFilters] = useState<string[]>(filters.map(f => f.attribute.slug))

  const toggleFilter = (slug: string) => {
    setOpenFilters(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : [...prev, slug]
    )
  }

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null) {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      params.delete('page') // Reset to first page when filtering
      return params.toString()
    },
    [searchParams]
  )

  const handleFilterChange = (slug: string, value: string, checked: boolean) => {
    const currentValues = searchParams.get(slug)?.split(',').filter(Boolean) || []
    let newValues: string[]

    if (checked) {
      newValues = [...currentValues, value]
    } else {
      newValues = currentValues.filter(v => v !== value)
    }

    const queryString = createQueryString(slug, newValues.length > 0 ? newValues.join(',') : null)
    router.push(`${pathname}?${queryString}`)
  }

  const handleRangeChange = (slug: string, min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (min) {
      params.set(`${slug}_min`, min)
    } else {
      params.delete(`${slug}_min`)
    }
    if (max) {
      params.set(`${slug}_max`, max)
    } else {
      params.delete(`${slug}_max`)
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  const hasActiveFilters = filters.some(f =>
    searchParams.has(f.attribute.slug) ||
    searchParams.has(`${f.attribute.slug}_min`) ||
    searchParams.has(`${f.attribute.slug}_max`)
  )

  if (filters.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{t('filters')}</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            {t('clearFilters')}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filters.map((filter) => {
          const isOpen = openFilters.includes(filter.attribute.slug)
          const name = getLocalizedField(filter.attribute, 'name', locale)
          const unit = locale === 'kz' ? filter.attribute.unit_kz : filter.attribute.unit
          const selectedValues = searchParams.get(filter.attribute.slug)?.split(',') || []

          return (
            <div key={filter.attribute.id} className="border-t border-gray-100 pt-4">
              <button
                onClick={() => toggleFilter(filter.attribute.slug)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="font-medium text-gray-900">
                  {name}
                  {unit && <span className="text-gray-500 font-normal">, {unit}</span>}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {isOpen && (
                <div className="mt-3">
                  {filter.type === 'select' ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filter.values.map((fv) => (
                        <Checkbox
                          key={fv.value}
                          id={`${filter.attribute.slug}-${fv.value}`}
                          label={`${fv.value} (${fv.count})`}
                          checked={selectedValues.includes(fv.value)}
                          onChange={(e) =>
                            handleFilterChange(filter.attribute.slug, fv.value, e.target.checked)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="от"
                        className="w-24"
                        defaultValue={searchParams.get(`${filter.attribute.slug}_min`) || ''}
                        onBlur={(e) =>
                          handleRangeChange(
                            filter.attribute.slug,
                            e.target.value,
                            searchParams.get(`${filter.attribute.slug}_max`) || ''
                          )
                        }
                      />
                      <span className="text-gray-500">—</span>
                      <Input
                        type="number"
                        placeholder="до"
                        className="w-24"
                        defaultValue={searchParams.get(`${filter.attribute.slug}_max`) || ''}
                        onBlur={(e) =>
                          handleRangeChange(
                            filter.attribute.slug,
                            searchParams.get(`${filter.attribute.slug}_min`) || '',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
