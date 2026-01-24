import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LeadForm } from '@/components/blocks/LeadForm'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { Handshake, TrendingUp, Package, Users, Award, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Партнерская программа - Сталь Сервис Казахстан',
  description: 'Станьте партнером крупнейшего поставщика металлопроката. Специальные условия для дилеров, маржа до 20%, маркетинговая поддержка.',
}

const partnerBenefits = [
  {
    icon: TrendingUp,
    title: 'Маржа до 20%',
    description: 'Высокая маржинальность на всю линейку продукции',
  },
  {
    icon: Package,
    title: 'Широкий ассортимент',
    description: 'Более 10 000 позиций металлопроката в каталоге',
  },
  {
    icon: Users,
    title: 'Обучение персонала',
    description: 'Бесплатное обучение продукту для ваших менеджеров',
  },
  {
    icon: Award,
    title: 'Маркетинговая поддержка',
    description: 'Каталоги, презентации, рекламные материалы',
  },
  {
    icon: BarChart3,
    title: 'Личный кабинет',
    description: 'Онлайн-заказы, история, аналитика продаж',
  },
  {
    icon: Handshake,
    title: 'Гибкие условия',
    description: 'Индивидуальные условия для каждого партнера',
  },
]

const partnerLevels = [
  {
    level: 'Дилер',
    requirements: 'От 500 000 тенге/месяц',
    benefits: ['Скидка 5%', 'Базовая поддержка', 'Каталоги продукции'],
  },
  {
    level: 'Серебряный партнер',
    requirements: 'От 2 000 000 тенге/месяц',
    benefits: ['Скидка 10%', 'Приоритетная обработка', 'Отсрочка 14 дней', 'Обучение персонала'],
  },
  {
    level: 'Золотой партнер',
    requirements: 'От 5 000 000 тенге/месяц',
    benefits: ['Скидка 15%', 'VIP поддержка', 'Отсрочка 30 дней', 'Совместный маркетинг', 'Бонусная программа'],
  },
]

const faqItems = [
  {
    question: 'Какие требования к партнерам?',
    answer: 'Действующее юридическое лицо или ИП, опыт работы в сфере металлопроката или строительных материалов, наличие клиентской базы или каналов сбыта.',
  },
  {
    question: 'Как начать сотрудничество?',
    answer: 'Оставьте заявку на сайте, наш менеджер свяжется для обсуждения условий. После согласования подписываем партнерское соглашение.',
  },
  {
    question: 'Есть ли территориальные ограничения?',
    answer: 'Мы заинтересованы в партнерах по всему Казахстану. В некоторых регионах возможна эксклюзивность при выполнении плана продаж.',
  },
  {
    question: 'Предоставляется ли товар на реализацию?',
    answer: 'Для проверенных партнеров с положительной историей возможно предоставление товара на реализацию с отсрочкой платежа.',
  },
  {
    question: 'Какая поддержка предоставляется?',
    answer: 'Персональный менеджер, обучение продукту, маркетинговые материалы, совместные акции, техническая консультация по продукции.',
  },
]

export default function PartneramPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Партнерам' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Партнерская программа
            </h1>
            <TLDRBlock
              content="Приглашаем к сотрудничеству дилеров и торговые компании. Маржа до 20%, маркетинговая поддержка, обучение персонала, гибкие условия оплаты."
            />
          </div>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Развивайте свой бизнес вместе с нами. Мы предлагаем надежное партнерство
            с одним из крупнейших поставщиков металлопроката в Казахстане.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Преимущества партнерства
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {partnerBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Уровни партнерства
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {partnerLevels.map((level, index) => (
              <div
                key={level.level}
                className={`rounded-lg p-6 border-2 ${
                  index === 2
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {index === 2 && (
                  <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full mb-4">
                    Рекомендуем
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{level.level}</h3>
                <p className="text-gray-600 text-sm mb-4">{level.requirements}</p>
                <ul className="space-y-2">
                  {level.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-gray-700 text-sm">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Как стать партнером
              </h2>
              <ol className="space-y-6">
                {[
                  {
                    step: '1',
                    title: 'Заявка',
                    text: 'Заполните форму с информацией о вашей компании',
                  },
                  {
                    step: '2',
                    title: 'Переговоры',
                    text: 'Обсудим условия сотрудничества с нашим менеджером',
                  },
                  {
                    step: '3',
                    title: 'Соглашение',
                    text: 'Подписываем партнерское соглашение',
                  },
                  {
                    step: '4',
                    title: 'Обучение',
                    text: 'Проводим обучение по продукту для вашей команды',
                  },
                  {
                    step: '5',
                    title: 'Старт работы',
                    text: 'Начинаем продуктивное сотрудничество',
                  },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <LeadForm
                type="partner"
                title="Стать партнером"
                description="Расскажите о вашей компании и мы свяжемся для обсуждения условий"
                showEmail
                showCompany
                showMessage
                buttonText="Отправить заявку"
                sourcePage="/partneram"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <FAQBlock items={faqItems} />
      </div>

      <CTABlock
        title="Есть вопросы о партнерстве?"
        description="Свяжитесь с нашим отделом развития партнерской сети"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        phone="+7 (727) 123-45-67"
      />
    </div>
  )
}
