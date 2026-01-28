import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductPriceRequest } from '@/components/product/ProductPriceRequest'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { type Locale } from '@/i18n/config'
import { createClient } from '@/lib/supabase/server'
import { getLocalizedField } from '@/lib/utils'
import type { Category, Product } from '@/types/database'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

interface ProductImage {
  id: string
  url: string
  alt_ru: string | null
  is_primary: boolean
  sort_order: number
}

interface ProductAttribute {
  attribute_id: string
  value_text: string | null
  value_number: number | null
  attribute_definitions: {
    id: string
    name_ru: string
    name_kz: string
    slug: string
    type: string
    unit: string | null
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      categories (*),
      product_images (
        id,
        url,
        alt_ru,
        is_primary,
        sort_order
      ),
      product_attributes (
        attribute_id,
        value_text,
        value_number,
        attribute_definitions (
          id,
          name_ru,
          name_kz,
          slug,
          type,
          unit
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return product as (Product & {
    categories: Category
    product_images: ProductImage[]
    product_attributes: ProductAttribute[]
  }) | null
}

async function getCategoryPath(categoryId: string): Promise<Category[]> {
  const supabase = await createClient()
  const path: Category[] = []

  let currentId: string | null = categoryId

  while (currentId) {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('id', currentId)
      .single()

    if (!data) break

    const category = data as Category
    path.unshift(category)
    currentId = category.parent_id
  }

  return path
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: 'Товар не найден' }
  }

  return {
    title: product.meta_title_ru || product.name_ru,
    description: product.meta_description_ru || product.description_ru?.substring(0, 160),
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const locale = (await getLocale()) as Locale
  const t = await getTranslations()

  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const categoryPath = product.categories
    ? await getCategoryPath(product.categories.id)
    : []

  const name = getLocalizedField(product, 'name', locale)
  const description = getLocalizedField(product, 'description', locale)

  // Build breadcrumb items - each category.slug already contains full path
  const breadcrumbItems = [
    { label: t('catalog.breadcrumb'), href: '/katalog' },
    ...categoryPath.map((cat) => ({
      label: getLocalizedField(cat, 'name', locale),
      href: '/katalog/' + cat.slug,
    })),
    { label: name },
  ]

  // Group attributes
  const attributes = product.product_attributes || []

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Images */}
        <ProductGallery
          images={product.product_images || []}
          productName={name}
        />

        {/* Right column - Product info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {name}
          </h1>

          {product.sku && (
            <p className="text-gray-500 mb-4">
              Артикул: <span className="font-medium">{product.sku}</span>
            </p>
          )}

          {/* Price */}
          <div className="mb-6">
            {product.price ? (
              <div className="text-3xl font-bold text-orange-500">
                {product.price.toLocaleString()} ₸
              </div>
            ) : (
              <div className="text-xl text-gray-600">Цена по запросу</div>
            )}
          </div>

          {/* Actions */}
          <div className="mb-8">
            <ProductPriceRequest productId={product.id} productName={name} />
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-green-700">В наличии</span>
          </div>
        </div>
      </div>

      {/* Attributes table */}
      {attributes.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Характеристики</h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {attributes.map((attr) => {
                  const attrDef = attr.attribute_definitions
                  if (!attrDef) return null

                  const attrName = getLocalizedField(attrDef, 'name', locale)
                  const value = attr.value_text || attr.value_number?.toString() || '—'

                  return (
                    <tr key={attr.attribute_id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-600 w-1/3">
                        {attrName}
                      </td>
                      <td className="px-6 py-3 font-medium">
                        {value}
                        {attrDef.unit && attr.value_number !== null && (
                          <span className="text-gray-500 ml-1">{attrDef.unit}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Описание</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      )}
    </div>
  )
}
