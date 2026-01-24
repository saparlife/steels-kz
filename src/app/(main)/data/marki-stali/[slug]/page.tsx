import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import type { SteelGrade } from '@/types/database'
import { Scale, FileText, Wrench } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: grade } = await supabase
    .from('steel_grades')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: SteelGrade | null }

  if (!grade) {
    return { title: 'Марка стали не найдена' }
  }

  return {
    title: grade.meta_title_ru || `Сталь ${grade.name} - характеристики, состав, применение`,
    description: grade.meta_description_ru || grade.description_ru || `Марка стали ${grade.name}. Химический состав, механические свойства, область применения.`,
  }
}

export default async function SteelGradeDetailPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: grade } = await supabase
    .from('steel_grades')
    .select(`
      *,
      gost:gost_standards(id, number, slug, title_ru)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: (SteelGrade & { gost: { id: string; number: string; slug: string; title_ru: string } | null }) | null }

  if (!grade) {
    notFound()
  }

  const chemicalComposition = grade.chemical_composition as Record<string, string> | null
  const mechanicalProperties = grade.mechanical_properties as Record<string, string> | null

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Справочник', href: '/data' },
              { label: 'Марки стали', href: '/data/marki-stali' },
              { label: grade.name },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Scale className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Сталь {grade.name}
                </h1>
                {grade.gost && (
                  <Link
                    href={`/data/gost/${grade.gost.slug}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ГОСТ {grade.gost.number}
                  </Link>
                )}
              </div>
            </div>

            {grade.description_ru && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <p className="text-gray-700">{grade.description_ru}</p>
              </div>
            )}

            {/* Chemical Composition */}
            {chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-orange-500" />
                  Химический состав
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {Object.keys(chemicalComposition).map((element) => (
                          <th key={element} className="px-4 py-2 text-left border border-gray-200 font-medium">
                            {element}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {Object.values(chemicalComposition).map((value, i) => (
                          <td key={i} className="px-4 py-2 border border-gray-200">
                            {value}%
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Mechanical Properties */}
            {mechanicalProperties && Object.keys(mechanicalProperties).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-orange-500" />
                  Механические свойства
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(mechanicalProperties).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">{key}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications */}
            {grade.applications_ru && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Область применения
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{grade.applications_ru}</p>
                </div>
              </div>
            )}

            {/* Related GOST */}
            {grade.gost && (
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Нормативный документ
                </h3>
                <Link
                  href={`/data/gost/${grade.gost.slug}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  ГОСТ {grade.gost.number} — {grade.gost.title_ru}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужен металлопрокат из стали этой марки?"
        description="Мы поставляем металлопрокат из различных марок стали"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
