import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LeadForm } from '@/components/blocks/LeadForm'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import type { City } from '@/types/database'
import { Warehouse, MapPin, Phone, Mail, Clock, Truck } from 'lucide-react'

interface Props {
  params: Promise<{ city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const supabase = await createClient()

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: City | null }

  if (!city) {
    return { title: 'Склад не найден' }
  }

  return {
    title: city.meta_title_ru || `Склад металлопроката в ${city.name_ru} - Темир Сервис`,
    description: city.meta_description_ru || `Склад металлопроката в ${city.name_ru}. Адрес, телефон, режим работы. Самовывоз и доставка.`,
  }
}

export default async function WarehouseCityPage({ params }: Props) {
  const { city: slug } = await params
  const supabase = await createClient()

  const { data: city } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: City | null }

  if (!city) {
    notFound()
  }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Склады', href: '/sklad' },
              { label: city.name_ru },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Warehouse className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Склад в {city.name_ru}
                  </h1>
                  <p className="text-gray-600">
                    Металлопрокат в наличии со склада
                  </p>
                </div>
              </div>

              {city.description_ru && (
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700">{city.description_ru}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Контактная информация
                </h2>

                <div className="space-y-4">
                  {city.warehouse_address_ru && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Адрес склада</p>
                        <p className="text-gray-600">{city.warehouse_address_ru}</p>
                      </div>
                    </div>
                  )}

                  {city.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Телефон</p>
                        <a href={`tel:${city.phone}`} className="text-orange-500 hover:text-orange-600">
                          {city.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {city.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <a href={`mailto:${city.email}`} className="text-orange-500 hover:text-orange-600">
                          {city.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {city.working_hours_ru && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Режим работы</p>
                        <p className="text-gray-600">{city.working_hours_ru}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="w-6 h-6 text-orange-500" />
                    <h3 className="font-semibold text-gray-900">Самовывоз</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Забрать заказ можно со склада в рабочее время.
                    Погрузка осуществляется нашими силами.
                  </p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="w-6 h-6 text-orange-500" />
                    <h3 className="font-semibold text-gray-900">Доставка</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Доставка по городу и области собственным автопарком.
                    Услуги манипулятора.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <LeadForm
                type="order"
                title="Заказать металлопрокат"
                description={`Оформите заказ со склада в ${city.name_ru}`}
                showMessage
                buttonText="Отправить заявку"
                sourcePage={`/sklad/${slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна доставка в другой город?"
        description="Мы доставляем металлопрокат по всему Казахстану"
        primaryButton={{ text: 'Рассчитать доставку', href: '/delivery' }}
        secondaryButton={{ text: 'Все склады', href: '/sklad' }}
      />
    </div>
  )
}
