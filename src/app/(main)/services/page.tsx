import {
  Calculator,
  ClipboardCheck,
  FileText,
  Package,
  Scissors,
  Truck,
  Warehouse,
  Wrench
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Услуги - Темир Сервис Казахстан',
  description: 'Полный спектр услуг по металлопрокату: резка металла, доставка, хранение, комплектация заказов, консультации специалистов.',
}

const services = [
  {
    icon: Scissors,
    title: 'Резка металла',
    description: 'Профессиональная резка металлопроката по вашим размерам. Точность до 1 мм, минимальные сроки выполнения.',
    features: ['Газовая резка', 'Плазменная резка', 'Ленточнопильная резка', 'Рубка на гильотине'],
  },
  {
    icon: Truck,
    title: 'Доставка',
    description: 'Собственный автопарк грузоподъемностью от 1 до 20 тонн. Доставка по всему Казахстану.',
    features: ['Доставка в день заказа', 'Разгрузка манипулятором', 'Отслеживание груза', 'Страхование'],
  },
  {
    icon: Warehouse,
    title: 'Хранение',
    description: 'Ответственное хранение металлопроката на наших складах. Оптимальные условия хранения.',
    features: ['Крытые склады', 'Охраняемая территория', 'Учет по партиям', 'Гибкие сроки'],
  },
  {
    icon: Package,
    title: 'Комплектация',
    description: 'Комплексная поставка металлопроката для строительных объектов. Один поставщик — все позиции.',
    features: ['Подбор ассортимента', 'Сборные заказы', 'Отгрузка по графику', 'Резерв на складе'],
  },
  {
    icon: Calculator,
    title: 'Расчет материалов',
    description: 'Бесплатный расчет необходимого количества металлопроката по вашим чертежам и проектам.',
    features: ['Расчет по чертежам', 'Оптимизация раскроя', 'Подбор аналогов', 'Сметы'],
  },
  {
    icon: ClipboardCheck,
    title: 'Контроль качества',
    description: 'Входной контроль всей продукции. Сертификаты качества на каждую партию товара.',
    features: ['Проверка маркировки', 'Замер геометрии', 'Визуальный контроль', 'Сертификаты'],
  },
  {
    icon: FileText,
    title: 'Документация',
    description: 'Полный пакет сопроводительных документов: счета, накладные, сертификаты качества.',
    features: ['Электронный документооборот', 'Сертификаты качества', 'Паспорта изделий', 'Акты сверки'],
  },
  {
    icon: Wrench,
    title: 'Консультации',
    description: 'Профессиональные консультации по выбору металлопроката для вашего проекта.',
    features: ['Подбор марки стали', 'Технические решения', 'Экспертиза проектов', 'Обучение'],
  },
]

export default function ServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Наши <span className="text-orange-500">услуги</span>
            </h1>
            <p className="text-xl text-gray-300">
              Мы предоставляем полный спектр услуг по металлопрокату — от консультации
              до доставки готовой продукции на ваш объект.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <ul className="grid grid-cols-2 gap-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-900 font-semibold mb-1">Прием заявок</div>
              <div className="text-gray-500">Круглосуточный прием заявок через сайт и телефон</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">1 день</div>
              <div className="text-gray-900 font-semibold mb-1">Срок отгрузки</div>
              <div className="text-gray-500">Отгрузка со склада в день оплаты заказа</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-500 mb-2">100%</div>
              <div className="text-gray-900 font-semibold mb-1">Гарантия качества</div>
              <div className="text-gray-500">Сертифицированная продукция с гарантией</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Нужна консультация?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Наши специалисты помогут подобрать оптимальное решение для вашего проекта
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+77001618767"
              className="px-8 py-3 bg-white text-orange-500 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
            >
              Позвонить: +7 (700) 161-87-67
            </a>
            <Link
              href="/contacts"
              className="px-8 py-3 border-2 border-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
            >
              Оставить заявку
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
