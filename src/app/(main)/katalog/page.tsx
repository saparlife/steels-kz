import { CategoryGrid } from '@/components/catalog/CategoryGrid'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { type Locale } from '@/i18n/config'
import { createClient } from '@/lib/supabase/server'
import type { Category, Page } from '@/types/database'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'

async function getCatalogData() {
  const supabase = await createClient()

  const [categoriesRes, pageRes] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('pages')
      .select('*')
      .eq('slug', 'katalog')
      .single(),
  ])

  return {
    categories: (categoriesRes.data || []) as Category[],
    page: (pageRes.data || null) as Page | null,
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'katalog')
    .single()

  const page = data as Page | null

  return {
    title: page?.meta_title_ru || 'Каталог продукции',
    description: page?.meta_description_ru || 'Полный каталог металлопроката. Черный, цветной, нержавеющий металлопрокат. Трубы, листы, арматура и многое другое.',
  }
}

export default async function CatalogPage() {
  const locale = await getLocale() as Locale
  const t = await getTranslations('catalog')
  const { categories, page } = await getCatalogData()

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

      {/* SEO content */}
      {page?.content_ru && (
        <div className="mt-12 prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: page.content_ru }} />
        </div>
      )}
    </div>
  )
}
