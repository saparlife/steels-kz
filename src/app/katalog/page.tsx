import { CategoryGrid } from '@/components/catalog/CategoryGrid'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { type Locale } from '@/i18n/config'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Каталог продукции',
  description: 'Полный каталог металлопроката. Черный, цветной, нержавеющий металлопрокат. Трубы, листы, арматура и многое другое.',
}

async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order')

  return data || []
}

export default async function CatalogPage() {
  const locale = await getLocale() as Locale
  const t = await getTranslations('catalog')
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: t('breadcrumb') },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-8">
        {t('title')}
      </h1>

      <CategoryGrid categories={categories} locale={locale} />
    </div>
  )
}
