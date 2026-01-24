import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import { Building2, Package } from 'lucide-react'
import type { Brand } from '@/types/database'

export const metadata: Metadata = {
  title: 'Бренды металлопроката - Сталь Сервис Казахстан',
  description: 'Металлопрокат от ведущих брендов России, Казахстана и мира. Работаем напрямую с производителями. Гарантия качества и сертификаты.',
}

export default async function BrandsPage() {
  const supabase = await createClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: Brand[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Бренды' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Бренды металлопроката
            </h1>
            <TLDRBlock
              content="Работаем с ведущими брендами металлопроката России, Казахстана и мира. Прямые поставки от производителей, все сертификаты качества в наличии."
            />
          </div>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Мы сотрудничаем напрямую с крупнейшими производителями металлопроката,
            что позволяет нам предлагать лучшие цены и гарантировать качество продукции.
          </p>

          {!brands?.length ? (
            <div className="text-center py-16">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Бренды скоро появятся
              </h2>
              <p className="text-gray-600 mb-6">
                Мы работаем над наполнением каталога брендов
              </p>
              <Link
                href="/katalog"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brendy/${brand.slug}`}
                  className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[3/2] relative mb-4 bg-gray-50 rounded-lg flex items-center justify-center">
                    {brand.logo_url ? (
                      <Image
                        src={brand.logo_url}
                        alt={brand.name_ru}
                        fill
                        className="object-contain p-4"
                        unoptimized
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-gray-300" />
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {brand.name_ru}
                  </h2>

                  {brand.description_ru && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {brand.description_ru}
                    </p>
                  )}

                  {brand.products_count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Package className="w-4 h-4" />
                      <span>{brand.products_count} товаров</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABlock
        title="Не нашли нужный бренд?"
        description="Свяжитесь с нами, мы поможем подобрать продукцию нужного производителя"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
