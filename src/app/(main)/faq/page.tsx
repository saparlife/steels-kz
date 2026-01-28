'use client'

import { ChevronDown, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const faqCategories = [
  {
    name: 'Заказ и оплата',
    questions: [
      {
        q: 'Как оформить заказ?',
        a: 'Оформить заказ можно несколькими способами: позвонить по телефону +7 (700) 161-87-67, отправить заявку через форму на сайте, написать на email sale@temir-service.kz или обратиться в WhatsApp. Наш менеджер свяжется с вами для уточнения деталей и расчета стоимости.',
      },
      {
        q: 'Какой минимальный объем заказа?',
        a: 'Минимальный объем заказа зависит от типа продукции. Для большинства позиций минимальный заказ составляет от 100 кг. Для некоторых позиций возможна продажа поштучно или погонными метрами. Уточняйте у менеджера.',
      },
      {
        q: 'Какие способы оплаты вы принимаете?',
        a: 'Мы принимаем оплату безналичным расчетом (для юридических лиц и ИП), наличными в кассе или курьеру, банковскими картами. Для постоянных клиентов возможна отсрочка платежа до 30 дней.',
      },
      {
        q: 'Работаете ли вы с НДС?',
        a: 'Да, мы являемся плательщиком НДС. Все документы (счет-фактура, накладная) оформляются с НДС. При необходимости можем предоставить работу без НДС.',
      },
      {
        q: 'Можно ли зарезервировать товар?',
        a: 'Да, мы можем зарезервировать товар на складе на срок до 3 рабочих дней. Для резервирования на больший срок требуется предоплата.',
      },
    ],
  },
  {
    name: 'Доставка',
    questions: [
      {
        q: 'Осуществляете ли вы доставку?',
        a: 'Да, мы осуществляем доставку по Алматы и всему Казахстану. У нас собственный автопарк грузоподъемностью от 1 до 20 тонн. Стоимость доставки рассчитывается индивидуально.',
      },
      {
        q: 'Какие сроки доставки?',
        a: 'По Алматы — доставка в день заказа при оплате до 12:00. По Алматинской области — 1 день. В другие города Казахстана — 2-5 дней в зависимости от удаленности.',
      },
      {
        q: 'Есть ли бесплатная доставка?',
        a: 'Бесплатная доставка по Алматы при заказе от 500 кг. Для заказов меньшего объема стоимость доставки рассчитывается отдельно.',
      },
      {
        q: 'Возможен ли самовывоз?',
        a: 'Да, самовывоз возможен с нашего склада ежедневно с 9:30 до 18:30. Адрес: г. Алматы, Проспект Райымбека, 221а/4.',
      },
    ],
  },
  {
    name: 'Продукция',
    questions: [
      {
        q: 'Есть ли сертификаты на продукцию?',
        a: 'Да, вся продукция сертифицирована и соответствует ГОСТ. При отгрузке предоставляем сертификаты качества и паспорта на продукцию.',
      },
      {
        q: 'Какие марки стали есть в наличии?',
        a: 'В наличии широкий ассортимент марок стали: Ст3, 09Г2С, 10ХСНД, 20, 45, 40Х и многие другие. Также работаем под заказ с любыми марками стали.',
      },
      {
        q: 'Можно ли заказать нестандартные размеры?',
        a: 'Да, мы оказываем услуги по резке металла в размер. Возможна газовая, плазменная и ленточнопильная резка. Также работаем под заказ с заводами-производителями.',
      },
      {
        q: 'Как узнать наличие на складе?',
        a: 'Актуальное наличие можно уточнить у менеджера по телефону +7 (700) 161-87-67 или отправив запрос на email. Информация на сайте обновляется ежедневно.',
      },
    ],
  },
  {
    name: 'Для юридических лиц',
    questions: [
      {
        q: 'Работаете ли вы по договору?',
        a: 'Да, мы заключаем договоры поставки с юридическими лицами и ИП. Договор можно заключить в офисе или обменяться сканами с последующей отправкой оригиналов почтой.',
      },
      {
        q: 'Есть ли скидки для постоянных клиентов?',
        a: 'Да, для постоянных клиентов действует система скидок в зависимости от объема закупок. Также возможна отсрочка платежа до 30 дней.',
      },
      {
        q: 'Можно ли получить коммерческое предложение?',
        a: 'Да, отправьте запрос с перечнем необходимой продукции на email sale@temir-service.kz, и мы подготовим коммерческое предложение в течение 1-2 часов.',
      },
    ],
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full py-4 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-600">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Часто задаваемые <span className="text-orange-500">вопросы</span>
            </h1>
            <p className="text-xl text-gray-300">
              Ответы на популярные вопросы о заказе, доставке и продукции
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqCategories.map((category) => (
              <div key={category.name} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    {category.questions.map((item, index) => (
                      <FAQItem key={index} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Не нашли ответ на свой вопрос?
            </h2>
            <p className="text-gray-600 mb-8">
              Свяжитесь с нами, и мы с радостью ответим на все ваши вопросы
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+77001618767"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +7 (700) 161-87-67
              </a>
              <a
                href="https://wa.me/77001618767"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <Link
                href="/contacts"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Написать нам
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
