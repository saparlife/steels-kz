import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { CTABlock } from '@/components/blocks/CTABlock'
import { FileText, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Условия сотрудничества - Темир Сервис Казахстан',
  description: 'Условия работы с компанией Темир Сервис: оплата, доставка, возврат, гарантии.',
}

const sections = [
  {
    title: 'Заказ и оплата',
    items: [
      'Минимальная сумма заказа отсутствует',
      'Безналичный расчет для юридических лиц',
      'Наличный расчет для физических лиц',
      'Предоплата или оплата по факту (по договоренности)',
      'Отсрочка платежа для постоянных клиентов',
    ],
  },
  {
    title: 'Доставка',
    items: [
      'Самовывоз со склада в рабочее время',
      'Доставка по городу собственным транспортом',
      'Доставка по Казахстану транспортными компаниями',
      'Услуги манипулятора для разгрузки',
      'Отслеживание груза в пути',
    ],
  },
  {
    title: 'Возврат и обмен',
    items: [
      'Возврат в течение 14 дней при сохранении товарного вида',
      'Обмен бракованной продукции',
      'Рассмотрение претензий в течение 3 рабочих дней',
      'Возврат денежных средств в течение 10 дней',
    ],
  },
  {
    title: 'Гарантии',
    items: [
      'Соответствие продукции ГОСТ',
      'Сертификаты качества на всю продукцию',
      'Гарантия на сохранность при доставке',
      'Страхование грузов при перевозке',
    ],
  },
]

export default function TermsPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'О компании', href: '/about' },
              { label: 'Условия сотрудничества' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Условия сотрудничества
                </h1>
                <p className="text-gray-600">
                  Основные условия работы с нашей компанией
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.title} className="bg-white border border-gray-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-orange-50 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">
                Индивидуальные условия
              </h3>
              <p className="text-orange-800">
                Для постоянных клиентов и крупных заказов мы предлагаем индивидуальные условия
                сотрудничества. Свяжитесь с нами для обсуждения деталей.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Готовы начать сотрудничество?"
        description="Оставьте заявку или позвоните нам для обсуждения условий"
        primaryButton={{ text: 'Оставить заявку', href: '/zakaz' }}
        secondaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
      />
    </div>
  )
}
