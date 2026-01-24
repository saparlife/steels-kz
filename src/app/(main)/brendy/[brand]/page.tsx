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
import { Building2, ExternalLink, Package } from 'lucide-react'
import type { Brand, Product } from '@/types/database'

interface Props {
  params: Promise<{ brand: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: slug } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Brand>()

  if (!brand) {
    return { title: 'Бренд не найден' }
  }

  return {
    title: brand.meta_title_ru || `${brand.name_ru} - купить металлопрокат в Казахстане`,
    description: brand.meta_description_ru || brand.description_ru || `Металлопрокат бренда ${brand.name_ru}. Купить с доставкой по Казахстану.`,
  }
}

export default async function BrandPage({ params }: Props) {
  const { brand: slug } = await params
  const supabase = await createClient()
  const locale = await getLocale()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Brand>()

  if (!brand) {
    notFound()
  }

  // Get products of this brand
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', brand.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(12) as { data: Product[] | null }

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Бренды', href: '/brendy' },
              { label: brand.name_ru },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 mb-12">
            {/* Brand Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {brand.logo_url ? (
                    <Image
                      src={brand.logo_url}
                      alt={brand.name_ru}
                      width={80}
                      height={80}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <Building2 className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {brand.name_ru}
                  </h1>
                  {brand.website_url && (
                    <a
                      href={brand.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-600"
                    >
                      {brand.website_url.replace(/^https?:\/\//, '')}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {brand.description_ru && (
                <TLDRBlock content={brand.description_ru} className="mb-6" />
              )}

              <div className="flex items-center gap-4 text-gray-600">
                {brand.products_count > 0 && (
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    <span>{brand.products_count} товаров в каталоге</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Нужна консультация?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Наши специалисты помогут подобрать продукцию бренда {brand.name_ru}
              </p>
              <Link
                href={`/uznat-cenu?brand=${slug}`}
                className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Получить консультацию
              </Link>
            </div>
          </div>

          {/* Products */}
          {products && products.length > 0 ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Продукция {brand.name_ru}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>
              {brand.products_count > 12 && (
                <div className="text-center mt-8">
                  <Link
                    href={`/katalog?brand=${slug}`}
                    className="inline-block px-6 py-3 border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                  >
                    Показать все товары ({brand.products_count})
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
                Мы работаем над добавлением продукции этого бренда
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
        title="Не нашли нужный товар?"
        description="Свяжитесь с нами, мы поможем подобрать продукцию бренда"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Все бренды', href: '/brendy' }}
      />
    </div>
  )
}
