'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileCheck, Plus, Edit } from 'lucide-react'

interface Gost {
  id: string
  slug: string
  number: string
  title_ru: string
  is_active: boolean
}

export default function AdminGostPage() {
  const [items, setItems] = useState<Gost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/gost')
      const result = await response.json()
      if (result.data) {
        setItems(result.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileCheck className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Справочник ГОСТ</h1>
          <span className="px-2 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">{items.length}</span>
        </div>
        <Link href="/admin/gost/new" className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
          <Plus className="w-4 h-4" />
          Добавить ГОСТ
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center">
            <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет записей ГОСТ</h3>
            <p className="text-gray-500 mb-6">Добавьте стандарты ГОСТ в справочник</p>
            <Link href="/admin/gost/new" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
              <Plus className="w-4 h-4" />
              Добавить ГОСТ
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Номер</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Название</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Статус</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.title_ru}</td>
                  <td className="px-4 py-3">
                    {item.is_active ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Активен</span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">Скрыт</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/gost/${item.id}`} className="p-2 text-gray-500 hover:text-orange-500">
                      <Edit className="w-4 h-4 inline" />
                    </Link>
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
