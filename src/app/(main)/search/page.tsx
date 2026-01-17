import { ProductGrid } from '@/components/catalog/ProductGrid'
import { Pagination } from '@/components/ui/Pagination'
import { type Locale } from '@/i18n/config'
import { createClient } from '@/lib/supabase/server'
import type { Category, Product } from '@/types/database'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

interface ProductImage {
  id: string
  url: string
  is_primary: boolean
  sort_order: number
}

interface ProductWithImages extends Product {
  categories: Category | null
  product_images: ProductImage[]
}

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

const PRODUCTS_PER_PAGE = 24

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Поиск: ${q} - Сталь Сервис` : 'Поиск - Сталь Сервис',
    description: `Результаты поиска по запросу "${q}" в каталоге металлопроката`,
  }
}

async function searchProducts(query: string, page: number) {
  if (!query.trim()) {
    return { products: [], total: 0, totalPages: 0 }
  }

  const supabase = await createClient()

  const from = (page - 1) * PRODUCTS_PER_PAGE
  const to = from + PRODUCTS_PER_PAGE - 1

  const { data, count, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name_ru, slug),
      product_images (id, url, is_primary, sort_order)
    `, { count: 'exact' })
    .eq('is_active', true)
    .or(`name_ru.ilike.%${query}%,name_kz.ilike.%${query}%,sku.ilike.%${query}%`)
    .order('views_count', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Search error:', error)
    return { products: [], total: 0, totalPages: 0 }
  }

  return {
    products: (data || []) as ProductWithImages[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / PRODUCTS_PER_PAGE),
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page } = await searchParams
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()

  const query = q || ''
  const currentPage = Number(page) || 1

  const { products, total, totalPages } = await searchProducts(query, currentPage)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {query ? (
            <>
              Результаты поиска: <span className="text-orange-500">"{query}"</span>
            </>
          ) : (
            'Поиск'
          )}
        </h1>
        {query && (
          <p className="text-gray-600">
            {total > 0 ? (
              <>Найдено {total} {t('common.products')}</>
            ) : (
              'Ничего не найдено'
            )}
          </p>
        )}
      </div>

      {/* Search form */}
      <form method="GET" className="mb-8">
        <div className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Введите название товара, артикул или марку стали..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Найти
          </button>
        </div>
      </form>

      {/* Results */}
      {!query ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Введите запрос для поиска товаров
          </p>
          <p className="text-gray-400 mt-2">
            Например: арматура, труба 100мм, лист горячекатаный
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-900 text-xl font-semibold mb-2">
            По запросу "{query}" ничего не найдено
          </p>
          <p className="text-gray-500 mb-6">
            Попробуйте изменить запрос или просмотрите каталог
          </p>
          <Link
            href="/katalog"
            className="inline-flex px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <ProductGrid products={products} locale={locale} />

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl="/search"
                searchParams={{ q: query }}
              />
            </div>
          )}
        </>
      )}

      {/* Popular categories */}
      {!query && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Популярные категории
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Арматура', slug: 'armatura' },
              { name: 'Трубы', slug: 'truby' },
              { name: 'Листовой прокат', slug: 'listovoy-prokat' },
              { name: 'Балки', slug: 'balki' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/katalog/${cat.slug}`}
                className="p-4 bg-gray-50 rounded-lg hover:bg-orange-50 hover:text-orange-500 transition-colors text-center font-medium"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
