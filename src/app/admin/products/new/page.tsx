'use client'

import { AttributeInput } from '@/components/admin/AttributeInput'
import { MultiImageUpload } from '@/components/admin/MultiImageUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Category } from '@/types/database'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface ProductImage {
  id?: string
  url: string
  alt_ru?: string
  sort_order: number
  is_primary: boolean
}

interface CategoryAttribute {
  id: string
  name_ru: string
  name_kz: string
  slug: string
  type: string
  unit: string | null
  options: string[] | null
  is_required: boolean
  sort_order: number
}

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([])
  const [loadingAttributes, setLoadingAttributes] = useState(false)

  const [formData, setFormData] = useState({
    name_ru: '',
    name_kz: '',
    slug: '',
    description_ru: '',
    description_kz: '',
    category_id: '',
    sku: '',
    price: '',
    is_active: true,
    meta_title_ru: '',
    meta_description_ru: '',
  })

  const [attributeValues, setAttributeValues] = useState<Record<string, string>>({})
  const [images, setImages] = useState<ProductImage[]>([])

  // Load categories on mount
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        const cats = data?.categories || data
        setCategories(Array.isArray(cats) ? cats : [])
      })
      .catch(console.error)
  }, [])

  // Load attributes when category changes
  useEffect(() => {
    if (!formData.category_id) {
      setCategoryAttributes([])
      return
    }

    setLoadingAttributes(true)
    fetch(`/api/admin/categories/${formData.category_id}/attributes`)
      .then((res) => res.json())
      .then((data) => {
        setCategoryAttributes(Array.isArray(data) ? data : [])
        setAttributeValues({})
      })
      .catch(console.error)
      .finally(() => setLoadingAttributes(false))
  }, [formData.category_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate required attributes
    for (const attr of categoryAttributes) {
      if (attr.is_required && !attributeValues[attr.id]) {
        setError(`Заполните обязательное поле: ${attr.name_ru}`)
        return
      }
      // Validate number type
      if (attr.type === 'number' && attributeValues[attr.id]) {
        const num = parseFloat(attributeValues[attr.id])
        if (isNaN(num)) {
          setError(`${attr.name_ru} должно быть числом`)
          return
        }
      }
    }

    setIsLoading(true)

    try {
      const attributes = Object.entries(attributeValues)
        .filter(([_, value]) => value)
        .map(([attributeId, value]) => {
          const attr = categoryAttributes.find((a) => a.id === attributeId)
          const isNumber = attr?.type === 'number'
          return {
            attribute_id: attributeId,
            value_text: isNumber ? null : value,
            value_number: isNumber ? parseFloat(value) : null,
          }
        })

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.price || null,
          attributes,
          images,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка создания товара')
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAttributeOptionsUpdate = (attrId: string, newOptions: string[]) => {
    setCategoryAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attrId ? { ...attr, options: newOptions } : attr
      )
    )
  }

  // Build category tree for select
  const buildCategoryOptions = (cats: Category[]): React.JSX.Element[] => {
    if (!Array.isArray(cats)) return []
    const result: React.JSX.Element[] = []
    const rootCats = cats.filter((c) => !c.parent_id)

    const addWithChildren = (cat: Category, depth: number) => {
      result.push(
        <option key={cat.id} value={cat.id}>
          {'—'.repeat(depth)} {cat.name_ru}
        </option>
      )
      const children = cats.filter((c) => c.parent_id === cat.id)
      children.forEach((child) => addWithChildren(child, depth + 1))
    }

    rootCats.forEach((cat) => addWithChildren(cat, 0))

    if (result.length === 0) {
      cats.forEach((cat) => {
        result.push(
          <option key={cat.id} value={cat.id}>
            {'—'.repeat(cat.level)} {cat.name_ru}
          </option>
        )
      })
    }

    return result
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к товарам
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Добавить товар</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Название (RU) *"
              value={formData.name_ru}
              onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
              required
            />
            <Input
              label="Название (KZ)"
              value={formData.name_kz}
              onChange={(e) => setFormData({ ...formData, name_kz: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Выберите категорию</option>
                {buildCategoryOptions(categories)}
              </select>
            </div>
            <Input
              label="Артикул (SKU)"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Цена (₸)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Оставьте пустым для 'По запросу'"
            />
            <Input
              label="URL (slug)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="Авто-генерация из названия"
            />
          </div>

          {/* Product images */}
          <div className="border-t pt-6">
            <MultiImageUpload
              images={images}
              onChange={setImages}
              folder="products"
              maxImages={10}
            />
          </div>

          {/* Dynamic attributes based on category */}
          {formData.category_id && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Характеристики</h2>
              {loadingAttributes ? (
                <p className="text-gray-500">Загрузка характеристик...</p>
              ) : categoryAttributes.length === 0 ? (
                <p className="text-gray-500">
                  Для этой категории не настроены характеристики.{' '}
                  <Link
                    href={`/admin/categories/${formData.category_id}`}
                    className="text-orange-500 hover:underline"
                  >
                    Настроить
                  </Link>
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryAttributes.map((attr) => (
                    <AttributeInput
                      key={attr.id}
                      attribute={attr}
                      value={attributeValues[attr.id] || ''}
                      onChange={(value) =>
                        setAttributeValues({ ...attributeValues, [attr.id]: value })
                      }
                      onOptionsUpdate={(newOptions) =>
                        handleAttributeOptionsUpdate(attr.id, newOptions)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание (RU)
            </label>
            <textarea
              value={formData.description_ru}
              onChange={(e) => setFormData({ ...formData, description_ru: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* SEO */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">SEO</h2>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={formData.meta_title_ru}
                onChange={(e) => setFormData({ ...formData, meta_title_ru: e.target.value })}
                placeholder="Авто-генерация из названия"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description_ru}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_description_ru: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Активен (отображается на сайте)
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Создать товар
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="secondary">
                Отмена
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
