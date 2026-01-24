import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { MetalWeightCalculator } from '@/components/calculators/MetalWeightCalculator'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Расчет веса листа металла онлайн - Калькулятор листа',
  description: 'Онлайн калькулятор веса листового металла. Расчет массы листа по толщине, ширине и длине.',
}

export default function SheetCalculatorPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Калькуляторы', href: '/kalkulyatory' },
              { label: 'Расчет листа' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Калькулятор веса листа
            </h1>
            <TLDRBlock
              content="Расчет веса листового металла по размерам. Введите толщину, ширину и длину листа — получите массу в килограммах."
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MetalWeightCalculator />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Вес листа 1000×2000 мм
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Лист 1.0 мм</span>
                    <span className="text-gray-900 font-medium">15.7 кг</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Лист 1.5 мм</span>
                    <span className="text-gray-900 font-medium">23.55 кг</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Лист 2.0 мм</span>
                    <span className="text-gray-900 font-medium">31.4 кг</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Лист 3.0 мм</span>
                    <span className="text-gray-900 font-medium">47.1 кг</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Лист 4.0 мм</span>
                    <span className="text-gray-900 font-medium">62.8 кг</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Лист 5.0 мм</span>
                    <span className="text-gray-900 font-medium">78.5 кг</span>
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Купить листовой прокат
                </h3>
                <p className="text-orange-800 text-sm mb-4">
                  Горячекатаный, холоднокатаный, оцинкованный лист
                </p>
                <Link
                  href="/katalog/listovoy-prokat"
                  className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Смотреть каталог
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABlock
        title="Нужен листовой прокат?"
        description="Оставьте заявку и получите лучшую цену"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Все калькуляторы', href: '/kalkulyatory' }}
        variant="orange"
      />
    </div>
  )
}
