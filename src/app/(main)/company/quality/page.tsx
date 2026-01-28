import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { Shield, CheckCircle, FileCheck, Award, Microscope } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Гарантия качества - Темир Сервис Казахстан',
  description: 'Система контроля качества металлопроката. Сертификаты, входной контроль, паспорта качества на продукцию.',
}

const qualitySteps = [
  {
    icon: FileCheck,
    title: 'Проверка поставщиков',
    description: 'Работаем только с проверенными производителями, имеющими все необходимые сертификаты и лицензии.',
  },
  {
    icon: Microscope,
    title: 'Входной контроль',
    description: 'Каждая партия проходит входной контроль: проверка размеров, маркировки, сопроводительной документации.',
  },
  {
    icon: CheckCircle,
    title: 'Хранение на складе',
    description: 'Соблюдаем условия хранения металлопроката: защита от влаги, правильная укладка, маркировка.',
  },
  {
    icon: Award,
    title: 'Документы качества',
    description: 'Предоставляем сертификаты соответствия и паспорта качества на всю отгружаемую продукцию.',
  },
]

const guarantees = [
  'Соответствие ГОСТ и техническим условиям',
  'Сертификаты на всю продукцию',
  'Гарантия на сохранность при доставке',
  'Возврат и обмен в случае брака',
  'Входной контроль каждой партии',
  'Паспорта качества от производителей',
]

export default function QualityPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'О компании', href: '/about' },
              { label: 'Гарантия качества' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Гарантия качества
            </h1>
            <TLDRBlock
              content="Многоуровневая система контроля качества. Работаем только с проверенными производителями, проводим входной контроль, предоставляем все документы на продукцию."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {qualitySteps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center relative">
                    <step.icon className="w-6 h-6 text-orange-500" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Наши гарантии</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {guarantees.map((guarantee) => (
                <div key={guarantee} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{guarantee}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/sertifikaty-i-dokumenty"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Смотреть сертификаты
            </Link>
          </div>
        </div>
      </section>

      <CTABlock
        title="Остались вопросы о качестве?"
        description="Свяжитесь с нами для получения дополнительной информации"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        secondaryButton={{ text: 'Документы', href: '/sertifikaty-i-dokumenty' }}
      />
    </div>
  )
}
