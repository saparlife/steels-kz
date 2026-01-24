import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { Calculator, Scale, Cylinder, Square, CircleDot } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Калькуляторы металлопроката - Расчет веса и стоимости',
  description: 'Онлайн калькуляторы для расчета веса металлопроката. Расчет веса трубы, листа, арматуры, уголка. Бесплатно и без регистрации.',
}

const calculators = [
  {
    icon: Scale,
    title: 'Калькулятор веса металла',
    description: 'Универсальный калькулятор для расчета веса любого металлопроката',
    href: '/kalkulyatory/ves-metalla',
    features: ['Лист', 'Круг', 'Труба', 'Уголок', 'Швеллер'],
  },
  {
    icon: Cylinder,
    title: 'Расчет трубы',
    description: 'Калькулятор веса круглой и профильной трубы',
    href: '/kalkulyatory/raschet-truby',
    features: ['Круглая труба', 'Профильная труба', 'Водогазопроводная'],
  },
  {
    icon: Square,
    title: 'Расчет листа',
    description: 'Калькулятор веса листового проката',
    href: '/kalkulyatory/raschet-lista',
    features: ['Горячекатаный', 'Холоднокатаный', 'Оцинкованный'],
  },
  {
    icon: CircleDot,
    title: 'Расчет арматуры',
    description: 'Калькулятор веса строительной арматуры',
    href: '/kalkulyatory/raschet-armatury',
    features: ['A400', 'A500', 'A240'],
  },
]

export default function CalculatorsPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Калькуляторы' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Калькуляторы металлопроката
            </h1>
            <TLDRBlock
              content="Онлайн калькуляторы для расчета веса металлопроката. Быстрый расчет массы трубы, листа, арматуры и другого проката. Бесплатно и без регистрации."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {calculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <calc.icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {calc.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{calc.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {calc.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-4">
              <Calculator className="w-8 h-8 text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Как пользоваться калькуляторами
                </h3>
                <ol className="text-gray-600 space-y-2">
                  <li>1. Выберите тип проката (труба, лист, арматура и т.д.)</li>
                  <li>2. Введите размеры (диаметр, толщина, длина)</li>
                  <li>3. Укажите количество</li>
                  <li>4. Получите результат расчета веса</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
