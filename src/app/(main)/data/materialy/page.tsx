import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { Layers, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Материалы металлопроката - Справочник',
  description: 'Справочник по материалам металлопроката: сталь, нержавеющая сталь, оцинкованная сталь. Характеристики и применение.',
}

const materials = [
  {
    name: 'Углеродистая сталь',
    description: 'Основной материал для строительного металлопроката. Прочная, доступная, хорошо сваривается.',
    applications: ['Арматура', 'Балки', 'Швеллеры', 'Уголки', 'Трубы'],
    properties: { density: '7850 кг/м³', melting: '1500°C' },
  },
  {
    name: 'Нержавеющая сталь',
    description: 'Коррозионностойкая сталь с добавлением хрома. Для ответственных конструкций.',
    applications: ['Трубы', 'Листы', 'Профили', 'Крепеж'],
    properties: { density: '7900 кг/м³', melting: '1450°C' },
  },
  {
    name: 'Оцинкованная сталь',
    description: 'Сталь с защитным цинковым покрытием. Высокая коррозионная стойкость.',
    applications: ['Профлист', 'Трубы', 'Листы', 'Профили'],
    properties: { density: '7850 кг/м³', coating: 'до 275 г/м²' },
  },
  {
    name: 'Легированная сталь',
    description: 'Сталь с добавками для улучшения свойств. Повышенная прочность и износостойкость.',
    applications: ['Конструкции', 'Машиностроение', 'Инструмент'],
    properties: { density: '7850 кг/м³', strength: 'до 1500 МПа' },
  },
]

export default function MaterialsPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Справочник', href: '/data' },
              { label: 'Материалы' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Материалы металлопроката
            </h1>
            <TLDRBlock
              content="Основные материалы металлопроката: углеродистая, нержавеющая, оцинкованная и легированная сталь. Каждый материал имеет свои характеристики и область применения."
            />
          </div>

          <div className="space-y-6">
            {materials.map((material) => (
              <div
                key={material.name}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {material.name}
                    </h2>
                    <p className="text-gray-600">{material.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Применение</h3>
                    <div className="flex flex-wrap gap-2">
                      {material.applications.map((app) => (
                        <span
                          key={app}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Характеристики</h3>
                    <div className="space-y-1 text-sm">
                      {Object.entries(material.properties).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500 capitalize">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Полезные ссылки</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/data/marki-stali"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                Марки стали
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/data/gost"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                Стандарты ГОСТ
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kalkulyatory"
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600"
              >
                Калькуляторы
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
