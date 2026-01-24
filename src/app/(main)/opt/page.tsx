import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LeadForm } from '@/components/blocks/LeadForm'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { Percent, Truck, Clock, Users, FileText, Package } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Оптовые поставки металлопроката - Сталь Сервис Казахстан',
  description: 'Оптовые поставки металлопроката по лучшим ценам. Скидки до 15%, отсрочка платежа, персональный менеджер. Работаем по всему Казахстану.',
}

const benefits = [
  {
    icon: Percent,
    title: 'Скидки до 15%',
    description: 'Специальные цены для оптовых покупателей в зависимости от объема',
  },
  {
    icon: Clock,
    title: 'Отсрочка платежа',
    description: 'До 30 дней отсрочки для постоянных клиентов',
  },
  {
    icon: Users,
    title: 'Персональный менеджер',
    description: 'Закрепленный менеджер для решения всех вопросов',
  },
  {
    icon: Truck,
    title: 'Бесплатная доставка',
    description: 'Бесплатная доставка при заказе от 5 тонн',
  },
  {
    icon: FileText,
    title: 'Полный документооборот',
    description: 'Все необходимые документы: счета, накладные, сертификаты',
  },
  {
    icon: Package,
    title: 'Резервирование склада',
    description: 'Резервируем товар на складе под ваши заказы',
  },
]

const faqItems = [
  {
    question: 'Какой минимальный объем для оптовых условий?',
    answer: 'Оптовые условия начинаются от 1 тонны металлопроката или от 100 000 тенге за заказ. Чем больше объем, тем выгоднее условия.',
  },
  {
    question: 'Как получить максимальную скидку?',
    answer: 'Максимальная скидка 15% предоставляется при регулярных заказах от 10 тонн в месяц. Обсудите индивидуальные условия с менеджером.',
  },
  {
    question: 'Какие документы нужны для работы?',
    answer: 'Для заключения договора понадобится: реквизиты компании, карточка предприятия, доверенность на представителя (при необходимости).',
  },
  {
    question: 'Как быстро оформляется отсрочка?',
    answer: 'Отсрочка платежа оформляется после 2-3 успешных заказов с предоплатой. Решение принимается в течение 1-2 рабочих дней.',
  },
  {
    question: 'Работаете ли вы с тендерами?',
    answer: 'Да, мы активно участвуем в государственных и коммерческих тендерах. Предоставляем все необходимые документы для участия.',
  },
]

export default function OptPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Оптовикам' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Оптовые поставки металлопроката
            </h1>
            <TLDRBlock
              content="Специальные условия для оптовых покупателей: скидки до 15%, отсрочка платежа до 30 дней, персональный менеджер, бесплатная доставка от 5 тонн."
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-lg text-gray-600 mb-8">
                Работаем с крупными строительными компаниями, производственными предприятиями
                и торговыми организациями по всему Казахстану. Предлагаем выгодные условия
                сотрудничества и индивидуальный подход к каждому клиенту.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Преимущества работы с нами
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ассортимент для оптовиков
              </h2>
              <p className="text-gray-600 mb-4">
                В наличии на складах более 50 000 тонн металлопроката:
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 mb-8">
                {[
                  'Арматура строительная',
                  'Балка двутавровая',
                  'Швеллер горячекатаный',
                  'Уголок металлический',
                  'Труба профильная',
                  'Лист горячекатаный',
                  'Лист холоднокатаный',
                  'Круг стальной',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <LeadForm
                type="wholesale"
                title="Заявка на оптовые поставки"
                description="Оставьте заявку, и мы подготовим индивидуальное предложение"
                showEmail
                showCompany
                showMessage
                buttonText="Получить предложение"
                sourcePage="/opt"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <FAQBlock items={faqItems} />
      </div>

      <CTABlock
        title="Готовы обсудить условия?"
        description="Свяжитесь с нами для получения персонального коммерческого предложения"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
        phone="+7 (727) 123-45-67"
      />
    </div>
  )
}
