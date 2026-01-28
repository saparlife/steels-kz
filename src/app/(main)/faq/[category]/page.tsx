import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { FAQSchema } from '@/components/seo/FAQSchema'
import { createClient } from '@/lib/supabase/server'
import type { FAQCategory, FAQ } from '@/types/database'
import { MessageCircle, ArrowLeft, ChevronRight } from 'lucide-react'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('faq_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: FAQCategory | null }

  if (!category) {
    return { title: 'Категория не найдена' }
  }

  return {
    title: `${category.name_ru} - Вопросы и ответы | Темир Сервис Казахстан`,
    description: `Ответы на вопросы о ${category.name_ru.toLowerCase()}. Подробная информация для клиентов Темир Сервис.`,
  }
}

export default async function FAQCategoryPage({ params }: Props) {
  const { category: slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('faq_categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single() as { data: FAQCategory | null }

  if (!category) {
    notFound()
  }

  // Get FAQs for this category
  const { data: faqs } = await supabase
    .from('faq')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: FAQ[] | null }

  // Get other categories for navigation
  const { data: otherCategories } = await supabase
    .from('faq_categories')
    .select('*')
    .eq('is_active', true)
    .neq('id', category.id)
    .order('sort_order', { ascending: true })
    .limit(5) as { data: FAQCategory[] | null }

  const faqItems = faqs?.map((faq) => ({
    question: faq.question_ru,
    answer: faq.answer_ru,
  })) || []

  return (
    <div>
      <FAQSchema items={faqItems} />

      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Вопросы и ответы', href: '/questions' },
              { label: category.name_ru },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/questions"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Все вопросы
            </Link>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {category.name_ru}
                </h1>
                <p className="text-gray-600">
                  {faqItems.length} {faqItems.length === 1 ? 'вопрос' : faqItems.length < 5 ? 'вопроса' : 'вопросов'}
                </p>
              </div>
            </div>

            {faqItems.length > 0 ? (
              <FAQBlock items={faqItems} />
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  В этой категории пока нет вопросов
                </p>
              </div>
            )}

            {/* Other categories */}
            {otherCategories && otherCategories.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Другие категории
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {otherCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/faq/${cat.slug}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors group"
                    >
                      <span className="text-gray-700 group-hover:text-orange-600 transition-colors">
                        {cat.name_ru}
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTABlock
        title="Не нашли ответ?"
        description="Свяжитесь с нами для получения консультации"
        primaryButton={{ text: 'Задать вопрос', href: '/contacts' }}
        secondaryButton={{ text: 'Все вопросы', href: '/questions' }}
      />
    </div>
  )
}
