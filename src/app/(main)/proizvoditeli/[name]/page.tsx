import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { ProductCard } from '@/components/catalog/ProductCard'
import { createClient } from '@/lib/supabase/server'
import { getLocale } from 'next-intl/server'
import { Factory, MapPin, Package, FileCheck } from 'lucide-react'
import type { Manufacturer, Product } from '@/types/database'

interface Props {
  params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name: slug } = await params
  const supabase = await createClient()

  const { data: manufacturer } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Manufacturer>()

  if (!manufacturer) {
    return { title: 'Производитель не найден' }
  }

  return {
    title: manufacturer.meta_title_ru || `${manufacturer.name_ru} - продукция производителя`,
    description: manufacturer.meta_description_ru || manufacturer.description_ru || `Металлопрокат от ${manufacturer.name_ru}. Прямые поставки, сертификаты качества.`,
  }
}

export default async function ManufacturerPage({ params }: Props) {
  const { name: slug } = await params
  const supabase = await createClient()
  const locale = await getLocale()

  const { data: manufacturer } = await supabase
    .from('manufacturers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Manufacturer>()

  if (!manufacturer) {
    notFound()
  }

  // Get products of this manufacturer
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('manufacturer_id', manufacturer.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(12) as { data: Product[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Производители', href: '/proizvoditeli' },
              { label: manufacturer.name_ru },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            {/* Manufacturer Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {manufacturer.logo_url ? (
                    <Image
                      src={manufacturer.logo_url}
                      alt={manufacturer.name_ru}
                      width={80}
                      height={80}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <Factory className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {manufacturer.name_ru}
                  </h1>
                  {manufacturer.country && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{manufacturer.country}</span>
                    </div>
                  )}
                </div>
              </div>

              {manufacturer.description_ru && (
                <TLDRBlock content={manufacturer.description_ru} className="mb-6" />
              )}

              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                {manufacturer.products_count > 0 && (
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <span>{manufacturer.products_count} товаров в каталоге</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-500" />
                  <span>Сертификаты качества</span>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Заказать продукцию
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Получите консультацию по продукции производителя {manufacturer.name_ru}
              </p>
              <Link
                href={`/uznat-cenu?manufacturer=${slug}`}
                className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors mb-3"
              >
                Узнать цену
              </Link>
              <Link
                href="/sertifikaty-i-dokumenty"
                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Сертификаты
              </Link>
            </div>
          </div>

          {/* Products */}
          {products && products.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Продукция {manufacturer.name_ru}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>
              {manufacturer.products_count > 12 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/katalog?manufacturer=${slug}`}
                    className="inline-block px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    Показать все товары ({manufacturer.products_count})
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Товары скоро появятся
              </h3>
              <p className="text-gray-600 mb-4">
                Мы работаем над добавлением продукции этого производителя
              </p>
              <Link
                href="/katalog"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Перейти в каталог
              </Link>
            </div>
          )}
        </div>
      </section>

      <CTABlock
        title="Нужна продукция этого завода?"
        description="Свяжитесь с нами для заказа металлопроката от производителя"
        primaryButton={{ text: 'Заказать', href: '/zakaz' }}
        secondaryButton={{ text: 'Все производители', href: '/proizvoditeli' }}
      />
    </div>
  )
}
