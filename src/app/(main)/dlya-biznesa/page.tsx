import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { LeadForm } from '@/components/blocks/LeadForm'
import { FAQBlock } from '@/components/blocks/FAQBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { Building2, Factory, HardHat, Warehouse, Wrench, Truck } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Металлопрокат для бизнеса - Темир Сервис Казахстан',
  description: 'Комплексные поставки металлопроката для строительных компаний, производств и предприятий. Договорные отношения, отсрочка, сертификаты.',
}

const industries = [
  {
    icon: Building2,
    title: 'Строительство',
    description: 'Арматура, балки, швеллеры для жилого и коммерческого строительства',
    products: ['Арматура', 'Балка', 'Швеллер', 'Профлист'],
  },
  {
    icon: Factory,
    title: 'Производство',
    description: 'Листовой прокат, трубы для машиностроения и металлообработки',
    products: ['Лист г/к', 'Лист х/к', 'Труба', 'Круг'],
  },
  {
    icon: HardHat,
    title: 'Инфраструктура',
    description: 'Металлоконструкции для мостов, эстакад, промышленных объектов',
    products: ['Балка', 'Швеллер', 'Уголок', 'Труба'],
  },
  {
    icon: Warehouse,
    title: 'Логистика',
    description: 'Металлоконструкции для складов, ангаров, терминалов',
    products: ['Профлист', 'Профтруба', 'Сэндвич-панели'],
  },
  {
    icon: Wrench,
    title: 'Ремонт и обслуживание',
    description: 'Металлопрокат для ремонтных и эксплуатационных нужд',
    products: ['Уголок', 'Полоса', 'Круг', 'Труба'],
  },
  {
    icon: Truck,
    title: 'Транспорт',
    description: 'Металлопрокат для автосервисов и транспортных предприятий',
    products: ['Лист', 'Труба', 'Круг', 'Полоса'],
  },
]

const faqItems = [
  {
    question: 'Как заключить договор поставки?',
    answer: 'Для заключения договора отправьте заявку с реквизитами компании. Наш юрист подготовит договор и отправит на согласование в течение 1 рабочего дня.',
  },
  {
    question: 'Предоставляете ли вы сертификаты качества?',
    answer: 'Да, на всю продукцию предоставляются сертификаты соответствия, паспорта качества и другие необходимые документы.',
  },
  {
    question: 'Можно ли получить накладные в электронном виде?',
    answer: 'Да, мы работаем с электронным документооборотом и можем отправлять документы через ИС ЭСФ, 1С, Email.',
  },
  {
    question: 'Как организована доставка на объект?',
    answer: 'Доставляем собственным автотранспортом или привлекаем надежных перевозчиков. Есть манипуляторы для разгрузки на объекте.',
  },
]

export default function DlyaBiznesaPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Для бизнеса' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Металлопрокат для вашего бизнеса
            </h1>
            <TLDRBlock
              content="Комплексные поставки металлопроката для любых отраслей. Договорные отношения, электронный документооборот, сертификаты на всю продукцию, доставка на объект."
            />
          </div>

          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Работаем со строительными компаниями, производственными предприятиями,
            государственными организациями. Обеспечиваем полный цикл поставки —
            от консультации до доставки на объект.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Решения для разных отраслей
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {industries.map((industry) => (
              <div
                key={industry.title}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <industry.icon className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {industry.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{industry.description}</p>
                <div className="flex flex-wrap gap-2">
                  {industry.products.map((product) => (
                    <span
                      key={product}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Как мы работаем с бизнесом
              </h2>
              <ol className="space-y-4">
                {[
                  { step: '1', text: 'Заявка на поставку — опишите потребности' },
                  { step: '2', text: 'Коммерческое предложение — получите расчет' },
                  { step: '3', text: 'Договор — согласуем условия' },
                  { step: '4', text: 'Поставка — доставка на объект в срок' },
                  { step: '5', text: 'Документы — полный пакет для бухгалтерии' },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {item.step}
                    </span>
                    <span className="text-gray-700 pt-1">{item.text}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Также доступно:</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/opt" className="text-orange-500 hover:text-orange-600">
                      Оптовые поставки со скидкой до 15%
                    </Link>
                  </li>
                  <li>
                    <Link href="/partneram" className="text-orange-500 hover:text-orange-600">
                      Партнерская программа для дилеров
                    </Link>
                  </li>
                  <li>
                    <Link href="/uslugi" className="text-orange-500 hover:text-orange-600">
                      Услуги резки, гибки, сварки
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <LeadForm
                type="business"
                title="Заявка для бизнеса"
                description="Расскажите о потребностях вашей компании"
                showEmail
                showCompany
                showMessage
                buttonText="Отправить заявку"
                sourcePage="/dlya-biznesa"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <FAQBlock items={faqItems} />
      </div>

      <CTABlock
        title="Нужна консультация?"
        description="Наши специалисты помогут подобрать оптимальное решение для вашего бизнеса"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
