import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ type: string }>
}

const typeConfig: Record<string, { title: string; description: string }> = {
  'price-request': {
    title: 'Заявка на расчёт цены отправлена',
    description: 'Наш менеджер свяжется с вами в ближайшее время для уточнения деталей и расчёта стоимости.',
  },
  'order': {
    title: 'Заказ оформлен',
    description: 'Наш менеджер свяжется с вами для подтверждения заказа и уточнения деталей доставки.',
  },
  'wholesale': {
    title: 'Заявка на оптовую поставку отправлена',
    description: 'Наш менеджер по работе с оптовыми клиентами свяжется с вами в ближайшее время.',
  },
  'business': {
    title: 'Заявка для бизнеса отправлена',
    description: 'Наш менеджер свяжется с вами для обсуждения условий сотрудничества.',
  },
  'partner': {
    title: 'Заявка на партнёрство отправлена',
    description: 'Мы рассмотрим вашу заявку и свяжемся с вами в ближайшее время.',
  },
  'callback': {
    title: 'Заявка на звонок отправлена',
    description: 'Наш менеджер перезвонит вам в ближайшее время.',
  },
  'default': {
    title: 'Заявка отправлена',
    description: 'Наш менеджер свяжется с вами в ближайшее время.',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const config = typeConfig[type] || typeConfig['default']

  return {
    title: config.title,
    robots: { index: false, follow: false },
  }
}

export default async function ThankYouPage({ params }: Props) {
  const { type } = await params
  const config = typeConfig[type] || typeConfig['default']

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 md:p-12">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />

          <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-4">
            {config.title}
          </h1>

          <p className="text-green-700 mb-8 text-lg">
            {config.description}
          </p>

          <div className="space-y-4">
            <p className="text-gray-600">
              Если у вас есть срочные вопросы, звоните:
            </p>
            <a
              href="tel:+77001618767"
              className="inline-block text-2xl font-bold text-orange-500 hover:text-orange-600"
            >
              +7 (700) 161-87-67
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-green-200">
            <Link href="/katalog">
              <Button variant="primary" size="lg">
                Продолжить покупки
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
