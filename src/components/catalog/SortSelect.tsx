'use client'

import { Select } from '@/components/ui/Select'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SortSelect() {
  const t = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortOptions = [
    { value: 'popular', label: t('sortByPopular') },
    { value: 'name_asc', label: t('sortByName') + ' (А-Я)' },
    { value: 'name_desc', label: t('sortByName') + ' (Я-А)' },
    { value: 'price_asc', label: t('sortByPrice') + ' ↑' },
    { value: 'price_desc', label: t('sortByPrice') + ' ↓' },
    { value: 'new', label: t('sortByNew') },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value === 'popular') {
      params.delete('sort')
    } else {
      params.set('sort', e.target.value)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{t('sort')}:</span>
      <Select
        options={sortOptions}
        value={searchParams.get('sort') || 'popular'}
        onChange={handleChange}
        className="w-48"
      />
    </div>
  )
}
