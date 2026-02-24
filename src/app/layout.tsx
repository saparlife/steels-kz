import { type Locale } from '@/i18n/config'
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
    default: 'Темир Сервис Казахстан - Металлопрокат в Казахстане',
    template: '%s | Темир Сервис',
  },
  description: 'Крупнейший поставщик металлопроката в Казахстане. Черный, цветной, нержавеющий металлопрокат. Трубы, листы, арматура. Доставка по всему Казахстану.',
  keywords: ['металлопрокат', 'сталь', 'трубы', 'листовой прокат', 'арматура', 'Казахстан', 'Алматы'],
  authors: [{ name: 'Темир Сервис' }],
  creator: 'Темир Сервис Казахстан',
  publisher: 'Темир Сервис Казахстан',
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
    siteName: 'Темир Сервис Казахстан',
    title: 'Темир Сервис Казахстан - Металлопрокат в Казахстане',
    description: 'Крупнейший поставщик металлопроката в Казахстане',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Темир Сервис Казахстан',
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PEK7GCC8T0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PEK7GCC8T0');
          `}
        </Script>
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MFLSC42D');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MFLSC42D"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
