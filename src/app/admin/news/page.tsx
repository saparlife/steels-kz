import { Button } from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/server'
import type { News } from '@/types/database'
import { Calendar, ImageIcon, Newspaper, Plus, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>
}) {
  const params = await searchParams
  const supabase = await createServiceClient()
  const page = Number(params.page) || 1
  const perPage = 20
  const search = params.search || ''
  const status = params.status || ''

  // Build query
  let query = supabase
    .from('news')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })

  if (search) {
    query = query.ilike('title_ru', `%${search}%`)
  }

  if (status === 'active') {
    query = query.eq('is_active', true)
  } else if (status === 'hidden') {
    query = query.eq('is_active', false)
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.range(from, to)

  const { data, count } = await query

  const news = (data || []) as News[]
  const totalPages = Math.ceil((count || 0) / perPage)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Новости</h1>
          <p className="text-gray-600 mt-1">{count || 0} новостей</p>
        </div>
        <Link href="/admin/news/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Добавить новость
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form className="flex gap-4" method="GET">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Поиск по заголовку..."
                defaultValue={search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <select
            name="status"
            defaultValue={status}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="hidden">Скрытые</option>
          </select>
          <Button type="submit" variant="secondary">
            Найти
          </Button>
        </form>
      </div>

      {/* News table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                Фото
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Заголовок
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Дата публикации
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Статус
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {news.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Newspaper className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Новости не найдены</p>
                  <Link href="/admin/news/new" className="text-orange-500 hover:underline mt-2 inline-block">
                    Добавить первую новость
                  </Link>
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title_ru}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{item.title_ru}</div>
                    {item.excerpt_ru && (
                      <div className="text-sm text-gray-500 truncate max-w-md">
                        {item.excerpt_ru}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(item.published_at)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        item.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.is_active ? 'Активна' : 'Скрыта'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/news/${item.id}`}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Страница {page} из {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/news?page=${page - 1}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Назад
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/news?page=${page + 1}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Вперед
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
