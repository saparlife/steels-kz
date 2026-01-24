import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { MetalWeightCalculator } from '@/components/calculators/MetalWeightCalculator'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Расчет веса арматуры онлайн - Калькулятор арматуры',
  description: 'Онлайн калькулятор веса арматуры. Расчет массы арматуры A400, A500 по диаметру и длине.',
}

export default function RebarCalculatorPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Калькуляторы', href: '/kalkulyatory' },
              { label: 'Расчет арматуры' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Калькулятор веса арматуры
            </h1>
            <TLDRBlock
              content="Расчет веса строительной арматуры по диаметру и длине. Таблица веса арматуры по ГОСТ для классов A400, A500, A240."
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MetalWeightCalculator />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Вес арматуры по ГОСТ (кг/м)
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 6 мм</span>
                    <span className="text-gray-900 font-medium">0.222 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 8 мм</span>
                    <span className="text-gray-900 font-medium">0.395 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 10 мм</span>
                    <span className="text-gray-900 font-medium">0.617 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 12 мм</span>
                    <span className="text-gray-900 font-medium">0.888 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 14 мм</span>
                    <span className="text-gray-900 font-medium">1.21 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 16 мм</span>
                    <span className="text-gray-900 font-medium">1.58 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 20 мм</span>
                    <span className="text-gray-900 font-medium">2.47 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Арматура 25 мм</span>
                    <span className="text-gray-900 font-medium">3.85 кг/м</span>
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Купить арматуру
                </h3>
                <p className="text-orange-800 text-sm mb-4">
                  Арматура A400, A500 всех диаметров в наличии
                </p>
                <Link
                  href="/katalog/armatura"
                  className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Смотреть каталог
                </Link>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Калькулятор количества
                </h3>
                <p className="text-blue-800 text-sm">
                  Для расчета количества арматуры на фундамент или плиту
                  обратитесь к нашим специалистам
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна арматура?"
        description="Оставьте заявку и получите лучшую цену на арматуру"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Все калькуляторы', href: '/kalkulyatory' }}
        variant="orange"
      />
    </div>
  )
}
