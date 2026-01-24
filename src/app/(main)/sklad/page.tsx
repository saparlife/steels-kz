import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import { Warehouse, MapPin, Phone, Clock } from 'lucide-react'
import type { City } from '@/types/database'

export const metadata: Metadata = {
  title: 'Склады металлопроката в Казахстане - Сталь Сервис',
  description: 'Адреса складов металлопроката в Алматы, Астане и других городах Казахстана. Самовывоз и доставка.',
}

export default async function WarehousesPage() {
  const supabase = await createClient()

  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .eq('has_warehouse', true)
    .order('sort_order', { ascending: true }) as { data: City[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Склады' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Склады металлопроката
            </h1>
            <TLDRBlock
              content="Собственные склады в крупнейших городах Казахстана. Более 50 000 тонн металлопроката в наличии. Самовывоз и доставка по всей стране."
            />
          </div>

          {!cities?.length ? (
            <div className="text-center py-16">
              <Warehouse className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Информация о складах загружается
              </h2>
              <p className="text-gray-600 mb-6">
                Свяжитесь с нами для уточнения адресов
              </p>
              <Link
                href="/contacts"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/sklad/${city.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Warehouse className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                        {city.name_ru}
                      </h2>
                    </div>
                  </div>

                  {city.warehouse_address_ru && (
                    <div className="flex items-start gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{city.warehouse_address_ru}</span>
                    </div>
                  )}

                  {city.phone && (
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{city.phone}</span>
                    </div>
                  )}

                  {city.working_hours_ru && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{city.working_hours_ru}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">50 000+</div>
              <div className="text-gray-600">тонн на складах</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">10 000+</div>
              <div className="text-gray-600">позиций в наличии</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">7+</div>
              <div className="text-gray-600">городов присутствия</div>
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна доставка со склада?"
        description="Оформите заказ и мы доставим металлопрокат в любую точку Казахстана"
        primaryButton={{ text: 'Оформить заказ', href: '/zakaz' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
