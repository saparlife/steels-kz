import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import { Briefcase, Building2, ArrowRight } from 'lucide-react'
import type { Case } from '@/types/database'

export const metadata: Metadata = {
  title: 'Кейсы и проекты - Темир Сервис Казахстан',
  description: 'Реализованные проекты поставки металлопроката. Кейсы для строительства, производства, инфраструктуры.',
}

export default async function CasesPage() {
  const supabase = await createClient()

  const { data: cases } = await supabase
    .from('cases')
    .select('*')
    .eq('is_active', true)
    .order('published_at', { ascending: false }) as { data: Case[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Кейсы' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Наши кейсы
            </h1>
            <TLDRBlock
              content="Примеры успешных проектов поставки металлопроката. Работаем со строительными компаниями, производствами, государственными организациями."
            />
          </div>

          {!cases?.length ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Кейсы скоро появятся
              </h2>
              <p className="text-gray-600 mb-6">
                Мы работаем над описанием реализованных проектов
              </p>
              <Link
                href="/contacts"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Обсудить ваш проект
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative bg-gray-100">
                    {caseItem.image_url ? (
                      <Image
                        src={caseItem.image_url}
                        alt={caseItem.title_ru}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    {caseItem.industry && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white text-sm rounded-full">
                        {caseItem.industry}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {caseItem.title_ru}
                    </h2>
                    {caseItem.client_name && (
                      <p className="text-gray-500 text-sm mb-3">
                        Клиент: {caseItem.client_name}
                      </p>
                    )}
                    {caseItem.excerpt_ru && (
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {caseItem.excerpt_ru}
                      </p>
                    )}
                    <span className="text-orange-500 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Подробнее
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABlock
        title="Есть проект? Давайте обсудим!"
        description="Расскажите о вашем проекте, и мы подготовим индивидуальное предложение"
        primaryButton={{ text: 'Обсудить проект', href: '/dlya-biznesa' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
