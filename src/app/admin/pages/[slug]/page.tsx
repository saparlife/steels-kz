'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PageData {
  id: string
  slug: string
  title_ru: string
  title_kz: string | null
  content_ru: string | null
  content_kz: string | null
  meta_title_ru: string | null
  meta_title_kz: string | null
  meta_description_ru: string | null
  meta_description_kz: string | null
}

const SLUG_LABELS: Record<string, string> = {
  home: 'Главная страница',
  katalog: 'Каталог продукции',
}

export default function EditPagePage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<PageData | null>(null)

  useEffect(() => {
    fetch(`/api/admin/pages/${params.slug}`)
      .then(res => res.json())
      .then(data => {
        setFormData(data.page)
        setIsFetching(false)
      })
  }, [params.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const res = await fetch(`/api/admin/pages/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка сохранения')
        return
      }

      setSuccess('Сохранено успешно')
      setTimeout(() => setSuccess(''), 3000)
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
    return <div className="text-center py-12 text-red-500">Страница не найдена</div>
  }

  const pageLabel = SLUG_LABELS[formData.slug] || formData.title_ru

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Редактировать: {pageLabel}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">SEO мета-теги</h2>

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
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">SEO текст</h2>
          <p className="text-sm text-gray-500">
            HTML-контент для SEO, отображается внизу страницы. Поддерживает теги: h1-h6, p, ul, ol, li, a, strong, em, table и др.
          </p>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Контент (RU)</h3>
            <textarea
              id="content_ru"
              rows={12}
              value={formData.content_ru || ''}
              onChange={(e) => setFormData(prev => prev ? { ...prev, content_ru: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              placeholder="<h2>Заголовок</h2><p>Текст...</p>"
            />
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">Контент (KZ)</h3>
            <textarea
              id="content_kz"
              rows={12}
              value={formData.content_kz || ''}
              onChange={(e) => setFormData(prev => prev ? { ...prev, content_kz: e.target.value } : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              placeholder="<h2>Тақырып</h2><p>Мәтін...</p>"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Сохранить
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push('/admin/pages')}>
            Назад
          </Button>
        </div>
      </form>
    </div>
  )
}
