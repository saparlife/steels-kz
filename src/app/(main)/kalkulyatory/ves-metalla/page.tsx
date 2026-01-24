import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { MetalWeightCalculator } from '@/components/calculators/MetalWeightCalculator'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Калькулятор веса металла онлайн - Расчет массы металлопроката',
  description: 'Онлайн калькулятор веса металла. Расчет массы листа, трубы, круга, уголка, швеллера. Быстро и точно.',
}

const faqItems = [
  {
    question: 'Как рассчитывается вес металла?',
    answer: 'Вес металла рассчитывается по формуле: Объем × Плотность. Объем зависит от формы профиля (лист, труба, круг и т.д.). Плотность стали принимается равной 7850 кг/м³.',
  },
  {
    question: 'Насколько точен расчет?',
    answer: 'Калькулятор дает теоретический вес с точностью до 2-3%. Фактический вес может отличаться из-за допусков ГОСТ на размеры проката.',
  },
  {
    question: 'Можно ли рассчитать вес нержавеющей стали?',
    answer: 'Калькулятор рассчитывает вес углеродистой стали (плотность 7850 кг/м³). Для нержавеющей стали результат умножьте на 1.01-1.02.',
  },
  {
    question: 'Как узнать точную стоимость?',
    answer: 'После расчета веса оставьте заявку на сайте или позвоните нам. Менеджер рассчитает точную стоимость с учетом актуальных цен и скидок.',
  },
]

export default function MetalWeightCalculatorPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Калькуляторы', href: '/kalkulyatory' },
              { label: 'Вес металла' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Калькулятор веса металла
            </h1>
            <TLDRBlock
              content="Онлайн калькулятор для расчета теоретического веса металлопроката. Поддерживает лист, круг, трубу, уголок и другие профили. Результат мгновенно."
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MetalWeightCalculator />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Формулы расчета
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><strong>Лист:</strong> Толщина × Ширина × Длина × 7.85</p>
                  <p><strong>Круг:</strong> π × (D/2)² × Длина × 7.85</p>
                  <p><strong>Труба:</strong> π × (D - S) × S × Длина × 7.85</p>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Нужен металлопрокат?
                </h3>
                <p className="text-orange-800 text-sm mb-4">
                  Рассчитайте вес и оставьте заявку на расчет стоимости
                </p>
                <Link
                  href="/uznat-cenu"
                  className="block w-full text-center px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Узнать цену
                </Link>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Другие калькуляторы
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/kalkulyatory/raschet-truby" className="text-orange-500 hover:text-orange-600">
                      Расчет трубы →
                    </Link>
                  </li>
                  <li>
                    <Link href="/kalkulyatory/raschet-lista" className="text-orange-500 hover:text-orange-600">
                      Расчет листа →
                    </Link>
                  </li>
                  <li>
                    <Link href="/kalkulyatory/raschet-armatury" className="text-orange-500 hover:text-orange-600">
                      Расчет арматуры →
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <FAQBlock items={faqItems} />
      </div>

      <CTABlock
        title="Рассчитали вес? Теперь узнайте цену!"
        description="Оставьте заявку и получите актуальную стоимость металлопроката"
        primaryButton={{ text: 'Узнать цену', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
        variant="orange"
      />
    </div>
  )
}
