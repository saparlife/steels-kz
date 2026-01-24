import { Award, CheckCircle, Shield, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface Certificate {
  id: string
  title: string
  image_url?: string
}

interface TrustBlockProps {
  title?: string
  certificates?: Certificate[]
  showFeatures?: boolean
  className?: string
}

const features = [
  {
    icon: Shield,
    title: 'Гарантия качества',
    description: 'Вся продукция сертифицирована и соответствует ГОСТ',
  },
  {
    icon: Truck,
    title: 'Быстрая доставка',
    description: 'Доставка по Казахстану от 1 дня',
  },
  {
    icon: CheckCircle,
    title: '15+ лет опыта',
    description: 'Надежный поставщик металлопроката',
  },
  {
    icon: Award,
    title: 'Лучшие цены',
    description: 'Работаем напрямую с заводами',
  },
]

export function TrustBlock({
  title = 'Почему выбирают нас',
  certificates = [],
  showFeatures = true,
  className = '',
}: TrustBlockProps) {
  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{title}</h2>

        {showFeatures && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        )}

        {certificates.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-8">
              Наши сертификаты
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="aspect-[3/4] bg-white rounded-xl shadow-sm overflow-hidden flex items-center justify-center"
                >
                  {cert.image_url ? (
                    <Image
                      src={cert.image_url}
                      alt={cert.title}
                      width={200}
                      height={280}
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <Award className="w-16 h-16 text-gray-300" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/sertifikaty-i-dokumenty"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Все сертификаты и документы
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
