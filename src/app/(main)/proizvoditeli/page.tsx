import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import { Factory, Package, MapPin } from 'lucide-react'
import type { Manufacturer } from '@/types/database'

export const metadata: Metadata = {
  title: 'Производители металлопроката - Темир Сервис Казахстан',
  description: 'Прямые поставки от крупнейших металлургических заводов. Производители из России, Казахстана, Китая. Сертификаты качества, выгодные цены.',
}

export default async function ManufacturersPage() {
  const supabase = await createClient()

  const { data: manufacturers } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: Manufacturer[] | null }

  // Group by country
  const byCountry: Record<string, typeof manufacturers> = {}
  manufacturers?.forEach((m) => {
    const country = m.country || 'Другие'
    if (!byCountry[country]) {
      byCountry[country] = []
    }
    byCountry[country]?.push(m)
  })

  const countryOrder = ['Россия', 'Казахстан', 'Китай', 'Украина', 'Другие']
  const sortedCountries = Object.keys(byCountry).sort((a, b) => {
    const indexA = countryOrder.indexOf(a)
    const indexB = countryOrder.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Производители' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Производители металлопроката
            </h1>
            <TLDRBlock
              content="Работаем напрямую с крупнейшими металлургическими заводами. Производители из России, Казахстана, Китая. Прямые поставки, сертификаты качества на всю продукцию."
            />
          </div>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Мы сотрудничаем с проверенными производителями металлопроката,
            что гарантирует высокое качество продукции и конкурентные цены
            для наших клиентов.
          </p>

          {!manufacturers?.length ? (
            <div className="text-center py-16">
              <Factory className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Производители скоро появятся
              </h2>
              <p className="text-gray-600 mb-6">
                Мы работаем над наполнением каталога производителей
              </p>
              <Link
                href="/katalog"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {sortedCountries.map((country) => (
                <div key={country}>
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-900">{country}</h2>
                    <span className="text-gray-500">
                      ({byCountry[country]?.length} производителей)
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {byCountry[country]?.map((manufacturer) => (
                      <Link
                        key={manufacturer.id}
                        href={`/proizvoditeli/${manufacturer.slug}`}
                        className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {manufacturer.logo_url ? (
                              <Image
                                src={manufacturer.logo_url}
                                alt={manufacturer.name_ru}
                                width={48}
                                height={48}
                                className="object-contain"
                                unoptimized
                              />
                            ) : (
                              <Factory className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                              {manufacturer.name_ru}
                            </h3>
                            {manufacturer.description_ru && (
                              <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                                {manufacturer.description_ru}
                              </p>
                            )}
                            {manufacturer.products_count > 0 && (
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                                <Package className="w-4 h-4" />
                                <span>{manufacturer.products_count} товаров</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABlock
        title="Нужна продукция конкретного завода?"
        description="Свяжитесь с нами, мы организуем поставку от любого производителя"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
