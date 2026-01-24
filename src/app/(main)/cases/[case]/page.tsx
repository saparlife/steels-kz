import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CTABlock } from '@/components/blocks/CTABlock'
import { ArticleSchema } from '@/components/seo/ArticleSchema'
import { createClient } from '@/lib/supabase/server'
import { Building2, Calendar, ArrowLeft } from 'lucide-react'
import type { Case } from '@/types/database'

interface Props {
  params: Promise<{ case: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { case: slug } = await params
  const supabase = await createClient()

  const { data: caseItem } = await supabase
    .from('cases')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Case>()

  if (!caseItem) {
    return { title: 'Кейс не найден' }
  }

  return {
    title: caseItem.meta_title_ru || caseItem.title_ru,
    description: caseItem.meta_description_ru || caseItem.excerpt_ru,
  }
}

export default async function CaseDetailPage({ params }: Props) {
  const { case: slug } = await params
  const supabase = await createClient()

  const { data: caseItem } = await supabase
    .from('cases')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Case>()

  if (!caseItem) {
    notFound()
  }

  return (
    <div>
      <ArticleSchema
        headline={caseItem.title_ru}
        description={caseItem.excerpt_ru || undefined}
        image={caseItem.image_url || undefined}
        url={`https://steels.kz/cases/${caseItem.slug}`}
        datePublished={caseItem.published_at}
      />

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Кейсы', href: '/cases' },
              { label: caseItem.title_ru },
            ]}
          />
        </div>
      </div>

      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              {caseItem.industry && (
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full mb-4">
                  {caseItem.industry}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {caseItem.title_ru}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                {caseItem.client_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Клиент: {caseItem.client_name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(caseItem.published_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                  })}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {caseItem.image_url && (
              <div className="aspect-video relative rounded-xl overflow-hidden mb-8">
                <Image
                  src={caseItem.image_url}
                  alt={caseItem.title_ru}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Excerpt */}
            {caseItem.excerpt_ru && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-lg text-gray-700">{caseItem.excerpt_ru}</p>
              </div>
            )}

            {/* Content */}
            {caseItem.content_ru ? (
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: caseItem.content_ru }}
              />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">Полное описание кейса в разработке</p>
              </div>
            )}

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/cases"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                <ArrowLeft className="w-4 h-4" />
                Все кейсы
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CTABlock
        title="Хотите стать нашим следующим кейсом?"
        description="Расскажите о вашем проекте, и мы подготовим индивидуальное предложение"
        primaryButton={{ text: 'Обсудить проект', href: '/dlya-biznesa' }}
        secondaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
      />
    </div>
  )
}
