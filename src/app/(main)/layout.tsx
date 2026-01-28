import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { ComparisonProvider, ComparisonWidget } from '@/components/comparison'
import { FloatingButtons } from '@/components/ui/FloatingButtons'
import { defaultLocale, type Locale } from '@/i18n/config'
import { getLocale } from 'next-intl/server'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale() as Locale

  return (
    <ComparisonProvider>
      <div className="flex flex-col min-h-screen">
        <OrganizationSchema />
        <Header locale={locale || defaultLocale} />
        <main className="flex-1">{children}</main>
        <Footer />
        <ComparisonWidget />
        <FloatingButtons />
      </div>
    </ComparisonProvider>
  )
}
