import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import type { SpecialOffer } from '@/types/database'
import { Tag, Calendar, Percent } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Акции и спецпредложения на металлопрокат - Темир Сервис Казахстан',
  description: 'Актуальные акции и специальные предложения на металлопрокат. Скидки на арматуру, трубы, листовой прокат. Выгодные цены в Казахстане.',
}

export default async function SpecialOffersPage() {
  const supabase = await createClient()

  const { data: offers } = await supabase
    .from('special_offers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: SpecialOffer[] | null }

  const activeOffers = offers?.filter((offer) => {
    const now = new Date()
    const validFrom = offer.valid_from ? new Date(offer.valid_from) : null
    const validUntil = offer.valid_until ? new Date(offer.valid_until) : null

    if (validFrom && now < validFrom) return false
    if (validUntil && now > validUntil) return false
    return true
  }) || []

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Каталог', href: '/katalog' },
              { label: 'Акции и спецпредложения' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Акции и спецпредложения
            </h1>
            <p className="text-lg text-gray-600">
              Воспользуйтесь специальными предложениями и сэкономьте на покупке металлопроката
            </p>
          </div>

          {activeOffers.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Нет активных акций
              </h2>
              <p className="text-gray-600 mb-6">
                В данный момент нет специальных предложений. Следите за обновлениями!
              </p>
              <Link
                href="/katalog"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeOffers.map((offer) => (
                <Link
                  key={offer.id}
                  href={`/katalog/special-offer/${offer.slug}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-video relative bg-gray-100">
                    {offer.image_url ? (
                      <Image
                        src={offer.image_url}
                        alt={offer.title_ru}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-600">
                        <Percent className="w-16 h-16 text-white/80" />
                      </div>
                    )}
                    {offer.discount_percent && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                        -{offer.discount_percent}%
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {offer.title_ru}
                    </h2>
                    {offer.description_ru && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {offer.description_ru}
                      </p>
                    )}
                    {offer.valid_until && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                          До {new Date(offer.valid_until).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTABlock
        title="Хотите узнать о новых акциях первыми?"
        description="Оставьте заявку, и мы сообщим вам о специальных предложениях"
        primaryButton={{ text: 'Получить уведомление', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
        variant="orange"
      />
    </div>
  )
}
