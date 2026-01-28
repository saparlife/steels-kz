import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { Maximize2, CheckCircle, Ruler, Clock, Shield, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Гибка металла - Услуги металлообработки | Темир Сервис Казахстан',
  description: 'Услуги гибки листового металла и профиля: гибка на листогибочном прессе, вальцовка, гибка труб. Высокая точность, любые объемы.',
}

const bendingTypes = [
  {
    title: 'Гибка листового металла',
    description: 'Гибка листов на листогибочном прессе с ЧПУ. Точные углы, ровные линии сгиба.',
    suitable: ['Стальные листы', 'Оцинкованная сталь', 'Нержавеющая сталь', 'Алюминий'],
    specs: 'До 6 м длины, до 12 мм толщины',
  },
  {
    title: 'Вальцовка',
    description: 'Придание листовому металлу цилиндрической или конической формы на вальцах.',
    suitable: ['Обечайки', 'Цилиндры', 'Конусы', 'Желоба'],
    specs: 'До 3 м ширины, до 20 мм толщины',
  },
  {
    title: 'Гибка профиля',
    description: 'Гибка профильного проката: уголка, швеллера, двутавра по радиусу.',
    suitable: ['Уголок', 'Швеллер', 'Двутавр', 'Профильная труба'],
    specs: 'Радиус от 500 мм',
  },
  {
    title: 'Гибка труб',
    description: 'Гибка круглых и профильных труб на трубогибочном станке.',
    suitable: ['Круглые трубы', 'Профильные трубы', 'Нержавеющие трубы'],
    specs: 'Диаметр до 159 мм',
  },
]

const advantages = [
  {
    icon: Settings,
    title: 'Оборудование с ЧПУ',
    description: 'Современные станки с программным управлением',
  },
  {
    icon: Ruler,
    title: 'Высокая точность',
    description: 'Погрешность не более 0.5°',
  },
  {
    icon: Clock,
    title: 'Сроки от 1 дня',
    description: 'Быстрое выполнение заказов',
  },
  {
    icon: Shield,
    title: 'Без повреждений',
    description: 'Сохранение покрытия и структуры',
  },
]

const faqItems = [
  {
    question: 'Какую максимальную толщину металла можно гнуть?',
    answer: 'На листогибочном прессе — до 12 мм для черной стали, до 8 мм для нержавеющей. На вальцах — до 20 мм.',
  },
  {
    question: 'Какой минимальный радиус гибки?',
    answer: 'Минимальный радиус зависит от толщины металла и обычно составляет 1-2 толщины материала. Для труб — от 2 диаметров.',
  },
  {
    question: 'Можно ли гнуть оцинкованный металл без повреждения покрытия?',
    answer: 'Да, при правильном подборе инструмента и режимов гибки покрытие не повреждается.',
  },
  {
    question: 'Выполняете ли многократную гибку?',
    answer: 'Да, выполняем многократную гибку для создания сложных профилей: П-образных, Z-образных, коробов и других.',
  },
  {
    question: 'Сколько стоит гибка металла?',
    answer: 'Стоимость зависит от толщины, длины гиба и сложности изделия. Рассчитывается индивидуально по чертежу.',
  },
  {
    question: 'Какие документы нужны для заказа?',
    answer: 'Достаточно чертежа или эскиза с указанием размеров, углов и радиусов гибки. Принимаем файлы DXF, DWG, PDF.',
  },
  {
    question: 'Можно ли гнуть материал заказчика?',
    answer: 'Да, принимаем давальческий материал. Проверяем качество и соответствие техническим требованиям.',
  },
  {
    question: 'Какие сроки выполнения заказа?',
    answer: 'Стандартный срок — 1-3 рабочих дня. Срочные заказы выполняем в течение дня.',
  },
]

export default function GibkaPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Услуги', href: '/services' },
              { label: 'Гибка металла' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Гибка металла
                </h1>
                <p className="text-gray-600">Профессиональная металлообработка</p>
              </div>
            </div>

            <TLDRBlock
              content="Услуги гибки металла: листогибочный пресс с ЧПУ, вальцовка, гибка профиля и труб. Толщина до 20 мм, длина до 6 м, точность ±0.5°."
            />
          </div>
        </div>
      </section>

      {/* Bending Types */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Виды гибки металла
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {bendingTypes.map((type) => (
              <div
                key={type.title}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <div className="flex items-center gap-2 text-sm text-orange-600 font-medium mb-3">
                  <span>{type.specs}</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Подходит для:</p>
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

      {/* Applications */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Применение гибки
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Изготовление кровельных элементов',
                'Производство вентиляционных коробов',
                'Корпуса и кожухи оборудования',
                'Элементы металлоконструкций',
                'Ограждения и перила',
                'Стеллажи и полки',
                'Фасадные кассеты',
                'Рекламные конструкции',
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
              Частые вопросы о гибке металла
            </h2>
            <FAQBlock items={faqItems} />
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна гибка металла?"
        description="Отправьте чертеж для расчета стоимости и сроков"
        primaryButton={{ text: 'Заказать гибку', href: '/zakaz' }}
        secondaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
      />
    </div>
  )
}
