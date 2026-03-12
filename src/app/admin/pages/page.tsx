'use client'

import { Edit2, FileText } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface PageItem {
  id: string
  slug: string
  title_ru: string
  meta_title_ru: string | null
  meta_description_ru: string | null
  content_ru: string | null
  is_active: boolean
}

const SLUG_LABELS: Record<string, string> = {
  home: 'Главная страница',
  katalog: 'Каталог продукции',
}

const SLUG_URLS: Record<string, string> = {
  home: '/',
  katalog: '/katalog',
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/pages')
      .then(res => res.json())
      .then(data => {
        setPages(data.pages || [])
        setIsLoading(false)
      })
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Страницы</h1>
          <p className="text-gray-600 mt-1">Управление SEO и контентом статических страниц</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Загрузка...</div>
      ) : pages.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Нет страниц</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Статические страницы не найдены. Выполните миграцию базы данных.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Страница</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Meta Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SEO текст</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {SLUG_LABELS[page.slug] || page.title_ru}
                    </div>
                    <div className="text-sm text-gray-500">{page.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {SLUG_URLS[page.slug] || `/${page.slug}`}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {page.meta_title_ru ? (
                      <span className="text-green-600">Заполнен</span>
                    ) : (
                      <span className="text-red-500">Не заполнен</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {page.content_ru ? (
                      <span className="text-green-600">Есть</span>
                    ) : (
                      <span className="text-gray-400">Нет</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/pages/${page.slug}`}
                      className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
