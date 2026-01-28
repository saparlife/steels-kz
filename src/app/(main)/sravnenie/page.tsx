import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ComparisonTable } from '@/components/comparison'
import { CTABlock } from '@/components/blocks/CTABlock'
import { Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Сравнение товаров - Темир Сервис Казахстан',
  description: 'Сравните характеристики выбранных товаров металлопроката для выбора оптимального варианта.',
}

// Common attribute labels for comparison table
const attributeLabels: Record<string, string> = {
  thickness: 'Толщина, мм',
  width: 'Ширина, мм',
  length: 'Длина, мм',
  diameter: 'Диаметр, мм',
  wall_thickness: 'Толщина стенки, мм',
  weight: 'Вес, кг/м',
  steel_grade: 'Марка стали',
  gost: 'ГОСТ',
  surface: 'Поверхность',
  coating: 'Покрытие',
}

export default function ComparisonPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Сравнение товаров' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center">
              <Scale className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Сравнение товаров
              </h1>
              <p className="text-gray-600">
                Сравните характеристики выбранных товаров
              </p>
            </div>
          </div>

          <ComparisonTable attributeLabels={attributeLabels} />
        </div>
      </section>

      <CTABlock
        title="Нужна помощь с выбором?"
        description="Наши специалисты помогут подобрать оптимальный вариант для вашего проекта"
        primaryButton={{ text: 'Получить консультацию', href: '/uznat-cenu' }}
        secondaryButton={{ text: 'Перейти в каталог', href: '/katalog' }}
      />
    </div>
  )
}
