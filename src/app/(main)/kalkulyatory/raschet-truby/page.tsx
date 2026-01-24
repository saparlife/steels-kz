import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { MetalWeightCalculator } from '@/components/calculators/MetalWeightCalculator'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Расчет веса трубы онлайн - Калькулятор трубы',
  description: 'Онлайн калькулятор веса трубы. Расчет массы круглой и профильной трубы по размерам. Точный расчет в кг.',
}

export default function PipeCalculatorPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Калькуляторы', href: '/kalkulyatory' },
              { label: 'Расчет трубы' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Калькулятор веса трубы
            </h1>
            <TLDRBlock
              content="Расчет веса круглой и профильной трубы по размерам. Введите диаметр, толщину стенки и длину — получите массу в килограммах."
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MetalWeightCalculator />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Популярные размеры труб
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Труба 57×3.5</span>
                    <span className="text-gray-900 font-medium">4.62 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Труба 76×3.5</span>
                    <span className="text-gray-900 font-medium">6.26 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Труба 89×4.0</span>
                    <span className="text-gray-900 font-medium">8.38 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Труба 108×4.0</span>
                    <span className="text-gray-900 font-medium">10.26 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Профтруба 40×20×2</span>
                    <span className="text-gray-900 font-medium">1.78 кг/м</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Профтруба 60×40×3</span>
                    <span className="text-gray-900 font-medium">4.30 кг/м</span>
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Купить трубу
                </h3>
                <p className="text-orange-800 text-sm mb-4">
                  Широкий ассортимент труб на складе
                </p>
                <Link
                  href="/katalog/truby"
                  className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Смотреть каталог труб
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужна труба?"
        description="Оставьте заявку и получите лучшую цену на трубы"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Все калькуляторы', href: '/kalkulyatory' }}
        variant="orange"
      />
    </div>
  )
}
