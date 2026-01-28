import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { FileText, Scale, BookOpen, Ruler } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Справочник металлопроката - Темир Сервис Казахстан',
  description: 'Справочные материалы по металлопрокату: ГОСТ, марки стали, характеристики материалов. Полезная информация для специалистов.',
}

const sections = [
  {
    icon: FileText,
    title: 'ГОСТ',
    description: 'Государственные стандарты на металлопрокат, нормативные требования',
    href: '/data/gost',
    count: 'Стандарты',
  },
  {
    icon: Scale,
    title: 'Марки стали',
    description: 'Химический состав, механические свойства, применение марок стали',
    href: '/data/marki-stali',
    count: 'Марки',
  },
  {
    icon: BookOpen,
    title: 'Материалы',
    description: 'Справочная информация по материалам: характеристики, применение',
    href: '/data/materialy',
    count: 'Материалы',
  },
  {
    icon: Ruler,
    title: 'Калькуляторы',
    description: 'Расчет веса, объема и стоимости металлопроката',
    href: '/kalkulyatory',
    count: 'Инструменты',
  },
]

export default function DataPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Справочник' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Справочник металлопроката
            </h1>
            <p className="text-lg text-gray-600">
              Полезные справочные материалы для специалистов: государственные стандарты,
              характеристики марок стали, калькуляторы расчета веса и стоимости.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 mb-3">{section.description}</p>
                    <span className="text-sm text-orange-500 font-medium">
                      {section.count} &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Link
              href="/glossary"
              className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Глоссарий</h3>
              <p className="text-sm text-gray-600">Термины и определения</p>
            </Link>
            <Link
              href="/guides"
              className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Гайды</h3>
              <p className="text-sm text-gray-600">Полезные руководства</p>
            </Link>
            <Link
              href="/faq"
              className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
              <p className="text-sm text-gray-600">Частые вопросы</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
