import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { Flame, CheckCircle, Shield, Award, Clock, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Сварка металла - Услуги металлообработки | Темир Сервис Казахстан',
  description: 'Профессиональные сварочные работы: MIG/MAG, TIG, ручная дуговая сварка. Сварка металлоконструкций, труб, емкостей. Сертифицированные сварщики.',
}

const weldingTypes = [
  {
    title: 'Полуавтоматическая сварка (MIG/MAG)',
    description: 'Сварка в среде защитного газа. Высокая производительность и качество шва.',
    suitable: ['Черная сталь', 'Нержавеющая сталь', 'Алюминий'],
    advantages: ['Высокая скорость', 'Минимум брызг', 'Тонкие материалы'],
  },
  {
    title: 'Аргонодуговая сварка (TIG)',
    description: 'Сварка неплавящимся электродом в среде аргона. Идеальное качество шва.',
    suitable: ['Нержавеющая сталь', 'Алюминий', 'Медь и сплавы'],
    advantages: ['Высшее качество', 'Эстетичный шов', 'Тонкие изделия'],
  },
  {
    title: 'Ручная дуговая сварка (MMA)',
    description: 'Классическая сварка покрытыми электродами. Универсальность и надежность.',
    suitable: ['Черная сталь', 'Чугун', 'Разнородные металлы'],
    advantages: ['Мобильность', 'Любые условия', 'Толстый металл'],
  },
  {
    title: 'Контактная сварка',
    description: 'Точечная и шовная сварка тонколистовых материалов.',
    suitable: ['Тонкие листы', 'Сетки', 'Армирование'],
    advantages: ['Высокая скорость', 'Автоматизация', 'Серийное производство'],
  },
]

const advantages = [
  {
    icon: Award,
    title: 'Аттестованные сварщики',
    description: 'Специалисты с подтвержденной квалификацией НАКС',
  },
  {
    icon: Shield,
    title: 'Контроль качества',
    description: 'Визуальный и измерительный контроль каждого шва',
  },
  {
    icon: Clock,
    title: 'Соблюдение сроков',
    description: 'Выполнение работ точно в согласованные сроки',
  },
  {
    icon: Users,
    title: 'Опыт с 2005 года',
    description: 'Более 15 лет работы с металлоконструкциями',
  },
]

const faqItems = [
  {
    question: 'Какие виды сварки вы выполняете?',
    answer: 'Выполняем все основные виды сварки: полуавтоматическую (MIG/MAG), аргонодуговую (TIG), ручную дуговую (MMA), контактную точечную и шовную.',
  },
  {
    question: 'Какие материалы можете сваривать?',
    answer: 'Работаем с черной сталью, нержавеющей сталью, алюминием и его сплавами, медью, латунью. Также выполняем сварку разнородных металлов.',
  },
  {
    question: 'Есть ли сертификаты у сварщиков?',
    answer: 'Да, наши сварщики имеют аттестацию НАКС (Национальное агентство контроля сварки) по различным способам сварки и группам конструкций.',
  },
  {
    question: 'Выполняете ли сварку на выезде?',
    answer: 'Да, выполняем выездные сварочные работы на объектах заказчика при наличии необходимых условий и доступа к электричеству.',
  },
  {
    question: 'Как рассчитывается стоимость сварки?',
    answer: 'Стоимость зависит от сложности изделия, объема работ, типа сварки и материала. Рассчитывается по чертежам или после осмотра.',
  },
  {
    question: 'Проводите ли контроль качества сварных швов?',
    answer: 'Да, проводим визуальный и измерительный контроль всех швов. По запросу можем организовать ультразвуковой или рентгеновский контроль.',
  },
  {
    question: 'Какой максимальный размер конструкций?',
    answer: 'На нашем производстве можем изготавливать конструкции до 12 метров длиной и до 20 тонн весом.',
  },
  {
    question: 'Какие документы предоставляете на сварные работы?',
    answer: 'Предоставляем акты на скрытые работы, протоколы контроля качества, сертификаты на сварочные материалы.',
  },
]

export default function SvarkaPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Услуги', href: '/services' },
              { label: 'Сварка металла' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Сварка металла
                </h1>
                <p className="text-gray-600">Профессиональные сварочные работы</p>
              </div>
            </div>

            <TLDRBlock
              content="Сварочные услуги: MIG/MAG, TIG, MMA, контактная сварка. Аттестованные сварщики НАКС, контроль качества, работа с любыми металлами."
            />
          </div>
        </div>
      </section>

      {/* Welding Types */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Виды сварки
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {weldingTypes.map((type) => (
              <div
                key={type.title}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-4">{type.description}</p>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Материалы:</p>
                  <div className="flex flex-wrap gap-2">
                    {type.suitable.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Преимущества:</p>
                  <ul className="space-y-1">
                    {type.advantages.map((adv) => (
                      <li key={adv} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Почему выбирают нас
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

      {/* What We Weld */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Что мы свариваем
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Металлоконструкции',
                'Емкости и резервуары',
                'Трубопроводы',
                'Каркасы зданий',
                'Фермы и балки',
                'Лестницы и ограждения',
                'Нестандартные изделия',
                'Ремонт и восстановление',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Частые вопросы о сварке
            </h2>
            <FAQBlock items={faqItems} />
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужны сварочные работы?"
        description="Отправьте чертеж или опишите задачу для расчета стоимости"
        primaryButton={{ text: 'Заказать сварку', href: '/zakaz' }}
        secondaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
      />
    </div>
  )
}
