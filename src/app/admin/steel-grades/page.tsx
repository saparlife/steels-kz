'use client'

import Link from 'next/link'
import { Wrench, Plus } from 'lucide-react'

export default function AdminSteelGradesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wrench className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Марки стали</h1>
        </div>
        <Link
          href="/admin/steel-grades/new"
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить марку
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Нет марок стали</h3>
        <p className="text-gray-500 mb-6">
          Добавьте марки стали в справочник
        </p>
        <Link
          href="/admin/steel-grades/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Добавить марку
        </Link>
      </div>
    </div>
  )
}
