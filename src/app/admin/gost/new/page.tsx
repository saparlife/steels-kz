'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewGostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    slug: '',
    number: '',
    title_ru: '',
    title_kz: '',
    description_ru: '',
    content_ru: '',
    document_url: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/gost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        router.push('/admin/gost')
      } else {
        const error = await response.json()
        alert(error.message || 'Ошибка при сохранении')
      }
    } catch (error) {
      alert('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (number: string) => {
    return number.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/gost" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Новый ГОСТ</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер ГОСТ *
            </label>
            <input
              type="text"
              required
              value={form.number}
              onChange={(e) => {
                setForm({ ...form, number: e.target.value, slug: generateSlug(e.target.value) })
              }}
              placeholder="ГОСТ 8509-93"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL (slug) *
            </label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название (RU) *
          </label>
          <input
            type="text"
            required
            value={form.title_ru}
            onChange={(e) => setForm({ ...form, title_ru: e.target.value })}
            placeholder="Уголки стальные горячекатаные равнополочные"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ссылка на документ (PDF)
          </label>
          <input
            type="url"
            value={form.document_url}
            onChange={(e) => setForm({ ...form, document_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Краткое описание
          </label>
          <textarea
            rows={3}
            value={form.description_ru}
            onChange={(e) => setForm({ ...form, description_ru: e.target.value })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Полный текст / Содержание
          </label>
          <textarea
            rows={12}
            value={form.content_ru}
            onChange={(e) => setForm({ ...form, content_ru: e.target.value })}
            placeholder="Область применения, требования, таблицы размеров..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href="/admin/gost" className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            Отмена
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  )
}
