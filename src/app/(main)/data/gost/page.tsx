import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { createClient } from '@/lib/supabase/server'
import type { GostStandard } from '@/types/database'
import { FileText, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ГОСТ на металлопрокат - Справочник стандартов',
  description: 'Справочник ГОСТ на металлопрокат. Государственные стандарты на арматуру, трубы, листовой прокат. Требования к качеству и характеристикам.',
}

export default async function GostPage() {
  const supabase = await createClient()

  const { data: gosts } = await supabase
    .from('gost_standards')
    .select('*')
    .eq('is_active', true)
    .order('number', { ascending: true }) as { data: GostStandard[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Справочник', href: '/data' },
              { label: 'ГОСТ' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Справочник ГОСТ
            </h1>
            <TLDRBlock
              content="Государственные стандарты (ГОСТ) устанавливают требования к качеству, размерам и характеристикам металлопроката. Вся продукция на нашем складе соответствует требованиям ГОСТ."
            />
          </div>

          {!gosts?.length ? (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Справочник ГОСТ наполняется
              </h2>
              <p className="text-gray-600 mb-6">
                Мы работаем над добавлением справочной информации
              </p>
              <Link
                href="/katalog"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {gosts.map((gost) => (
                <Link
                  key={gost.id}
                  href={`/data/gost/${gost.slug}`}
                  className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                        ГОСТ {gost.number}
                      </h2>
                      <p className="text-gray-600">{gost.title_ru}</p>
                      {gost.description_ru && (
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                          {gost.description_ru}
                        </p>
                      )}
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
