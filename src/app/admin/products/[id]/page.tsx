'use client'

import { AttributeInput } from '@/components/admin/AttributeInput'
import { MultiImageUpload } from '@/components/admin/MultiImageUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Category, Product } from '@/types/database'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
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

interface ProductWithAttributes extends Product {
  product_attributes: Array<{
    attribute_id: string
    value_text: string | null
    value_number: number | null
  }>
  product_images: ProductImage[]
}

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryAttributes, setCategoryAttributes] = useState<CategoryAttribute[]>([])
  const [loadingAttributes, setLoadingAttributes] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

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

  // Load product and categories on mount
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${productId}`).then((res) => res.json()),
      fetch('/api/admin/categories').then((res) => res.json()),
    ])
      .then(([product, catsData]: [ProductWithAttributes, { categories?: Category[] } | Category[]]) => {
        const cats = (catsData as { categories?: Category[] })?.categories || catsData
        setCategories(Array.isArray(cats) ? cats : [])
        setFormData({
          name_ru: product.name_ru || '',
          name_kz: product.name_kz || '',
          slug: product.slug || '',
          description_ru: product.description_ru || '',
          description_kz: product.description_kz || '',
          category_id: product.category_id || '',
          sku: product.sku || '',
          price: product.price?.toString() || '',
          is_active: product.is_active,
          meta_title_ru: product.meta_title_ru || '',
          meta_description_ru: product.meta_description_ru || '',
        })

        // Set attribute values
        const attrVals: Record<string, string> = {}
        product.product_attributes?.forEach((pa) => {
          attrVals[pa.attribute_id] = pa.value_text || pa.value_number?.toString() || ''
        })
        setAttributeValues(attrVals)

        // Set images
        if (product.product_images) {
          setImages(product.product_images.sort((a, b) => a.sort_order - b.sort_order))
        }
      })
      .catch(console.error)
      .finally(() => setInitialLoading(false))
  }, [productId])

  // Load attributes when category changes
  useEffect(() => {
    if (!formData.category_id) {
      setCategoryAttributes([])
      return
    }

    setLoadingAttributes(true)
    fetch(`/api/admin/categories/${formData.category_id}/attributes`)
      .then((res) => res.json())
      .then((data) => setCategoryAttributes(Array.isArray(data) ? data : []))
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

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
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
        setError(data.error || 'Ошибка сохранения')
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

  const handleDelete = async () => {
    if (!confirm('Удалить этот товар? Это действие необратимо.')) {
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Ошибка удаления')
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Произошла ошибка')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAttributeOptionsUpdate = (attrId: string, newOptions: string[]) => {
    setCategoryAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attrId ? { ...attr, options: newOptions } : attr
      )
    )
  }

  const buildCategoryOptions = (cats: Category[]): React.JSX.Element[] => {
    if (!Array.isArray(cats)) return []
    const result: React.JSX.Element[] = []

    const addWithChildren = (cat: Category, depth: number) => {
      result.push(
        <option key={cat.id} value={cat.id}>
          {'—'.repeat(depth)} {cat.name_ru}
        </option>
      )
      const children = cats.filter((c) => c.parent_id === cat.id)
      children.forEach((child) => addWithChildren(child, depth + 1))
    }

    cats.filter((c) => !c.parent_id).forEach((cat) => addWithChildren(cat, 0))

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

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к товарам
        </Link>
        <Button
          variant="secondary"
          onClick={handleDelete}
          isLoading={isDeleting}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Удалить
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Редактировать товар
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

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
              placeholder="По запросу"
            />
            <Input
              label="URL (slug)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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

          {/* Dynamic attributes */}
          {formData.category_id && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Характеристики</h2>
              {loadingAttributes ? (
                <p className="text-gray-500">Загрузка...</p>
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

          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">SEO</h2>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={formData.meta_title_ru}
                onChange={(e) => setFormData({ ...formData, meta_title_ru: e.target.value })}
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Активен
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Сохранить
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
