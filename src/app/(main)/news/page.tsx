import { createServiceClient } from '@/lib/supabase/server'
import type { News } from '@/types/database'
import { Calendar, ChevronRight, Newspaper } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Новости - Темир Сервис Казахстан',
  description: 'Новости компании Темир Сервис. Актуальная информация о ценах на металлопрокат, акциях и событиях.',
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const supabase = await createServiceClient()
  const page = Number(params.page) || 1
  const perPage = 10

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  const { data, count } = await supabase
    .from('news')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('published_at', { ascending: false })
    .range(from, to)

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
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-orange-500">Новости</span> компании
            </h1>
            <p className="text-xl text-gray-300">
              Актуальная информация о ценах, акциях и событиях компании Темир Сервис
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content */}
            <div className="flex-1">
              {news.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Новостей пока нет
                  </h2>
                  <p className="text-gray-500">
                    Следите за обновлениями - скоро здесь появятся новости компании
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {news.map((item) => (
                    <article
                      key={item.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        {item.image_url && (
                          <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                            <Image
                              src={item.image_url}
                              alt={item.title_ru}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="p-6 flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.published_at)}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-orange-500 transition-colors">
                            <Link href={`/news/${item.slug}`}>{item.title_ru}</Link>
                          </h2>
                          {item.excerpt_ru && (
                            <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt_ru}</p>
                          )}
                          <Link
                            href={`/news/${item.slug}`}
                            className="inline-flex items-center text-orange-500 font-medium hover:text-orange-600"
                          >
                            Читать далее
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {page > 1 && (
                    <Link
                      href={`/news?page=${page - 1}`}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Назад
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/news?page=${p}`}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        p === page
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/news?page=${page + 1}`}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                      Вперед
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-24">
                <div className="bg-orange-500 rounded-xl p-6 text-white">
                  <h3 className="font-semibold mb-2">Подпишитесь на рассылку</h3>
                  <p className="text-sm text-orange-100 mb-4">
                    Получайте актуальные новости и специальные предложения
                  </p>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3"
                  />
                  <button className="w-full px-4 py-2 bg-white text-orange-500 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Подписаться
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
