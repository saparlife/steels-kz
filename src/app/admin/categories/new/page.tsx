'use client'

import { ImageUpload } from '@/components/admin/ImageUpload'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { slugify } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ParentCategory {
  id: string
  name_ru: string
  level: number
}

export default function NewCategoryPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([])

  const [formData, setFormData] = useState({
    parent_id: '',
    slug: '',
    name_ru: '',
    name_kz: '',
    description_ru: '',
    description_kz: '',
    meta_title_ru: '',
    meta_title_kz: '',
    meta_description_ru: '',
    meta_description_kz: '',
    seo_text_ru: '',
    seo_text_kz: '',
    image_url: null as string | null,
    icon_url: null as string | null,
    sort_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setParentCategories(data.categories || []))
  }, [])

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name_ru: value,
      slug: prev.slug || slugify(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
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

  const parentOptions = [
    { value: '', label: 'Нет (корневая категория)' },
    ...parentCategories.map(cat => ({
      value: cat.id,
      label: '—'.repeat(cat.level) + ' ' + cat.name_ru,
    })),
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Добавить категорию</h1>

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
            value={formData.parent_id}
            onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
          />

          <Input
            id="name_ru"
            label="Название (RU) *"
            value={formData.name_ru}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <Input
            id="name_kz"
            label="Название (KZ)"
            value={formData.name_kz}
            onChange={(e) => setFormData(prev => ({ ...prev, name_kz: e.target.value }))}
          />

          <Input
            id="slug"
            label="URL (slug) *"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            required
          />

          <Textarea
            id="description_ru"
            label="Описание (RU)"
            value={formData.description_ru}
            onChange={(e) => setFormData(prev => ({ ...prev, description_ru: e.target.value }))}
          />

          <Textarea
            id="description_kz"
            label="Описание (KZ)"
            value={formData.description_kz}
            onChange={(e) => setFormData(prev => ({ ...prev, description_kz: e.target.value }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              folder="categories"
              label="Изображение категории"
            />
            <ImageUpload
              value={formData.icon_url}
              onChange={(url) => setFormData(prev => ({ ...prev, icon_url: url }))}
              folder="categories/icons"
              label="Иконка категории"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">SEO</h2>

          <Input
            id="meta_title_ru"
            label="Meta Title (RU)"
            value={formData.meta_title_ru}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_title_ru: e.target.value }))}
          />

          <Input
            id="meta_title_kz"
            label="Meta Title (KZ)"
            value={formData.meta_title_kz}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_title_kz: e.target.value }))}
          />

          <Textarea
            id="meta_description_ru"
            label="Meta Description (RU)"
            value={formData.meta_description_ru}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description_ru: e.target.value }))}
          />

          <Textarea
            id="meta_description_kz"
            label="Meta Description (KZ)"
            value={formData.meta_description_kz}
            onChange={(e) => setFormData(prev => ({ ...prev, meta_description_kz: e.target.value }))}
          />

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-1">SEO текст (RU)</h3>
            <p className="text-xs text-gray-500 mb-2">HTML-контент для SEO. Поддерживает теги: h1-h6, p, ul, ol, li, a, strong, em, table и др.</p>
            <textarea
              id="seo_text_ru"
              rows={10}
              value={formData.seo_text_ru}
              onChange={(e) => setFormData(prev => ({ ...prev, seo_text_ru: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              placeholder="<h2>Заголовок</h2><p>Текст...</p>"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">SEO текст (KZ)</h3>
            <p className="text-xs text-gray-500 mb-2">HTML-контент для SEO на казахском языке</p>
            <textarea
              id="seo_text_kz"
              rows={10}
              value={formData.seo_text_kz}
              onChange={(e) => setFormData(prev => ({ ...prev, seo_text_kz: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              placeholder="<h2>Тақырып</h2><p>Мәтін...</p>"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Настройки</h2>

          <Input
            id="sort_order"
            label="Порядок сортировки"
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: Number(e.target.value) }))}
          />

          <Checkbox
            id="is_active"
            label="Активна (показывать на сайте)"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
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
