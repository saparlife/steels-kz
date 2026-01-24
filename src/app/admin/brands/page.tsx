'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Award, Plus, Search, Pencil, Trash2 } from 'lucide-react'
import type { Brand } from '@/types/database'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    try {
      const res = await fetch('/api/admin/brands')
      const data = await res.json()
      setBrands(data.data || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBrands = brands.filter((brand) =>
    brand.name_ru.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Бренды</h1>
        </div>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить бренд
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск брендов..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : filteredBrands.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {search ? 'Бренды не найдены' : 'Нет брендов'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Название
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Slug
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
              {filteredBrands.map((brand) => (
                <tr key={brand.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{brand.name_ru}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{brand.slug}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {brand.products_count}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        brand.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {brand.is_active ? 'Активен' : 'Неактивен'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/brands/${brand.id}`}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => {
                          // Delete handler
                        }}
                      >
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
