import { Award, Building2, Clock, MapPin, Target, Truck, Users } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'О компании - Темир Сервис Казахстан',
  description: 'Темир Сервис - крупнейший поставщик металлопроката в Казахстане. Более 15 лет опыта, собственные склады, широкий ассортимент продукции.',
}

const stats = [
  { value: '15+', label: 'лет на рынке' },
  { value: '50 000+', label: 'тонн на складе' },
  { value: '10 000+', label: 'довольных клиентов' },
  { value: '7', label: 'городов присутствия' },
]

const values = [
  {
    icon: Target,
    title: 'Качество',
    description: 'Вся продукция сертифицирована и соответствует ГОСТ. Работаем только с проверенными производителями.',
  },
  {
    icon: Clock,
    title: 'Оперативность',
    description: 'Отгрузка в день заказа. Собственный автопарк обеспечивает быструю доставку по всему Казахстану.',
  },
  {
    icon: Users,
    title: 'Клиентоориентированность',
    description: 'Индивидуальный подход к каждому клиенту. Персональный менеджер и гибкие условия сотрудничества.',
  },
  {
    icon: Truck,
    title: 'Логистика',
    description: 'Доставка по всему Казахстану. Отлаженная логистическая система и надежные партнеры.',
  },
]

const milestones = [
  { year: '2009', text: 'Основание компании в Алматы' },
  { year: '2012', text: 'Открытие филиала в Астане' },
  { year: '2015', text: 'Расширение складских площадей до 15 000 м²' },
  { year: '2018', text: 'Запуск собственного автопарка' },
  { year: '2021', text: 'Открытие филиалов в 5 городах' },
  { year: '2024', text: 'Более 50 000 тонн продукции на складах' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              О компании <span className="text-orange-500">Темир Сервис</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Мы — один из крупнейших поставщиков металлопроката в Казахстане.
              Более 15 лет обеспечиваем строительные и промышленные предприятия
              качественной металлопродукцией.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Надежный партнер для вашего бизнеса
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong className="text-gray-900">Темир Сервис Казахстан</strong> — это динамично
                  развивающаяся компания, специализирующаяся на оптовых и розничных поставках
                  металлопроката и трубопроводной арматуры.
                </p>
                <p>
                  Мы работаем напрямую с ведущими металлургическими заводами России, Казахстана,
                  Китая и Европы, что позволяет нам предлагать конкурентные цены и гарантировать
                  высокое качество продукции.
                </p>
                <p>
                  Наши склады расположены в крупнейших городах Казахстана, что обеспечивает
                  оперативную доставку продукции в любую точку страны. Постоянное наличие
                  широкого ассортимента на складах позволяет выполнять заказы любого объема
                  в кратчайшие сроки.
                </p>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center">
                <Building2 className="w-24 h-24 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Наши ценности
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            История компании
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {milestone.year.slice(2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-orange-200 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <div className="text-orange-500 font-semibold">{milestone.year}</div>
                    <div className="text-gray-700">{milestone.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Сертификаты и награды
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Наша продукция сертифицирована и соответствует всем требованиям качества.
            Мы гордимся признанием нашей работы.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Award className="w-16 h-16 text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы к сотрудничеству?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами, чтобы узнать больше о нашей продукции и условиях сотрудничества.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contacts"
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition-colors"
            >
              Связаться с нами
            </a>
            <a
              href="/katalog"
              className="px-8 py-3 border border-gray-600 hover:border-gray-500 rounded-lg font-semibold transition-colors"
            >
              Смотреть каталог
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
