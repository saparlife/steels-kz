import { createServiceClient } from '@/lib/supabase/server'
import type { News } from '@/types/database'
import { ArrowLeft, Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServiceClient()

  const { data } = await supabase
    .from('news')
    .select('title_ru, meta_title_ru, meta_description_ru, excerpt_ru')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!data) {
    return {
      title: 'Новость не найдена',
    }
  }

  const news = data as Pick<News, 'title_ru' | 'meta_title_ru' | 'meta_description_ru' | 'excerpt_ru'>

  return {
    title: news.meta_title_ru || news.title_ru,
    description: news.meta_description_ru || news.excerpt_ru || '',
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServiceClient()

  const { data: news } = await supabase
    .from('news')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!news) {
    notFound()
  }

  const newsItem = news as News

  // Get related news
  const { data: relatedData } = await supabase
    .from('news')
    .select('id, slug, title_ru, published_at')
    .eq('is_active', true)
    .neq('id', newsItem.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const relatedNews = (relatedData || []) as Pick<News, 'id' | 'slug' | 'title_ru' | 'published_at'>[]

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
          <div className="max-w-4xl">
            <Link
              href="/news"
              className="inline-flex items-center text-gray-400 hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Все новости
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{newsItem.title_ru}</h1>
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(newsItem.published_at)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content */}
            <article className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {newsItem.image_url && (
                  <div className="relative h-64 md:h-96">
                    <Image
                      src={newsItem.image_url}
                      alt={newsItem.title_ru}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="p-8">
                  {newsItem.excerpt_ru && (
                    <p className="text-xl text-gray-600 mb-6 font-medium">
                      {newsItem.excerpt_ru}
                    </p>
                  )}
                  {newsItem.content_ru && (
                    <div
                      className="prose prose-lg max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: newsItem.content_ru.replace(/\n/g, '<br />'),
                      }}
                    />
                  )}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-24">
                {relatedNews.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Другие новости</h3>
                    <div className="space-y-4">
                      {relatedNews.map((item) => (
                        <Link
                          key={item.id}
                          href={`/news/${item.slug}`}
                          className="block group"
                        >
                          <h4 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                            {item.title_ru}
                          </h4>
                          <span className="text-sm text-gray-400">
                            {formatDate(item.published_at)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

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
