import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакты - Темир Сервис Казахстан',
  description: 'Контакты компании Темир Сервис. Адреса складов в Алматы, Астане и других городах Казахстана. Телефоны, email, режим работы.',
}

const offices = [
  {
    city: 'Алматы (главный офис)',
    address: 'Проспект Райымбека, 221а/4',
    phone: '+7 (700) 161-87-67',
    email: 'sale@temir-service.kz',
    hours: 'Пн-Вс: 9:30-18:30',
    isMain: true,
  },
]

export default function ContactsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-orange-500">Контакты</span>
            </h1>
            <p className="text-xl text-gray-300">
              Свяжитесь с нами любым удобным способом. Мы всегда готовы ответить на ваши вопросы.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-white">
            <a href="tel:+77001618767" className="flex items-center gap-2 hover:text-orange-100">
              <Phone className="w-5 h-5" />
              <span className="font-semibold">+7 (700) 161-87-67</span>
            </a>
            <a href="mailto:sale@temir-service.kz" className="flex items-center gap-2 hover:text-orange-100">
              <Mail className="w-5 h-5" />
              <span className="font-semibold">sale@temir-service.kz</span>
            </a>
            <a href="https://wa.me/77001618767" className="flex items-center gap-2 hover:text-orange-100">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form and Offices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Оставить заявку</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Компания</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Название компании"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Сообщение *</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Опишите ваш запрос или задайте вопрос..."
                  />
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="privacy" required className="mt-1" />
                  <label htmlFor="privacy" className="text-sm text-gray-600">
                    Я согласен с{' '}
                    <a href="/privacy" className="text-orange-500 hover:underline">
                      политикой конфиденциальности
                    </a>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Отправить заявку
                </button>
              </form>
            </div>

            {/* Offices */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Наши офисы</h2>
              <div className="space-y-4">
                {offices.map((office) => (
                  <div
                    key={office.city}
                    className={`rounded-xl p-6 ${
                      office.isMain
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <h3 className={`font-semibold text-lg mb-3 ${office.isMain ? 'text-white' : 'text-gray-900'}`}>
                      {office.city}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className={`w-4 h-4 mt-0.5 ${office.isMain ? 'text-orange-200' : 'text-gray-400'}`} />
                        <span className={office.isMain ? 'text-orange-100' : 'text-gray-600'}>{office.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${office.isMain ? 'text-orange-200' : 'text-gray-400'}`} />
                        <a
                          href={`tel:${office.phone.replace(/\D/g, '')}`}
                          className={`hover:underline ${office.isMain ? 'text-white' : 'text-gray-900'}`}
                        >
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${office.isMain ? 'text-orange-200' : 'text-gray-400'}`} />
                        <a
                          href={`mailto:${office.email}`}
                          className={`hover:underline ${office.isMain ? 'text-white' : 'text-gray-900'}`}
                        >
                          {office.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${office.isMain ? 'text-orange-200' : 'text-gray-400'}`} />
                        <span className={office.isMain ? 'text-orange-100' : 'text-gray-600'}>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-96 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Карта будет добавлена позже</p>
          </div>
        </div>
      </section>
    </div>
  )
}
