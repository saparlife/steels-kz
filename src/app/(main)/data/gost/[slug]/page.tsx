import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import type { GostStandard } from '@/types/database'
import { FileText, Download, ExternalLink } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gost } = await supabase
    .from('gost_standards')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: GostStandard | null }

  if (!gost) {
    return { title: 'ГОСТ не найден' }
  }

  return {
    title: gost.meta_title_ru || `ГОСТ ${gost.number} - ${gost.title_ru}`,
    description: gost.meta_description_ru || gost.description_ru || `ГОСТ ${gost.number}. Полный текст стандарта и требования.`,
  }
}

export default async function GostDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: gost } = await supabase
    .from('gost_standards')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: GostStandard | null }

  if (!gost) {
    notFound()
  }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Справочник', href: '/data' },
              { label: 'ГОСТ', href: '/data/gost' },
              { label: `ГОСТ ${gost.number}` },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    ГОСТ {gost.number}
                  </h1>
                  <p className="text-lg text-gray-600">{gost.title_ru}</p>
                </div>
              </div>

              {gost.description_ru && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
                  <p className="text-blue-800">{gost.description_ru}</p>
                </div>
              )}

              {gost.content_ru && (
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: gost.content_ru }} />
                </div>
              )}

              {!gost.content_ru && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Полный текст стандарта в разработке
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4">Документ</h3>

                {gost.document_url && (
                  <a
                    href={gost.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4"
                  >
                    <Download className="w-5 h-5" />
                    Скачать PDF
                  </a>
                )}

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-500">Номер стандарта:</span>
                    <p className="font-medium text-gray-900">ГОСТ {gost.number}</p>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <Link
                      href="/data/gost"
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      &larr; Все стандарты ГОСТ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна продукция по этому ГОСТ?"
        description="Мы поставляем металлопрокат, соответствующий всем требованиям стандартов"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
