'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Factory, Plus, Search, Pencil, Trash2 } from 'lucide-react'
import type { Manufacturer } from '@/types/database'

export default function AdminManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchManufacturers()
  }, [])

  async function fetchManufacturers() {
    try {
      const res = await fetch('/api/admin/manufacturers')
      const data = await res.json()
      setManufacturers(data.data || [])
    } catch (error) {
      console.error('Error fetching manufacturers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredManufacturers = manufacturers.filter((m) =>
    m.name_ru.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Factory className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Производители</h1>
        </div>
        <Link
          href="/admin/manufacturers/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить производителя
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск производителей..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filteredManufacturers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'Производители не найдены' : 'Нет производителей'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Название
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Страна
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Товаров
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Статус
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredManufacturers.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{m.name_ru}</div>
                    <div className="text-sm text-gray-500">{m.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {m.country || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {m.products_count}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        m.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {m.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/manufacturers/${m.id}`}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
