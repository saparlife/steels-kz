import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LeadForm } from '@/components/blocks/LeadForm'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import type { SpecialOffer, OfferProduct, Product } from '@/types/database'
import { formatPrice } from '@/lib/utils'
import { Calendar, Percent, Package, ArrowRight } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: offer } = await supabase
    .from('special_offers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: SpecialOffer | null }

  if (!offer) {
    return { title: 'Акция не найдена' }
  }

  return {
    title: offer.meta_title_ru || `${offer.title_ru} - Сталь Сервис Казахстан`,
    description: offer.meta_description_ru || offer.description_ru || '',
  }
}

export default async function SpecialOfferPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: offer } = await supabase
    .from('special_offers')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: SpecialOffer | null }

  if (!offer) {
    notFound()
  }

  // Check if offer is valid by date
  const now = new Date()
  const validFrom = offer.valid_from ? new Date(offer.valid_from) : null
  const validUntil = offer.valid_until ? new Date(offer.valid_until) : null

  const isExpired = validUntil && now > validUntil
  const notStarted = validFrom && now < validFrom

  // Get products in this offer
  const { data: offerProducts } = await supabase
    .from('offer_products')
    .select(`
      *,
      product:products(*)
    `)
    .eq('offer_id', offer.id) as { data: (OfferProduct & { product: Product })[] | null }

  const products = offerProducts?.map((op) => ({
    ...op.product,
    special_price: op.special_price,
  })) || []

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Каталог', href: '/katalog' },
              { label: 'Акции', href: '/katalog/special-offer' },
              { label: offer.title_ru },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Offer Header */}
              <div className="relative mb-8">
                {offer.image_url ? (
                  <div className="aspect-video relative rounded-xl overflow-hidden">
                    <Image
                      src={offer.image_url}
                      alt={offer.title_ru}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {offer.discount_percent && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-xl">
                        -{offer.discount_percent}%
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Percent className="w-24 h-24 text-white/80" />
                    {offer.discount_percent && (
                      <div className="absolute top-4 right-4 bg-white text-red-500 px-4 py-2 rounded-full font-bold text-xl">
                        -{offer.discount_percent}%
                      </div>
                    )}
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{offer.title_ru}</h1>

              {/* Status badge */}
              {isExpired && (
                <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg mb-4">
                  Акция завершена
                </div>
              )}
              {notStarted && (
                <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg mb-4">
                  Акция начнется {validFrom?.toLocaleDateString('ru-RU')}
                </div>
              )}

              {/* Dates */}
              {(validFrom || validUntil) && !isExpired && !notStarted && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Calendar className="w-5 h-5" />
                  <span>
                    {validFrom && `С ${validFrom.toLocaleDateString('ru-RU')}`}
                    {validFrom && validUntil && ' '}
                    {validUntil && `до ${validUntil.toLocaleDateString('ru-RU')}`}
                  </span>
                </div>
              )}

              {/* Description */}
              {offer.description_ru && (
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-600">{offer.description_ru}</p>
                </div>
              )}

              {/* Products in offer */}
              {products.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Товары в акции
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                      >
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-orange-500 transition-colors">
                            {product.name_ru}
                          </h3>
                          <div className="mt-2 flex items-baseline gap-2">
                            {product.special_price ? (
                              <>
                                <span className="text-lg font-bold text-red-500">
                                  {formatPrice(product.special_price)}
                                </span>
                                {product.price && (
                                  <span className="text-sm text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </>
                            ) : product.price ? (
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">По запросу</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors self-center" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {products.length === 0 && (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Товары в этой акции пока не добавлены.
                    Свяжитесь с нами для уточнения деталей.
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div>
              {!isExpired && !notStarted && (
                <LeadForm
                  type="order"
                  title="Воспользоваться акцией"
                  description="Оставьте заявку, чтобы получить товар по специальной цене"
                  showMessage
                  buttonText="Оформить заказ"
                  sourcePage={`/katalog/special-offer/${slug}`}
                />
              )}

              {isExpired && (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Акция завершена
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Следите за новыми предложениями
                  </p>
                  <Link
                    href="/katalog/special-offer"
                    className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                  >
                    Все акции
                  </Link>
                </div>
              )}

              <div className="mt-6 p-6 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Условия акции
                </h3>
                <ul className="text-sm text-orange-800 space-y-2">
                  <li>• Предложение действует на складские позиции</li>
                  <li>• Скидка не суммируется с другими акциями</li>
                  <li>• Количество товара ограничено</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Остались вопросы?"
        description="Свяжитесь с нами для получения подробной информации"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
