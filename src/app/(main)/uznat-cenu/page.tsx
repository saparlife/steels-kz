import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LeadForm } from '@/components/blocks/LeadForm'
import { TrustBlock } from '@/components/blocks/TrustBlock'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CheckCircle, Clock, Phone, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Узнать цену на металлопрокат - Темир Сервис Казахстан',
  description: 'Запросите актуальную цену на металлопрокат. Бесплатная консультация, расчет стоимости заказа. Ответ в течение 15 минут.',
}

const features = [
  {
    icon: Clock,
    title: 'Быстрый ответ',
    description: 'Свяжемся с вами в течение 15 минут',
  },
  {
    icon: Shield,
    title: 'Актуальные цены',
    description: 'Всегда свежие цены от производителей',
  },
  {
    icon: Phone,
    title: 'Консультация',
    description: 'Бесплатная консультация специалиста',
  },
  {
    icon: CheckCircle,
    title: 'Индивидуальный расчет',
    description: 'Персональные условия для каждого клиента',
  },
]

const faqItems = [
  {
    question: 'Как быстро я получу расчет стоимости?',
    answer: 'Наш менеджер свяжется с вами в течение 15 минут в рабочее время (09:00-18:00). В остальное время — в начале следующего рабочего дня.',
  },
  {
    question: 'Можно ли получить скидку на крупный заказ?',
    answer: 'Да, мы предоставляем скидки в зависимости от объема заказа. При заявке укажите примерный объем, и менеджер предложит лучшие условия.',
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Принимаем безналичный расчет для юридических лиц, а также наличный расчет и банковские карты для физических лиц.',
  },
  {
    question: 'Есть ли минимальная сумма заказа?',
    answer: 'Минимальная сумма заказа отсутствует. Работаем как с розничными покупателями, так и с оптовыми клиентами.',
  },
]

export default function UznatCenuPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Узнать цену' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Узнать цену на металлопрокат
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Оставьте заявку и получите актуальную стоимость металлопроката.
                Наш менеджер свяжется с вами в течение 15 минут.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {features.map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Предпочитаете позвонить?
                </h3>
                <p className="text-orange-800 mb-4">
                  Наши специалисты готовы ответить на ваши вопросы
                </p>
                <a
                  href="tel:+77271234567"
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
                >
                  <Phone className="w-5 h-5" />
                  +7 (727) 123-45-67
                </a>
              </div>
            </div>

            <div>
              <LeadForm
                type="price_request"
                title="Запросить цену"
                description="Заполните форму, и мы свяжемся с вами"
                showEmail
                showMessage
                buttonText="Узнать цену"
                sourcePage="/uznat-cenu"
              />
            </div>
          </div>
        </div>
      </section>

      <TrustBlock showFeatures={true} certificates={[]} />

      <div className="container mx-auto px-4">
        <FAQBlock items={faqItems} />
      </div>
    </div>
  )
}
