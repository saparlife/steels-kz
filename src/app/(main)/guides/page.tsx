import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { createClient } from '@/lib/supabase/server'
import type { Guide } from '@/types/database'
import { BookOpen, Calendar, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Гайды и руководства по металлопрокату - Темир Сервис',
  description: 'Полезные руководства по выбору и применению металлопроката. Советы экспертов, практические рекомендации.',
}

export default async function GuidesPage() {
  const supabase = await createClient()

  const { data: guides } = await supabase
    .from('guides')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false }) as { data: Guide[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Гайды' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Гайды и руководства
            </h1>
            <p className="text-lg text-gray-600">
              Полезные статьи и руководства от экспертов. Как выбрать металлопрокат,
              рассчитать количество, правильно хранить и использовать.
            </p>
          </div>

          {!guides?.length ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Гайды скоро появятся
              </h2>
              <p className="text-gray-600 mb-6">
                Мы работаем над полезными материалами для вас
              </p>
              <Link
                href="/katalog"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <Link
                  key={guide.id}
                  href={`/guides/${guide.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative bg-gray-100">
                    {guide.image_url ? (
                      <Image
                        src={guide.image_url}
                        alt={guide.title_ru}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {guide.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                        {guide.category}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {guide.title_ru}
                    </h2>
                    {guide.excerpt_ru && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {guide.excerpt_ru}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(guide.published_at).toLocaleDateString('ru-RU')}
                      </div>
                      <span className="text-orange-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Читать
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
