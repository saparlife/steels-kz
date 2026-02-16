import { COMPANY_PHONE } from '@/lib/constants/company'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { LeadForm } from '@/components/blocks/LeadForm'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import type { City } from '@/types/database'
import { MapPin, Warehouse, Truck, Phone, Clock } from 'lucide-react'

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
    return { title: 'Город не найден' }
  }

  return {
    title: city.meta_title_ru || `Металлопрокат в ${city.name_ru} - купить с доставкой`,
    description: city.meta_description_ru || `Купить металлопрокат в ${city.name_ru}. ${city.has_warehouse ? 'Собственный склад, ' : ''}Доставка, лучшие цены.`,
  }
}

export default async function GeoCityPage({ params }: Props) {
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

  const faqItems = [
    {
      question: `Как заказать металлопрокат в ${city.name_ru}?`,
      answer: 'Оставьте заявку на сайте или позвоните нам. Менеджер рассчитает стоимость и сроки доставки.',
    },
    {
      question: 'Какие сроки доставки?',
      answer: city.has_warehouse
        ? 'При наличии на складе — отгрузка в день заказа или на следующий день.'
        : `Доставка в ${city.name_ru} осуществляется в течение 3-7 дней в зависимости от объема.`,
    },
    {
      question: 'Есть ли минимальная сумма заказа?',
      answer: 'Минимальная сумма заказа отсутствует. Работаем как с крупными, так и с небольшими заказами.',
    },
  ]

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'География', href: '/geo' },
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
                  <MapPin className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Металлопрокат в {city.name_ru}
                  </h1>
                  <p className="text-gray-600">
                    {city.has_warehouse ? 'Собственный склад и доставка' : 'Доставка металлопроката'}
                  </p>
                </div>
              </div>

              <TLDRBlock
                content={`${city.has_warehouse ? `Собственный склад металлопроката в ${city.name_ru}. ` : ''}Широкий ассортимент продукции, выгодные цены, оперативная доставка.`}
                className="mb-8"
              />

              {city.description_ru && (
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700">{city.description_ru}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {city.has_warehouse && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Warehouse className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-green-900">Склад в городе</h3>
                    </div>
                    <p className="text-green-800 text-sm">
                      Более 5000 тонн продукции в наличии. Отгрузка в день заказа.
                    </p>
                    {city.warehouse_address_ru && (
                      <p className="text-green-700 text-sm mt-2">
                        Адрес: {city.warehouse_address_ru}
                      </p>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Доставка</h3>
                  </div>
                  <p className="text-blue-800 text-sm">
                    {city.has_warehouse
                      ? 'Доставка по городу и области собственным транспортом.'
                      : `Доставка в ${city.name_ru} из ближайшего склада.`}
                  </p>
                </div>
              </div>

              {(city.phone || city.working_hours_ru) && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h2 className="font-semibold text-gray-900 mb-4">Контакты</h2>
                  <div className="space-y-3">
                    {city.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-orange-500" />
                        <a href={`tel:${city.phone}`} className="text-orange-500 hover:text-orange-600 font-medium">
                          {city.phone}
                        </a>
                      </div>
                    )}
                    {city.working_hours_ru && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">{city.working_hours_ru}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ассортимент продукции
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {['Арматура', 'Балка', 'Швеллер', 'Уголок', 'Труба', 'Лист'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/katalog/${cat.toLowerCase()}`}
                    className="p-3 bg-white border border-gray-200 rounded-lg text-center hover:border-orange-500 hover:text-orange-500 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <LeadForm
                type="order"
                title={`Заказать в ${city.name_ru}`}
                description="Оставьте заявку для расчета стоимости"
                showMessage
                buttonText="Отправить заявку"
                sourcePage={`/geo/${slug}`}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <FAQBlock items={faqItems} />
      </div>

      <CTABlock
        title="Готовы сделать заказ?"
        description="Оставьте заявку или позвоните нам прямо сейчас"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        phone={city.phone || COMPANY_PHONE}
      />
    </div>
  )
}
