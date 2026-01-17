'use client'

import { ImageUpload } from '@/components/admin/ImageUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditNewsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title_ru: '',
    title_kz: '',
    slug: '',
    excerpt_ru: '',
    excerpt_kz: '',
    content_ru: '',
    content_kz: '',
    image_url: null as string | null,
    meta_title_ru: '',
    meta_title_kz: '',
    meta_description_ru: '',
    meta_description_kz: '',
    is_active: true,
    published_at: '',
  })

  // Load news data
  useEffect(() => {
    fetch(`/api/admin/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
          return
        }
        setFormData({
          title_ru: data.title_ru || '',
          title_kz: data.title_kz || '',
          slug: data.slug || '',
          excerpt_ru: data.excerpt_ru || '',
          excerpt_kz: data.excerpt_kz || '',
          content_ru: data.content_ru || '',
          content_kz: data.content_kz || '',
          image_url: data.image_url,
          meta_title_ru: data.meta_title_ru || '',
          meta_title_kz: data.meta_title_kz || '',
          meta_description_ru: data.meta_description_ru || '',
          meta_description_kz: data.meta_description_kz || '',
          is_active: data.is_active,
          published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения')
        return
      }

      router.push('/admin/news')
      router.refresh()
    } catch {
      setError('Произошла ошибка')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Удалить эту новость? Это действие нельзя отменить.')) return

    const res = await fetch(`/api/admin/news/${id}`, {
      method: 'DELETE',
    })

    if (res.ok) {
      router.push('/admin/news')
      router.refresh()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/news"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к новостям
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Удалить
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Редактировать новость</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Заголовок (RU) *"
              value={formData.title_ru}
              onChange={(e) => setFormData({ ...formData, title_ru: e.target.value })}
              required
            />
            <Input
              label="Заголовок (KZ)"
              value={formData.title_kz}
              onChange={(e) => setFormData({ ...formData, title_kz: e.target.value })}
            />
          </div>

          {/* Slug and date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="URL (slug)"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <Input
              label="Дата публикации"
              type="datetime-local"
              value={formData.published_at}
              onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
            />
          </div>

          {/* Image */}
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            folder="news"
            label="Изображение новости"
          />

          {/* Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Краткое описание (RU)
              </label>
              <textarea
                value={formData.excerpt_ru}
                onChange={(e) => setFormData({ ...formData, excerpt_ru: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Краткое описание (KZ)
              </label>
              <textarea
                value={formData.excerpt_kz}
                onChange={(e) => setFormData({ ...formData, excerpt_kz: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Полный текст новости (RU)
            </label>
            <textarea
              value={formData.content_ru}
              onChange={(e) => setFormData({ ...formData, content_ru: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Полный текст новости (KZ)
            </label>
            <textarea
              value={formData.content_kz}
              onChange={(e) => setFormData({ ...formData, content_kz: e.target.value })}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* SEO */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">SEO</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Meta Title (RU)"
                value={formData.meta_title_ru}
                onChange={(e) => setFormData({ ...formData, meta_title_ru: e.target.value })}
              />
              <Input
                label="Meta Title (KZ)"
                value={formData.meta_title_kz}
                onChange={(e) => setFormData({ ...formData, meta_title_kz: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (RU)
                </label>
                <textarea
                  value={formData.meta_description_ru}
                  onChange={(e) => setFormData({ ...formData, meta_description_ru: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description (KZ)
                </label>
                <textarea
                  value={formData.meta_description_kz}
                  onChange={(e) => setFormData({ ...formData, meta_description_kz: e.target.value })}
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
              Активна (отображается на сайте)
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Сохранить
            </Button>
            <Link href="/admin/news">
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
