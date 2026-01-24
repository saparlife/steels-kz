'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewSteelGradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    slug: '',
    name: '',
    description_ru: '',
    applications_ru: '',
    chemical_composition: '',
    mechanical_properties: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let chemical = null
      let mechanical = null

      try {
        if (form.chemical_composition) chemical = JSON.parse(form.chemical_composition)
      } catch {
        alert('Неверный формат JSON для химического состава')
        setLoading(false)
        return
      }

      try {
        if (form.mechanical_properties) mechanical = JSON.parse(form.mechanical_properties)
      } catch {
        alert('Неверный формат JSON для механических свойств')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/steel-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          chemical_composition: chemical,
          mechanical_properties: mechanical,
        }),
      })

      if (response.ok) {
        router.push('/admin/steel-grades')
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

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/steel-grades" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Новая марка стали</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Марка *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })
              }}
              placeholder="Ст3сп, 09Г2С, 12Х18Н10Т..."
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
            Описание
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
            Применение
          </label>
          <textarea
            rows={3}
            value={form.applications_ru}
            onChange={(e) => setForm({ ...form, applications_ru: e.target.value })}
            placeholder="Для каких изделий и конструкций применяется"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Химический состав (JSON)
          </label>
          <textarea
            rows={4}
            value={form.chemical_composition}
            onChange={(e) => setForm({ ...form, chemical_composition: e.target.value })}
            placeholder='{"C": "0.14-0.22", "Mn": "0.40-0.65", "Si": "0.05-0.17"}'
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Механические свойства (JSON)
          </label>
          <textarea
            rows={4}
            value={form.mechanical_properties}
            onChange={(e) => setForm({ ...form, mechanical_properties: e.target.value })}
            placeholder='{"yield_strength": "245 МПа", "tensile_strength": "370-480 МПа"}'
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
          />
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href="/admin/steel-grades" className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
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
