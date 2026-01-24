import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { Package, CheckCircle, Building2, Truck, FileText, Users, Clock, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Комплектация объектов - Поставки металлопроката | Сталь Сервис Казахстан',
  description: 'Комплексная поставка металлопроката для строительных объектов. Один поставщик — все позиции. Отсрочка платежа, доставка по графику.',
}

const benefits = [
  {
    icon: Package,
    title: 'Весь ассортимент',
    description: 'Более 5000 позиций металлопроката на складе. Один поставщик для всего проекта.',
  },
  {
    icon: FileText,
    title: 'Работа по договору',
    description: 'Фиксированные цены на период строительства. Прозрачные условия сотрудничества.',
  },
  {
    icon: Truck,
    title: 'Доставка по графику',
    description: 'Поставки точно в срок согласно графику строительства. Резервирование на складе.',
  },
  {
    icon: Users,
    title: 'Персональный менеджер',
    description: 'Выделенный специалист ведет ваш проект от заявки до приемки на объекте.',
  },
]

const processSteps = [
  {
    step: 1,
    title: 'Получение заявки',
    description: 'Получаем спецификацию или проектную документацию от заказчика',
  },
  {
    step: 2,
    title: 'Коммерческое предложение',
    description: 'Готовим КП с фиксированными ценами и сроками поставки',
  },
  {
    step: 3,
    title: 'Заключение договора',
    description: 'Подписываем договор с графиком поставок и условиями оплаты',
  },
  {
    step: 4,
    title: 'Резервирование',
    description: 'Резервируем материал на складе под ваш объект',
  },
  {
    step: 5,
    title: 'Поставки по графику',
    description: 'Доставляем металлопрокат согласно графику строительства',
  },
  {
    step: 6,
    title: 'Закрывающие документы',
    description: 'Предоставляем полный пакет документов для бухгалтерии',
  },
]

const objectTypes = [
  {
    title: 'Жилое строительство',
    items: ['Многоэтажные дома', 'Коттеджные поселки', 'Таунхаусы'],
  },
  {
    title: 'Коммерческое строительство',
    items: ['Торговые центры', 'Бизнес-центры', 'Склады и логистика'],
  },
  {
    title: 'Промышленное строительство',
    items: ['Производственные цеха', 'Ангары', 'Заводы'],
  },
  {
    title: 'Инфраструктура',
    items: ['Мосты и путепроводы', 'Стадионы', 'Транспортные объекты'],
  },
]

const advantages = [
  {
    icon: Clock,
    title: 'Отсрочка платежа',
    description: 'До 45 дней отсрочки для надежных подрядчиков',
  },
  {
    icon: Shield,
    title: 'Фиксация цен',
    description: 'Фиксируем цены на весь период проекта',
  },
  {
    icon: Truck,
    title: 'Бесплатная доставка',
    description: 'При заказе от определенной суммы',
  },
  {
    icon: FileText,
    title: 'Сертификаты',
    description: 'Полный пакет документов на каждую поставку',
  },
]

const faqItems = [
  {
    question: 'Какой минимальный объем заказа для комплектации?',
    answer: 'Минимальный объем для заключения договора на комплектацию — от 500 000 тенге. Для меньших объемов работаем по разовым заявкам.',
  },
  {
    question: 'Предоставляете ли отсрочку платежа?',
    answer: 'Да, для постоянных клиентов и крупных проектов предоставляем отсрочку до 45 дней. Условия обсуждаются индивидуально.',
  },
  {
    question: 'Можно ли зафиксировать цены на весь проект?',
    answer: 'Да, при заключении договора на комплектацию фиксируем цены на согласованный период. Это защищает от колебаний рынка.',
  },
  {
    question: 'Работаете ли с государственными заказчиками?',
    answer: 'Да, работаем по 44-ФЗ и 223-ФЗ. Предоставляем все необходимые документы для участия в тендерах.',
  },
  {
    question: 'Как организована доставка на объект?',
    answer: 'Доставляем собственным автопарком или привлекаем проверенных перевозчиков. Груз страхуем, предоставляем услуги разгрузки.',
  },
  {
    question: 'Можно ли изменить заказ в процессе?',
    answer: 'Да, корректировки возможны. Незарезервированные позиции меняем без ограничений, по зарезервированным — по согласованию.',
  },
  {
    question: 'Какие документы предоставляете?',
    answer: 'Счета-фактуры, накладные, сертификаты качества, паспорта на продукцию, акты сверки. Электронный документооборот.',
  },
  {
    question: 'Есть ли скидки на объем?',
    answer: 'Да, действует система скидок в зависимости от объема и регулярности закупок. Условия обсуждаются индивидуально.',
  },
]

export default function KomplektaciyaPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Услуги', href: '/services' },
              { label: 'Комплектация объектов' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Комплектация объектов
                </h1>
                <p className="text-gray-600">Комплексные поставки металлопроката</p>
              </div>
            </div>

            <TLDRBlock
              content="Комплексная поставка металлопроката для строительных объектов. Один поставщик, фиксированные цены, доставка по графику, отсрочка платежа до 45 дней."
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Преимущества комплектации
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Как мы работаем
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Object Types */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Типы объектов
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {objectTypes.map((type) => (
              <div
                key={type.title}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4">{type.title}</h3>
                <ul className="space-y-2">
                  {type.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Conditions */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Особые условия для подрядчиков
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {advantages.map((adv) => (
              <div key={adv.title} className="text-center">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <adv.icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{adv.title}</h3>
                <p className="text-sm text-gray-600">{adv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Частые вопросы о комплектации
            </h2>
            <FAQBlock items={faqItems} />
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна комплектация объекта?"
        description="Отправьте спецификацию или проектную документацию для расчета"
        primaryButton={{ text: 'Запросить КП', href: '/dlya-biznesa' }}
        secondaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
      />
    </div>
  )
}
