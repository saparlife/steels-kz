'use client'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Category {
  id: string
  parent_id: string | null
  slug: string
  name_ru: string
  name_kz: string | null
  description_ru: string | null
  description_kz: string | null
  meta_title_ru: string | null
  meta_title_kz: string | null
  meta_description_ru: string | null
  meta_description_kz: string | null
  sort_order: number
  is_active: boolean
}

interface ParentCategory {
  id: string
  name_ru: string
  level: number
}

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([])
  const [formData, setFormData] = useState<Category | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/categories/${params.id}`).then(res => res.json()),
      fetch('/api/admin/categories').then(res => res.json()),
    ]).then(([categoryData, categoriesData]) => {
      setFormData(categoryData.category)
      // Filter out current category and its descendants
      setParentCategories(
        (categoriesData.categories || []).filter((cat: ParentCategory) => cat.id !== params.id)
      )
      setIsFetching(false)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setError('')
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parent_id: formData.parent_id || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения')
        return
      }

      router.push('/admin/categories')
      router.refresh()
    } catch {
      setError('Произошла ошибка. Попробуйте снова.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return <div className="text-center py-12">Загрузка...</div>
  }

  if (!formData) {
    return <div className="text-center py-12 text-red-500">Категория не найдена</div>
  }

  const parentOptions = [
    { value: '', label: 'Нет (корневая категория)' },
    ...parentCategories.map(cat => ({
      value: cat.id,
      label: '—'.repeat(cat.level) + ' ' + cat.name_ru,
    })),
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать категорию</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Основные данные</h2>

          <Select
            id="parent_id"
            label="Родительская категория"
            options={parentOptions}
            value={formData.parent_id || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, parent_id: e.target.value || null } : null)}
          />

          <Input
            id="name_ru"
            label="Название (RU) *"
            value={formData.name_ru}
            onChange={(e) => setFormData(prev => prev ? { ...prev, name_ru: e.target.value } : null)}
            required
          />

          <Input
            id="name_kz"
            label="Название (KZ)"
            value={formData.name_kz || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, name_kz: e.target.value } : null)}
          />

          <Input
            id="slug"
            label="URL (slug) *"
            value={formData.slug}
            onChange={(e) => setFormData(prev => prev ? { ...prev, slug: e.target.value } : null)}
            required
          />

          <Textarea
            id="description_ru"
            label="Описание (RU)"
            value={formData.description_ru || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, description_ru: e.target.value } : null)}
          />

          <Textarea
            id="description_kz"
            label="Описание (KZ)"
            value={formData.description_kz || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, description_kz: e.target.value } : null)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">SEO</h2>

          <Input
            id="meta_title_ru"
            label="Meta Title (RU)"
            value={formData.meta_title_ru || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, meta_title_ru: e.target.value } : null)}
          />

          <Input
            id="meta_title_kz"
            label="Meta Title (KZ)"
            value={formData.meta_title_kz || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, meta_title_kz: e.target.value } : null)}
          />

          <Textarea
            id="meta_description_ru"
            label="Meta Description (RU)"
            value={formData.meta_description_ru || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, meta_description_ru: e.target.value } : null)}
          />

          <Textarea
            id="meta_description_kz"
            label="Meta Description (KZ)"
            value={formData.meta_description_kz || ''}
            onChange={(e) => setFormData(prev => prev ? { ...prev, meta_description_kz: e.target.value } : null)}
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Настройки</h2>

          <Input
            id="sort_order"
            label="Порядок сортировки"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => prev ? { ...prev, sort_order: Number(e.target.value) } : null)}
          />

          <Checkbox
            id="is_active"
            label="Активна (показывать на сайте)"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Сохранить
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  )
}
