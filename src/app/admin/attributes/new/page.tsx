'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewAttributePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name_ru: '',
    name_kz: '',
    slug: '',
    type: 'text',
    unit: '',
  })

  const [options, setOptions] = useState<string[]>([])
  const [newOption, setNewOption] = useState('')

  const handleAddOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()])
      setNewOption('')
    }
  }

  const handleRemoveOption = (opt: string) => {
    setOptions(options.filter((o) => o !== opt))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          options: formData.type === 'select' ? options : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка создания')
        return
      }

      router.push('/admin/attributes')
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
          href="/admin/attributes"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к атрибутам
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Добавить атрибут
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <Input
            label="Название (RU) *"
            value={formData.name_ru}
            onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
            placeholder="Например: Диаметр"
            required
          />

          <Input
            label="Название (KZ)"
            value={formData.name_kz}
            onChange={(e) => setFormData({ ...formData, name_kz: e.target.value })}
            placeholder="Например: Диаметрі"
          />

          <Input
            label="Slug (URL)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="Авто-генерация из названия"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип данных *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="text">Текст (свободный ввод)</option>
              <option value="number">Число (для фильтра-диапазона)</option>
              <option value="select">Выбор из списка (для фильтра-чекбоксов)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              {formData.type === 'number' && 'Числовые значения позволяют фильтровать по диапазону'}
              {formData.type === 'select' && 'Добавьте варианты значений ниже'}
              {formData.type === 'text' && 'Текстовые значения для свободного ввода'}
            </p>
          </div>

          <Input
            label="Единица измерения"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="Например: мм, кг, м"
          />

          {/* Options for select type */}
          {formData.type === 'select' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Варианты значений
              </label>

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  placeholder="Добавить вариант..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <Button type="button" variant="secondary" onClick={handleAddOption}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {options.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <span
                      key={opt}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {opt}
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Добавьте варианты значений для выбора
                </p>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Создать атрибут
            </Button>
            <Link href="/admin/attributes">
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
