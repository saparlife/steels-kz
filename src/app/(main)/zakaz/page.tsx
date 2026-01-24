import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LeadForm } from '@/components/blocks/LeadForm'
import { TrustBlock } from '@/components/blocks/TrustBlock'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { ClipboardList, Package, Truck, CreditCard } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Оформить заказ на металлопрокат - Сталь Сервис Казахстан',
  description: 'Оформите заказ на металлопрокат онлайн. Быстрая обработка заявок, доставка по Казахстану. Оплата удобным способом.',
}

const steps = [
  {
    icon: ClipboardList,
    step: '1',
    title: 'Оформите заявку',
    description: 'Заполните форму заказа или позвоните нам',
  },
  {
    icon: Package,
    step: '2',
    title: 'Подтверждение',
    description: 'Менеджер свяжется для уточнения деталей',
  },
  {
    icon: CreditCard,
    step: '3',
    title: 'Оплата',
    description: 'Выберите удобный способ оплаты',
  },
  {
    icon: Truck,
    step: '4',
    title: 'Доставка',
    description: 'Получите заказ в оговоренные сроки',
  },
]

const faqItems = [
  {
    question: 'Какой минимальный объем заказа?',
    answer: 'Минимальный объем заказа отсутствует. Мы работаем как с крупными оптовыми заказами, так и с небольшими розничными партиями.',
  },
  {
    question: 'Можно ли забрать заказ самовывозом?',
    answer: 'Да, самовывоз доступен со всех наших складов. При оформлении заказа укажите желаемый склад для самовывоза.',
  },
  {
    question: 'Какие сроки доставки?',
    answer: 'Сроки доставки зависят от города: Алматы и Астана — 1-2 дня, другие города Казахстана — 3-7 дней.',
  },
  {
    question: 'Можно ли оплатить заказ частями?',
    answer: 'Для постоянных клиентов и крупных заказов мы предлагаем рассрочку и отсрочку платежа. Уточните условия у менеджера.',
  },
]

export default function ZakazPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Оформить заказ' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Оформить заказ
            </h1>
            <p className="text-lg text-gray-600">
              Закажите металлопрокат с доставкой по Казахстану. Мы гарантируем
              качество продукции и соблюдение сроков доставки.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <item.icon className="w-8 h-8 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 rounded-full text-white text-sm flex items-center justify-center font-bold">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto">
            <LeadForm
              type="order"
              title="Оформление заказа"
              description="Опишите ваш заказ, и мы свяжемся для уточнения деталей"
              showEmail
              showCompany
              showMessage
              buttonText="Отправить заказ"
              sourcePage="/zakaz"
            />
          </div>
        </div>
      </section>

      <TrustBlock showFeatures={true} certificates={[]} />

      <div className="container mx-auto px-4">
        <FAQBlock items={faqItems} />
      </div>
    </div>
  )
}
