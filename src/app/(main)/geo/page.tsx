import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Truck, Warehouse } from 'lucide-react'
import type { City } from '@/types/database'

export const metadata: Metadata = {
  title: 'Металлопрокат по городам Казахстана - Сталь Сервис',
  description: 'Поставка металлопроката в Алматы, Астану, Караганду, Шымкент и другие города Казахстана. Склады и доставка.',
}

export default async function GeoPage() {
  const supabase = await createClient()

  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: City[] | null }

  const citiesWithWarehouse = cities?.filter((c) => c.has_warehouse) || []
  const deliveryCities = cities?.filter((c) => !c.has_warehouse) || []

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'География поставок' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              География поставок
            </h1>
            <TLDRBlock
              content="Поставляем металлопрокат по всему Казахстану. Собственные склады в 7 городах, доставка в любую точку страны. Оперативная отгрузка со склада."
            />
          </div>

          {/* Cities with warehouses */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Warehouse className="w-6 h-6 text-orange-500" />
              Города со складами
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {citiesWithWarehouse.map((city) => (
                <Link
                  key={city.id}
                  href={`/geo/${city.slug}`}
                  className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                >
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Warehouse className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
                      {city.name_ru}
                    </span>
                    <p className="text-sm text-gray-500">Склад в наличии</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Delivery cities */}
          {deliveryCities.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 text-orange-500" />
                Доставка в города
              </h2>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                {deliveryCities.map((city) => (
                  <Link
                    key={city.id}
                    href={`/geo/${city.slug}`}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  >
                    <MapPin className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <span className="text-gray-700 group-hover:text-orange-500 transition-colors">
                      {city.name_ru}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 bg-orange-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Доставка по всему Казахстану
            </h2>
            <p className="text-gray-600 mb-6">
              Если вашего города нет в списке — не переживайте! Мы доставляем
              металлопрокат в любую точку Казахстана. Свяжитесь с нами для
              расчета стоимости и сроков доставки.
            </p>
            <Link
              href="/delivery"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Подробнее о доставке
            </Link>
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужен металлопрокат в вашем городе?"
        description="Оставьте заявку и мы рассчитаем стоимость доставки"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
