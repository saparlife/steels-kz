import { CategoryGrid } from '@/components/catalog/CategoryGrid'
import { ProductFilters } from '@/components/catalog/ProductFilters'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { SortSelect } from '@/components/catalog/SortSelect'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Pagination } from '@/components/ui/Pagination'
import { type Locale } from '@/i18n/config'
import { createClient } from '@/lib/supabase/server'
import { getLocalizedField } from '@/lib/utils'
import type { AttributeDefinition, Category, Product } from '@/types/database'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

const PRODUCTS_PER_PAGE = 24

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getCategoryByPath(slugs: string[]) {
  const supabase = await createClient()

  // Slug in DB is full path like "chernyj-metalloprokat/kanat-stalnoj"
  const fullSlug = slugs.join('/')

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', fullSlug)
    .eq('is_active', true)
    .single()

  return data as Category | null
}

async function getCategoryPath(categoryId: string): Promise<Category[]> {
  const supabase = await createClient()
  const path: Category[] = []

  let currentId: string | null = categoryId

  while (currentId) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('*')
      .eq('id', currentId)
      .single()

    if (!categoryData) break

    const category = categoryData as Category
    path.unshift(category)
    currentId = category.parent_id
  }

  return path
}

async function getSubcategories(parentId: string): Promise<Category[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', parentId)
    .eq('is_active', true)
    .order('sort_order')

  return (data || []) as Category[]
}

async function getProducts(
  categoryId: string,
  page: number,
  sort: string,
  filters: Record<string, string>,
  rangeFilters: Record<string, { min?: string; max?: string }>
) {
  const supabase = await createClient()

  // Get descendant category IDs using path array (categories where this categoryId is in their path)
  const { data: descendantCats } = await supabase
    .from('categories')
    .select('id')
    .contains('path', [categoryId])

  const descendants = (descendantCats || []) as { id: string }[]
  const categoryIds = [categoryId, ...descendants.map(c => c.id)]

  // If we have attribute filters, we need to get product IDs that match
  let filteredProductIds: string[] | null = null

  const hasFilters = Object.keys(filters).length > 0 || Object.keys(rangeFilters).length > 0

  if (hasFilters) {
    // Get attribute definitions by slug
    const filterSlugs = [...Object.keys(filters), ...Object.keys(rangeFilters)]
    const { data: attrDefs } = await supabase
      .from('attribute_definitions')
      .select('id, slug')
      .in('slug', filterSlugs)

    const slugToAttrId = new Map((attrDefs || []).map(a => [a.slug, a.id]))

    // For each filter, get matching product IDs
    const matchingSets: Set<string>[] = []

    for (const [slug, values] of Object.entries(filters)) {
      const attrId = slugToAttrId.get(slug)
      if (!attrId) continue

      const valueList = values.split(',').filter(Boolean)
      if (valueList.length === 0) continue

      const { data: matches } = await supabase
        .from('product_attributes')
        .select('product_id')
        .eq('attribute_id', attrId)
        .in('value_text', valueList)

      if (matches) {
        matchingSets.push(new Set(matches.map(m => m.product_id)))
      }
    }

    for (const [slug, range] of Object.entries(rangeFilters)) {
      const attrId = slugToAttrId.get(slug)
      if (!attrId) continue

      let rangeQuery = supabase
        .from('product_attributes')
        .select('product_id')
        .eq('attribute_id', attrId)

      if (range.min) {
        rangeQuery = rangeQuery.gte('value_number', parseFloat(range.min))
      }
      if (range.max) {
        rangeQuery = rangeQuery.lte('value_number', parseFloat(range.max))
      }

      const { data: matches } = await rangeQuery

      if (matches) {
        matchingSets.push(new Set(matches.map(m => m.product_id)))
      }
    }

    // Intersect all matching sets
    if (matchingSets.length > 0) {
      filteredProductIds = Array.from(
        matchingSets.reduce((acc, set) => {
          return new Set([...acc].filter(id => set.has(id)))
        })
      )

      // If no products match the filters, return empty
      if (filteredProductIds.length === 0) {
        return { products: [], total: 0, totalPages: 0 }
      }
    }
  }

  // Build query
  let query = supabase
    .from('products')
    .select('*, product_images(id, url, is_primary, sort_order)', { count: 'exact' })
    .in('category_id', categoryIds)
    .eq('is_active', true)

  // Apply attribute filters if any
  if (filteredProductIds !== null) {
    query = query.in('id', filteredProductIds)
  }

  // Apply sorting
  switch (sort) {
    case 'name_asc':
      query = query.order('name_ru', { ascending: true })
      break
    case 'name_desc':
      query = query.order('name_ru', { ascending: false })
      break
    case 'price_asc':
      query = query.order('price', { ascending: true, nullsFirst: false })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false, nullsFirst: true })
      break
    case 'new':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('sort_order').order('views_count', { ascending: false })
  }

  // Pagination
  const from = (page - 1) * PRODUCTS_PER_PAGE
  const to = from + PRODUCTS_PER_PAGE - 1
  query = query.range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0, totalPages: 0 }
  }

  return {
    products: (data || []) as Product[],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / PRODUCTS_PER_PAGE),
  }
}

