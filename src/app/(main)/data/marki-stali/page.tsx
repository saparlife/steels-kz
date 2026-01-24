import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { createClient } from '@/lib/supabase/server'
import type { SteelGrade } from '@/types/database'
import { Scale, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Марки стали - Справочник характеристик',
  description: 'Справочник марок стали: химический состав, механические свойства, область применения. Подбор марки стали для ваших задач.',
}

export default async function SteelGradesPage() {
  const supabase = await createClient()

  const { data: grades } = await supabase
    .from('steel_grades')
    .select(`
      *,
      gost:gost_standards(number, slug)
    `)
    .eq('is_active', true)
    .order('name', { ascending: true }) as { data: (SteelGrade & { gost: { number: string; slug: string } | null })[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Справочник', href: '/data' },
              { label: 'Марки стали' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Марки стали
            </h1>
            <TLDRBlock
              content="Справочник характеристик марок стали. Химический состав, механические свойства, область применения. Поможет подобрать нужную марку для ваших задач."
            />
          </div>

          {!grades?.length ? (
            <div className="text-center py-16">
              <Scale className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Справочник марок стали наполняется
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grades.map((grade) => (
                <Link
                  key={grade.id}
                  href={`/data/marki-stali/${grade.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                      {grade.name}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </div>

                  {grade.gost && (
                    <p className="text-sm text-blue-600 mb-2">
                      ГОСТ {grade.gost.number}
                    </p>
                  )}

                  {grade.description_ru && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {grade.description_ru}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
