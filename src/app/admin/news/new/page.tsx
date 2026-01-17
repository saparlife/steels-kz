'use client'

import { ImageUpload } from '@/components/admin/ImageUpload'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// Transliteration map
const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  ' ': '-', '/': '-', '.': '', ',': '', '(': '', ')': '', '№': 'n',
  'ә': 'a', 'і': 'i', 'ң': 'n', 'ғ': 'g', 'ү': 'u', 'ұ': 'u', 'қ': 'k',
  'ө': 'o', 'һ': 'h'
}

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] ?? char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200)
}

export default function NewNewsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

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
    published_at: new Date().toISOString().slice(0, 16),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          published_at: new Date(formData.published_at).toISOString(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка создания новости')
        return
      }

      router.push('/admin/news')
      router.refresh()
    } catch {
      setError('Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/news"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к новостям
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Добавить новость</h1>

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
              onChange={(e) => {
                const title = e.target.value
                setFormData({
                  ...formData,
                  title_ru: title,
                  slug: slugManuallyEdited ? formData.slug : transliterate(title),
                })
              }}
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
              onChange={(e) => {
                setSlugManuallyEdited(true)
                setFormData({ ...formData, slug: e.target.value })
              }}
              placeholder="Авто-генерация из заголовка"
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
                placeholder="Отображается в списке новостей"
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
                placeholder="Авто-генерация из заголовка"
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
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Создать новость
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
