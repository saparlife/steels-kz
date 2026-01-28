import { CategoryCard } from '@/components/catalog/CategoryCard'
import { type Locale } from '@/i18n/config'
import { createClient } from '@/lib/supabase/server'
import { getLocalizedField } from '@/lib/utils'
import type { Category, Review, FAQ, SiteSetting } from '@/types/database'
import { Award, Clock, Package, Truck } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

async function getHomeData() {
  const supabase = await createClient()

  const [categoriesRes, reviewsRes, faqRes, settingsRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('sort_order')
      .limit(12),
    supabase
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(6),
    supabase
      .from('faq')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(6),
    supabase
      .from('site_settings')
      .select('*'),
  ])

  return {
    categories: (categoriesRes.data || []) as Category[],
    reviews: (reviewsRes.data || []) as Review[],
    faq: (faqRes.data || []) as FAQ[],
    settings: (settingsRes.data || []) as SiteSetting[],
  }
}

export default async function HomePage() {
  const locale = await getLocale() as Locale
  const t = await getTranslations('home')
  const { categories, reviews, faq } = await getHomeData()

  const whyUsItems = [
    { icon: Award, key: 'quality' as const },
    { icon: Truck, key: 'delivery' as const },
    { icon: Package, key: 'prices' as const },
    { icon: Clock, key: 'support' as const },
  ]

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/katalog"
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Перейти в каталог
              </Link>
              <Link
                href="/uznat-cenu"
                className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
              >
                Получить консультацию
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-orange-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold">177 000+</div>
              <div className="text-orange-100">{t('stats.products')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">5 000+</div>
              <div className="text-orange-100">{t('stats.clients')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">555 500</div>
              <div className="text-orange-100">{t('stats.delivered')}</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold">15+</div>
              <div className="text-orange-100">{t('stats.experience')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('catalogTitle')}
            </h2>
            <Link href="/katalog" className="text-orange-500 hover:text-orange-600 font-medium">
              Все категории →
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Категории скоро появятся
            </div>
          )}
        </div>
      </section>

      {/* Why us */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            {t('whyUs')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUsItems.map((item) => (
              <div key={item.key} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-500 mb-4">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t(`whyUsItems.${item.key}`)}
                </h3>
                <p className="text-gray-600">
                  {t(`whyUsItems.${item.key}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              {t('reviews')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-1 text-orange-400 mb-4">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    {getLocalizedField(review, 'content', locale)}
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{review.author_name}</div>
                    {review.company && (
                      <div className="text-sm text-gray-500">{review.company}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
              {t('faq')}
            </h2>

            <div className="max-w-3xl mx-auto space-y-4">
              {faq.map((item) => (
                <details key={item.id} className="group border border-gray-200 rounded-lg">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:text-orange-500">
                    {getLocalizedField(item, 'question', locale)}
                    <span className="ml-4 transition-transform group-open:rotate-180">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-600">
                    {getLocalizedField(item, 'answer', locale)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Нужна консультация?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Наши специалисты помогут подобрать оптимальное решение для вашего проекта
          </p>
          <Link
            href="/uznat-cenu"
            className="inline-flex items-center justify-center px-6 py-3 text-lg font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Получить консультацию
          </Link>
        </div>
      </section>
    </div>
  )
}
