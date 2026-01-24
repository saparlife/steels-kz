import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { createClient } from '@/lib/supabase/server'
import type { GlossaryTerm } from '@/types/database'
import { BookOpen, ArrowLeft, ArrowRight } from 'lucide-react'

interface Props {
  params: Promise<{ term: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: slug } = await params
  const supabase = await createClient()

  const { data: term } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: GlossaryTerm | null }

  if (!term) {
    return { title: 'Термин не найден' }
  }

  return {
    title: term.meta_title_ru || `${term.term_ru} - определение в металлопрокате`,
    description: term.meta_description_ru || term.definition_ru?.substring(0, 160),
  }
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term: slug } = await params
  const supabase = await createClient()

  const { data: term } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: GlossaryTerm | null }

  if (!term) {
    notFound()
  }

  // Get related terms (same first letter)
  const { data: relatedTerms } = await supabase
    .from('glossary_terms')
    .select('id, slug, term_ru')
    .eq('is_active', true)
    .ilike('term_ru', `${term.term_ru.charAt(0)}%`)
    .neq('id', term.id)
    .limit(5) as { data: Pick<GlossaryTerm, 'id' | 'slug' | 'term_ru'>[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Глоссарий', href: '/glossary' },
              { label: term.term_ru },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {term.term_ru}
                  </h1>
                  {term.term_kz && (
                    <p className="text-gray-500 mt-1">каз. {term.term_kz}</p>
                  )}
                </div>
              </div>

              <div className="prose max-w-none">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Определение</h2>
                  <p className="text-gray-700 leading-relaxed">{term.definition_ru}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Link
                  href="/glossary"
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Все термины
                </Link>
              </div>
            </div>

            <div>
              {relatedTerms && relatedTerms.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Похожие термины
                  </h3>
                  <ul className="space-y-2">
                    {relatedTerms.map((related) => (
                      <li key={related.id}>
                        <Link
                          href={`/glossary/${related.slug}`}
                          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors"
                        >
                          <ArrowRight className="w-4 h-4" />
                          {related.term_ru}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 p-6 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Нужна консультация?
                </h3>
                <p className="text-orange-800 text-sm mb-4">
                  Наши специалисты помогут разобраться в терминологии
                </p>
                <Link
                  href="/contacts"
                  className="inline-block px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Связаться с нами
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
