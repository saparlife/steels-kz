'use client'

import { ImageUpload } from '@/components/admin/ImageUpload'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Plus, Trash2 } from 'lucide-react'
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
  image_url: string | null
  icon_url: string | null
  sort_order: number
  is_active: boolean
}

interface ParentCategory {
  id: string
  name_ru: string
  level: number
}

interface AttributeDefinition {
  id: string
  name_ru: string
  type: string
  unit: string | null
}

interface CategoryAttribute {
  attribute_id: string
  is_required: boolean
  sort_order: number
}

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const [parentCategories, setParentCategories] = useState<ParentCategory[]>([])
  const [formData, setFormData] = useState<Category | null>(null)

  // Attributes
  const [allAttributes, setAllAttributes] = useState<AttributeDefinition[]>([])
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([])
  const [selectedAttrId, setSelectedAttrId] = useState('')

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/categories/${params.id}`).then(res => res.json()),
      fetch('/api/admin/categories').then(res => res.json()),
      fetch('/api/admin/attributes').then(res => res.json()),
      fetch(`/api/admin/categories/${params.id}/attributes`).then(res => res.json()),
    ]).then(([categoryData, categoriesData, attributesData, catAttrsData]) => {
      setFormData(categoryData.category)
      setParentCategories(
        (categoriesData.categories || []).filter((cat: ParentCategory) => cat.id !== params.id)
      )
      setAllAttributes(Array.isArray(attributesData) ? attributesData : [])
      // Convert category attributes to our format
      const catAttrs = Array.isArray(catAttrsData) ? catAttrsData.map((a: { id: string; is_required?: boolean; sort_order?: number }) => ({
        attribute_id: a.id,
        is_required: a.is_required || false,
        sort_order: a.sort_order || 0,
      })) : []
      setCategoryAttributes(catAttrs)
      setIsFetching(false)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setError('')
    setIsLoading(true)

    try {
      // Save category
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

      // Save category attributes
      await fetch(`/api/admin/categories/${params.id}/attributes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes: categoryAttributes }),
      })

      router.push('/admin/categories')
      router.refresh()
    } catch {
      setError('Произошла ошибка. Попробуйте снова.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddAttribute = () => {
    if (!selectedAttrId) return
    if (categoryAttributes.some(a => a.attribute_id === selectedAttrId)) return

    setCategoryAttributes([
      ...categoryAttributes,
      {
        attribute_id: selectedAttrId,
        is_required: false,
        sort_order: categoryAttributes.length,
      },
    ])
    setSelectedAttrId('')
  }

  const handleRemoveAttribute = (attrId: string) => {
    setCategoryAttributes(categoryAttributes.filter(a => a.attribute_id !== attrId))
  }

  const handleToggleRequired = (attrId: string) => {
    setCategoryAttributes(categoryAttributes.map(a =>
      a.attribute_id === attrId ? { ...a, is_required: !a.is_required } : a
    ))
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

  // Attributes not yet added to category
  const availableAttributes = allAttributes.filter(
    a => !categoryAttributes.some(ca => ca.attribute_id === a.id)
  )

  // Get full attribute info for display
  const getAttributeInfo = (attrId: string) => {
    return allAttributes.find(a => a.id === attrId)
  }

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData(prev => prev ? { ...prev, image_url: url } : null)}
              folder="categories"
              label="Изображение категории"
            />
            <ImageUpload
              value={formData.icon_url}
              onChange={(url) => setFormData(prev => prev ? { ...prev, icon_url: url } : null)}
              folder="categories/icons"
              label="Иконка категории"
            />
          </div>
        </div>

        {/* Attributes section */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            Атрибуты (Характеристики товаров)
          </h2>
          <p className="text-sm text-gray-500">
            Эти атрибуты будут доступны для товаров в этой категории и использоваться в фильтрах
          </p>

          {/* Add attribute */}
          <div className="flex gap-2">
            <select
              value={selectedAttrId}
              onChange={(e) => setSelectedAttrId(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Выберите атрибут для добавления...</option>
              {availableAttributes.map(attr => (
                <option key={attr.id} value={attr.id}>
                  {attr.name_ru} {attr.unit && `(${attr.unit})`}
                </option>
              ))}
            </select>
            <Button type="button" variant="secondary" onClick={handleAddAttribute} disabled={!selectedAttrId}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Linked attributes */}
          {categoryAttributes.length > 0 ? (
            <div className="space-y-2">
              {categoryAttributes.map((catAttr, index) => {
                const attr = getAttributeInfo(catAttr.attribute_id)
                if (!attr) return null
                return (
                  <div
                    key={catAttr.attribute_id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-400 font-mono text-sm w-6">{index + 1}</span>
                    <div className="flex-1">
                      <span className="font-medium">{attr.name_ru}</span>
                      {attr.unit && <span className="text-gray-500 ml-1">({attr.unit})</span>}
                      <span className="text-xs text-gray-400 ml-2">{attr.type}</span>
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={catAttr.is_required}
                        onChange={() => handleToggleRequired(catAttr.attribute_id)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                      Обязательный
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(catAttr.attribute_id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">
              Атрибуты не добавлены. Добавьте атрибуты для фильтрации товаров.
            </p>
          )}
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
