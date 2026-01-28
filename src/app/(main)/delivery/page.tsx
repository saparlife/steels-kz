import { CheckCircle, Clock, MapPin, Shield, Truck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Доставка и оплата - Темир Сервис Казахстан',
  description: 'Условия доставки металлопроката по Казахстану. Собственный автопарк, доставка в день заказа, разгрузка манипулятором.',
}

const deliveryZones = [
  { city: 'Алматы', time: '1-2 часа', price: 'от 5 000 ₸' },
  { city: 'Алматинская область', time: '1 день', price: 'от 15 000 ₸' },
  { city: 'Астана', time: '2-3 дня', price: 'от 45 000 ₸' },
  { city: 'Караганда', time: '2-3 дня', price: 'от 40 000 ₸' },
  { city: 'Шымкент', time: '2-3 дня', price: 'от 50 000 ₸' },
  { city: 'Другие города', time: '3-5 дней', price: 'По расчету' },
]

const paymentMethods = [
  {
    title: 'Безналичный расчет',
    description: 'Оплата по счету для юридических лиц и ИП. Работаем с НДС.',
    popular: true,
  },
  {
    title: 'Наличный расчет',
    description: 'Оплата наличными в кассе компании или курьеру при получении.',
    popular: false,
  },
  {
    title: 'Банковская карта',
    description: 'Оплата картой Visa, MasterCard в офисе компании.',
    popular: false,
  },
  {
    title: 'Отсрочка платежа',
    description: 'Для постоянных клиентов предоставляем отсрочку до 30 дней.',
    popular: false,
  },
]

const features = [
  {
    icon: Truck,
    title: 'Собственный автопарк',
    description: 'Более 20 единиц техники грузоподъемностью от 1 до 20 тонн',
  },
  {
    icon: Clock,
    title: 'Доставка в день заказа',
    description: 'При наличии товара на складе и оплате до 12:00',
  },
  {
    icon: Shield,
    title: 'Страхование груза',
    description: 'Все грузы застрахованы на полную стоимость',
  },
  {
    icon: MapPin,
    title: 'Доставка по всему КЗ',
    description: 'Работаем со всеми регионами Казахстана',
  },
]

export default function DeliveryPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Доставка и <span className="text-orange-500">оплата</span>
            </h1>
            <p className="text-xl text-gray-300">
              Быстрая доставка металлопроката по всему Казахстану. Собственный
              автопарк и отлаженная логистика.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center text-white">
                <feature.icon className="w-10 h-10 mx-auto mb-3" />
                <div className="font-semibold mb-1">{feature.title}</div>
                <div className="text-sm text-orange-100">{feature.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Зоны доставки
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Стоимость доставки зависит от расстояния, веса груза и типа транспорта.
            Точную стоимость уточняйте у менеджера.
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">Направление</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">Срок доставки</th>
                    <th className="px-6 py-4 text-left text-gray-900 font-semibold">Стоимость</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deliveryZones.map((zone) => (
                    <tr key={zone.city} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900">{zone.city}</td>
                      <td className="px-6 py-4 text-gray-600">{zone.time}</td>
                      <td className="px-6 py-4 text-orange-500 font-semibold">{zone.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Info */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Условия доставки</h2>
              <div className="space-y-4">
                {[
                  'Минимальный заказ для бесплатной доставки по Алматы — от 500 кг',
                  'Доставка осуществляется автотранспортом с возможностью разгрузки манипулятором',
                  'При доставке за пределы города время ожидания разгрузки — до 2 часов бесплатно',
                  'Возможна срочная доставка в течение 2-4 часов (по согласованию)',
                  'Самовывоз со склада возможен в рабочее время без выходных',
                ].map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Наш автопарк</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900">Газели (до 1,5 т)</div>
                  <div className="text-sm text-gray-500">Для небольших заказов и срочной доставки</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900">Бортовые (5-10 т)</div>
                  <div className="text-sm text-gray-500">Стандартная доставка металлопроката</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900">Длинномеры (до 20 т)</div>
                  <div className="text-sm text-gray-500">Для труб, балок и длинномерного проката</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="font-semibold text-gray-900">Манипуляторы</div>
                  <div className="text-sm text-gray-500">Разгрузка в труднодоступных местах</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Способы оплаты
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {paymentMethods.map((method) => (
              <div
                key={method.title}
                className={`rounded-xl p-6 ${
                  method.popular
                    ? 'bg-orange-500 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                {method.popular && (
                  <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded mb-3 inline-block">
                    Популярный
                  </span>
                )}
                <h3 className={`font-semibold mb-2 ${method.popular ? 'text-white' : 'text-gray-900'}`}>
                  {method.title}
                </h3>
                <p className={`text-sm ${method.popular ? 'text-orange-100' : 'text-gray-500'}`}>
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Рассчитать стоимость доставки</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Свяжитесь с нашими менеджерами для расчета точной стоимости доставки вашего заказа
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+77273123291"
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              +7 (7273) 123-291
            </a>
            <Link
              href="/contacts"
              className="px-8 py-3 border border-gray-600 hover:border-gray-500 rounded-lg font-semibold transition-colors"
            >
              Оставить заявку
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
