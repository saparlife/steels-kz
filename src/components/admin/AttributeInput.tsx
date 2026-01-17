'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

interface AttributeInputProps {
  attribute: {
    id: string
    name_ru: string
    type: string
    unit: string | null
    options: string[] | null
    is_required: boolean
  }
  value: string
  onChange: (value: string) => void
  onOptionsUpdate?: (newOptions: string[]) => void
}

export function AttributeInput({ attribute, value, onChange, onOptionsUpdate }: AttributeInputProps) {
  const [showAddOption, setShowAddOption] = useState(false)
  const [newOption, setNewOption] = useState('')
  const [isAddingOption, setIsAddingOption] = useState(false)
  const [error, setError] = useState('')

  const handleAddOption = async () => {
    if (!newOption.trim()) return

    setIsAddingOption(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/attributes/${attribute.id}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option: newOption.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ошибка добавления')
        return
      }

      // Update local options
      if (onOptionsUpdate) {
        onOptionsUpdate(data.options)
      }

      // Select the new option
      onChange(newOption.trim())
      setNewOption('')
      setShowAddOption(false)
    } catch {
      setError('Ошибка сети')
    } finally {
      setIsAddingOption(false)
    }
  }

  // Number type
  if (attribute.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {attribute.name_ru}
          {attribute.is_required && <span className="text-red-500"> *</span>}
          {attribute.unit && <span className="text-gray-400"> ({attribute.unit})</span>}
        </label>
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          required={attribute.is_required}
          placeholder={`Введите число${attribute.unit ? ` в ${attribute.unit}` : ''}`}
        />
      </div>
    )
  }

  // Select type
  if (attribute.type === 'select') {
    const options = attribute.options || []

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {attribute.name_ru}
          {attribute.is_required && <span className="text-red-500"> *</span>}
        </label>

        <div className="flex gap-2">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required={attribute.is_required}
          >
            <option value="">Выберите...</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowAddOption(!showAddOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            title="Добавить значение"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showAddOption && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                placeholder="Новое значение..."
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                type="button"
                onClick={handleAddOption}
                disabled={isAddingOption || !newOption.trim()}
                className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {isAddingOption ? '...' : 'Добавить'}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            {options.length === 0 && (
              <p className="text-gray-500 text-xs mt-2">
                Список пуст. Добавьте первое значение.
              </p>
            )}
          </div>
        )}
      </div>
    )
  }

  // Text type (default)
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {attribute.name_ru}
        {attribute.is_required && <span className="text-red-500"> *</span>}
        {attribute.unit && <span className="text-gray-400"> ({attribute.unit})</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        required={attribute.is_required}
      />
    </div>
  )
}
