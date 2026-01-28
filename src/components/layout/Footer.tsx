'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Category {
  id: string
  slug: string
  name_ru: string
  level: number
}

export function Footer() {
  const t = useTranslations('footer')
  const tCommon = useTranslations('common')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/categories?limit=5')
      .then((res) => res.json())
      .then((data) => {
        const cats = data?.categories || data || []
        // Берем только корневые категории (level = 0)
        const rootCats = cats.filter((c: Category) => c.level === 0).slice(0, 5)
        setCategories(rootCats)
      })
      .catch(console.error)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="text-2xl font-bold text-white mb-4">
              ТЕМИР<span className="text-orange-500">СЕРВИС</span>
            </div>
            <p className="text-sm mb-4">
              Крупнейший поставщик металлопроката в Казахстане
            </p>
            <div className="space-y-2 text-sm">
              <a href="tel:+77001618767" className="flex items-center gap-2 hover:text-orange-400">
                <Phone className="w-4 h-4" />
                +7 (700) 161-87-67
              </a>
              <a href="mailto:sale@temir-service.kz" className="flex items-center gap-2 hover:text-orange-400">
                <Mail className="w-4 h-4" />
                sale@temir-service.kz
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                г. Алматы, Проспект Райымбека, 221а/4
              </p>
            </div>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('company')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-orange-400">{tCommon('about')}</Link></li>
              <li><Link href="/services" className="hover:text-orange-400">{tCommon('services')}</Link></li>
              <li><Link href="/delivery" className="hover:text-orange-400">{tCommon('delivery')}</Link></li>
              <li><Link href="/news" className="hover:text-orange-400">{tCommon('news')}</Link></li>
              <li><Link href="/contacts" className="hover:text-orange-400">{tCommon('contacts')}</Link></li>
            </ul>
          </div>

          {/* Catalog links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('catalog')}</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/katalog/${cat.slug}`} className="hover:text-orange-400">
                    {cat.name_ru}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/katalog" className="hover:text-orange-400 font-medium">
                  {tCommon('allCategories')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Info links */}
          <div>
            <h3 className="font-semibold text-white mb-4">{t('info')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-orange-400">{t('privacy')}</Link></li>
              <li><Link href="/faq" className="hover:text-orange-400">FAQ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm">
            © {currentYear} Темир Сервис Казахстан. {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
