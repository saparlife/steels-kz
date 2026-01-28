import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CTABlock } from '@/components/blocks/CTABlock'
import { ArticleSchema } from '@/components/seo/ArticleSchema'
import { createClient } from '@/lib/supabase/server'
import type { Guide } from '@/types/database'
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react'

interface Props {
  params: Promise<{ topic: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: slug } = await params
  const supabase = await createClient()

  const { data: guide } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: Guide | null }

  if (!guide) {
    return { title: 'Гайд не найден' }
  }

  return {
    title: guide.meta_title_ru || guide.title_ru,
    description: guide.meta_description_ru || guide.excerpt_ru,
  }
}

export default async function GuideDetailPage({ params }: Props) {
  const { topic: slug } = await params
  const supabase = await createClient()

  const { data: guide } = await supabase
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: Guide | null }

  if (!guide) {
    notFound()
  }

  // Get related guides
  const { data: relatedGuides } = await supabase
    .from('guides')
    .select('id, slug, title_ru, image_url')
    .eq('is_active', true)
    .neq('id', guide.id)
    .limit(3) as { data: Pick<Guide, 'id' | 'slug' | 'title_ru' | 'image_url'>[] | null }

  return (
    <div>
      <ArticleSchema
        headline={guide.title_ru}
        description={guide.excerpt_ru || undefined}
        image={guide.image_url || undefined}
        url={`https://temir-service.kz/guides/${guide.slug}`}
        datePublished={guide.published_at}
        dateModified={guide.created_at}
      />

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Гайды', href: '/guides' },
              { label: guide.title_ru },
            ]}
          />
        </div>
      </div>

      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              {guide.category && (
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full mb-4">
                  {guide.category}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {guide.title_ru}
              </h1>
              {guide.excerpt_ru && (
                <p className="text-xl text-gray-600">{guide.excerpt_ru}</p>
              )}
              <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(guide.published_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Темир Сервис
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {guide.image_url && (
              <div className="aspect-video relative rounded-xl overflow-hidden mb-8">
                <Image
                  src={guide.image_url}
                  alt={guide.title_ru}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Content */}
            {guide.content_ru ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: guide.content_ru }}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Содержание в разработке</p>
              </div>
            )}

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Все гайды
              </Link>
            </div>
          </div>

          {/* Related Guides */}
          {relatedGuides && relatedGuides.length > 0 && (
            <div className="mt-16 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Читайте также
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedGuides.map((related) => (
                  <Link
                    key={related.id}
                    href={`/guides/${related.slug}`}
                    className="group"
                  >
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {related.image_url ? (
                        <Image
                          src={related.image_url}
                          alt={related.title_ru}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                      {related.title_ru}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <CTABlock
        title="Нужна помощь в выборе металлопроката?"
        description="Наши эксперты помогут подобрать оптимальное решение"
        primaryButton={{ text: 'Получить консультацию', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
