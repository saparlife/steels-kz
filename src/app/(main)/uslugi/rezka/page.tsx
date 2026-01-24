import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { Scissors, CheckCircle, Ruler, Clock, Shield, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Резка металла - Услуги металлообработки | Сталь Сервис Казахстан',
  description: 'Профессиональная резка металлопроката: газовая, плазменная, ленточнопильная резка, рубка на гильотине. Точность до 1 мм, минимальные сроки.',
}

const cuttingTypes = [
  {
    title: 'Газовая резка',
    description: 'Резка толстого металла (до 300 мм) с помощью кислородно-ацетиленового пламени.',
    suitable: ['Листовой прокат', 'Толстостенные трубы', 'Балки и швеллеры'],
    thickness: '5-300 мм',
  },
  {
    title: 'Плазменная резка',
    description: 'Высокоточная резка металла струей плазмы с высокой скоростью обработки.',
    suitable: ['Нержавеющая сталь', 'Алюминий', 'Медь и сплавы'],
    thickness: '1-50 мм',
  },
  {
    title: 'Ленточнопильная резка',
    description: 'Точная резка профильного проката и труб с минимальными потерями материала.',
    suitable: ['Круглый прокат', 'Профильные трубы', 'Арматура'],
    thickness: 'до 400 мм',
  },
  {
    title: 'Рубка на гильотине',
    description: 'Быстрая резка листового металла на заготовки нужного размера.',
    suitable: ['Листовой металл', 'Полосы', 'Тонколистовой прокат'],
    thickness: '0.5-16 мм',
  },
]

const advantages = [
  {
    icon: Ruler,
    title: 'Точность до 1 мм',
    description: 'Современное оборудование обеспечивает высокую точность реза',
  },
  {
    icon: Clock,
    title: 'Срок от 1 дня',
    description: 'Выполнение заказа в кратчайшие сроки',
  },
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Контроль качества каждой операции',
  },
  {
    icon: Zap,
    title: 'Любые объемы',
    description: 'От единичных заготовок до серийных партий',
  },
]

const faqItems = [
  {
    question: 'Какую минимальную толщину металла можно резать?',
    answer: 'Минимальная толщина зависит от способа резки: для гильотины — от 0.5 мм, для плазменной резки — от 1 мм, для газовой резки — от 5 мм.',
  },
  {
    question: 'Сколько стоит резка металла?',
    answer: 'Стоимость рассчитывается индивидуально и зависит от типа металла, толщины, сложности реза и объема заказа. Оставьте заявку для точного расчета.',
  },
  {
    question: 'Можно ли резать по чертежам заказчика?',
    answer: 'Да, мы выполняем резку по чертежам и эскизам заказчика. Принимаем файлы в форматах DXF, DWG, PDF.',
  },
  {
    question: 'Какие сроки выполнения заказа?',
    answer: 'Стандартный срок — 1-3 рабочих дня. Срочные заказы выполняются в течение дня при наличии материала на складе.',
  },
  {
    question: 'Можно ли резать материал заказчика?',
    answer: 'Да, мы выполняем резку давальческого материала. Необходимо предоставить документы на металл.',
  },
  {
    question: 'Какой максимальный размер листа для резки?',
    answer: 'Максимальные размеры листа: 3000×12000 мм для плазменной резки, 2500×6000 мм для гильотины.',
  },
  {
    question: 'Выполняете ли фигурную резку?',
    answer: 'Да, плазменная резка позволяет вырезать детали любой формы по контуру, включая отверстия и сложные профили.',
  },
  {
    question: 'Как заказать услугу резки?',
    answer: 'Оставьте заявку на сайте или позвоните нам. Приложите чертеж или укажите размеры, тип и толщину металла.',
  },
]

export default function RezkiPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Услуги', href: '/services' },
              { label: 'Резка металла' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Scissors className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Резка металла
                </h1>
                <p className="text-gray-600">Профессиональная металлообработка</p>
              </div>
            </div>

            <TLDRBlock
              content="Услуги резки металлопроката: газовая, плазменная, ленточнопильная резка, рубка на гильотине. Точность до 1 мм, сроки от 1 дня, работа по чертежам заказчика."
            />
          </div>
        </div>
      </section>

      {/* Cutting Types */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Виды резки металла
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {cuttingTypes.map((type) => (
              <div
                key={type.title}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="flex items-center gap-2 text-sm text-orange-600 font-medium mb-3">
                  <span>Толщина: {type.thickness}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Подходит для:</p>
                  <ul className="space-y-1">
                    {type.suitable.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
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
            Наши преимущества
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

      {/* Price Note */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Стоимость услуг
            </h2>
            <p className="text-gray-600 mb-6">
              Стоимость резки рассчитывается индивидуально и зависит от типа металла,
              толщины материала, сложности реза и объема заказа. Для точного расчета
              отправьте нам чертеж или спецификацию.
            </p>
            <Link
              href="/uznat-cenu"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Узнать стоимость
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Частые вопросы о резке металла
            </h2>
            <FAQBlock items={faqItems} />
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна резка металла?"
        description="Отправьте чертеж или спецификацию для расчета стоимости"
        primaryButton={{ text: 'Заказать резку', href: '/zakaz' }}
        secondaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
      />
    </div>
  )
}
