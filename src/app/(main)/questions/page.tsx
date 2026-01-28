import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { createClient } from '@/lib/supabase/server'
import { MessageCircle, ChevronRight, Search } from 'lucide-react'
import type { FAQCategory, FAQ } from '@/types/database'

export const metadata: Metadata = {
  title: 'Вопросы и ответы - Темир Сервис Казахстан',
  description: 'Ответы на популярные вопросы о металлопрокате, доставке, оплате и услугах компании Темир Сервис.',
}

export default async function QuestionsPage() {
  const supabase = await createClient()

  // Get FAQ categories
  const { data: categories } = await supabase
    .from('faq_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: FAQCategory[] | null }

  // Get popular FAQs
  const { data: popularFaqs } = await supabase
    .from('faq')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(10) as { data: FAQ[] | null }

  const faqForSchema = popularFaqs?.map((faq) => ({
    question: faq.question_ru,
    answer: faq.answer_ru,
  })) || []

  return (
    <div>
      <FAQSchema items={faqForSchema} />

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Вопросы и ответы' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Вопросы и ответы
                </h1>
                <p className="text-gray-600">Ответы на популярные вопросы</p>
              </div>
            </div>

            <TLDRBlock
              content="База ответов на частые вопросы о металлопрокате, ценах, доставке, оплате и услугах. Выберите категорию или найдите нужный вопрос."
            />
          </div>

          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Категории вопросов
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/faq/${category.slug}`}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all group"
                  >
                    <span className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">
                      {category.name_ru}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Popular Questions */}
          {popularFaqs && popularFaqs.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Популярные вопросы
              </h2>
              <div className="space-y-4">
                {popularFaqs.map((faq) => (
                  <details
                    key={faq.id}
                    className="group bg-white border border-gray-200 rounded-lg"
                  >
                    <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                      <span className="font-medium text-gray-900 pr-4">
                        {faq.question_ru}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90 flex-shrink-0" />
                    </summary>
                    <div className="px-4 pb-4 text-gray-600">
                      {faq.answer_ru}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {(!categories || categories.length === 0) && (!popularFaqs || popularFaqs.length === 0) && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                База вопросов заполняется
              </h2>
              <p className="text-gray-600 mb-6">
                Если у вас есть вопрос, свяжитесь с нами напрямую
              </p>
              <Link
                href="/contacts"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          )}
        </div>
      </section>

      <CTABlock
        title="Не нашли ответ на свой вопрос?"
        description="Свяжитесь с нами, и мы ответим на любые ваши вопросы"
        primaryButton={{ text: 'Задать вопрос', href: '/contacts' }}
        secondaryButton={{ text: 'Позвонить', href: 'tel:+77273123291' }}
      />
    </div>
  )
}