async function getCategoryFilters(categoryId: string) {
  const supabase = await createClient()

  // Get attributes linked to this category
  const { data: categoryAttrsData } = await supabase
    .from('category_attributes')
    .select('attribute_id, attribute_definitions(*)')
    .eq('category_id', categoryId)
    .order('sort_order')

  const categoryAttrs = (categoryAttrsData || []) as Array<{
    attribute_id: string
    attribute_definitions: AttributeDefinition | null
  }>

  if (categoryAttrs.length === 0) {
    return []
  }

  // Get unique values for each attribute
  const filters = await Promise.all(
    categoryAttrs
      .filter((ca) => ca.attribute_definitions !== null)
      .map(async (ca) => {
        const attr = ca.attribute_definitions!

        // Get products in this category
        const { data: productAttrs } = await supabase
          .from('product_attributes')
          .select('value_text, value_number')
          .eq('attribute_id', attr.id)

        // Count unique values
        const valueCounts: Record<string, number> = {}
        const attrs = (productAttrs || []) as Array<{ value_text: string | null; value_number: number | null }>
        attrs.forEach((pa) => {
          const value = pa.value_text || (pa.value_number !== null ? String(pa.value_number) : null)
          if (value) {
            valueCounts[value] = (valueCounts[value] || 0) + 1
          }
        })

        const values = Object.entries(valueCounts).map(([value, count]) => ({
          value,
          count,
        }))

        return {
          attribute: attr,
          values,
          type: (attr.type === 'number' ? 'range' : 'select') as 'range' | 'select',
        }
      })
  )

  return filters.filter(f => f.values.length > 0)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryByPath(slug)

  if (!category) {
    return { title: 'Категория не найдена' }
  }

  return {
    title: category.meta_title_ru || category.name_ru,
    description: category.meta_description_ru || category.description_ru,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = await searchParams
  const locale = await getLocale() as Locale
  const t = await getTranslations()

  const category = await getCategoryByPath(slug)
  if (!category) {
    notFound()
  }

  // Parse filters from searchParams
  const selectFilters: Record<string, string> = {}
  const rangeFilters: Record<string, { min?: string; max?: string }> = {}

  for (const [key, value] of Object.entries(search)) {
    if (key === 'page' || key === 'sort' || !value) continue

    if (key.endsWith('_min') || key.endsWith('_max')) {
      const attrSlug = key.replace(/_min$|_max$/, '')
      if (!rangeFilters[attrSlug]) rangeFilters[attrSlug] = {}
      if (key.endsWith('_min')) {
        rangeFilters[attrSlug].min = String(value)
      } else {
        rangeFilters[attrSlug].max = String(value)
      }
    } else {
      selectFilters[key] = String(value)
    }
  }

  const [categoryPath, subcategories, { products, total, totalPages }, filters] = await Promise.all([
    getCategoryPath(category.id),
    getSubcategories(category.id),
    getProducts(
      category.id,
      Number(search.page) || 1,
      String(search.sort || 'popular'),
      selectFilters,
      rangeFilters
    ),
    getCategoryFilters(category.id),
  ])

  const name = getLocalizedField(category, 'name', locale)
  const description = getLocalizedField(category, 'description', locale)

  // Build breadcrumb items - each category.slug already contains full path
  const breadcrumbItems = [
    { label: t('catalog.breadcrumb'), href: '/katalog' },
    ...categoryPath.slice(0, -1).map((cat) => ({
      label: getLocalizedField(cat, 'name', locale),
      href: '/katalog/' + cat.slug,
    })),
    { label: name },
  ]

  const currentPage = Number(search.page) || 1
  const currentUrl = `/katalog/${slug.join('/')}`

  const hasSubcategories = subcategories.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          {total} {t('common.products')}
        </p>
      </div>

      {/* Subcategories */}
      {hasSubcategories && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('catalog.subcategories')}
          </h2>
          <CategoryGrid
            categories={subcategories}
            locale={locale}
            basePath="/katalog"
          />
        </div>
      )}

      {/* Products section */}
      {products.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          {filters.length > 0 && (
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters filters={filters} locale={locale} />
            </aside>
          )}

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <SortSelect />
            </div>

            <ProductGrid products={products} locale={locale} />

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl={currentUrl}
                  searchParams={Object.fromEntries(
                    Object.entries(search)
                      .filter(([key]) => key !== 'page')
                      .map(([key, value]) => [key, String(value)])
                  )}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* No products, only subcategories */}
      {products.length === 0 && !hasSubcategories && (
        <div className="text-center py-12 text-gray-500">
          {t('common.noResults')}
        </div>
      )}

      {/* SEO content */}
      {category.description_ru && (
        <div className="mt-12 prose max-w-none">
          <h2>Описание</h2>
          <div dangerouslySetInnerHTML={{ __html: category.description_ru }} />
        </div>
      )}
    </div>
  )
}
