import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { defaultLocale, type Locale } from '@/i18n/config'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f97316',
}

export const metadata: Metadata = {
  title: {
    default: 'Сталь Сервис Казахстан - Металлопрокат в Казахстане',
    template: '%s | Сталь Сервис',
  },
  description: 'Крупнейший поставщик металлопроката в Казахстане. Черный, цветной, нержавеющий металлопрокат. Трубы, листы, арматура. Доставка по всему Казахстану.',
  keywords: ['металлопрокат', 'сталь', 'трубы', 'листовой прокат', 'арматура', 'Казахстан', 'Алматы'],
  authors: [{ name: 'Сталь Сервис' }],
  creator: 'Сталь Сервис Казахстан',
  publisher: 'Сталь Сервис Казахстан',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'ru': '/ru',
      'kk': '/kz',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_KZ',
    alternateLocale: 'kk_KZ',
    siteName: 'Сталь Сервис Казахстан',
    title: 'Сталь Сервис Казахстан - Металлопрокат в Казахстане',
    description: 'Крупнейший поставщик металлопроката в Казахстане',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Сталь Сервис Казахстан',
    description: 'Крупнейший поставщик металлопроката в Казахстане',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale() as Locale
  const messages = await getMessages()

  return (
    <html lang={locale === 'kz' ? 'kk' : 'ru'} className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <div className="flex flex-col min-h-screen">
            <Header locale={locale || defaultLocale} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
