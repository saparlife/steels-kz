import { Button } from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/server'
import type { Category, Product } from '@/types/database'
import { ImageIcon, Package, Plus, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductImage {
  id: string
  url: string
  is_primary: boolean
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>
}) {
  const params = await searchParams
  const supabase = await createServiceClient()
  const page = Number(params.page) || 1
  const perPage = 20
  const search = params.search || ''
  const categoryId = params.category || ''

  // Build query
  let query = supabase
    .from('products')
    .select('*, categories!inner(id, name_ru, slug), product_images(id, url, is_primary)', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name_ru.ilike.%${search}%,sku.ilike.%${search}%`)
  }

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1
  query = query.range(from, to)

  const { data, count } = await query

  const products = (data || []) as (Product & { categories: Category; product_images: ProductImage[] })[]
  const totalPages = Math.ceil((count || 0) / perPage)

  // Get categories for filter
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, name_ru, level')
    .order('path')

  const categories = (categoriesData || []) as Pick<Category, 'id' | 'name_ru' | 'level'>[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
          <p className="text-gray-600 mt-1">{count || 0} товаров</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <form className="flex gap-4" method="GET">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Поиск по названию или артикулу..."
                defaultValue={search}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <select
            name="category"
            defaultValue={categoryId}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {'—'.repeat(cat.level)} {cat.name_ru}
              </option>
            ))}
          </select>
          <Button type="submit" variant="secondary">
            Найти
          </Button>
        </form>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                Фото
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Товар
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Артикул
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Категория
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Цена
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Статус
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Товары не найдены</p>
                  <Link href="/admin/products/new" className="text-orange-500 hover:underline mt-2 inline-block">
                    Добавить первый товар
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.url}
                            alt={product.name_ru}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{product.name_ru}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {product.sku || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {product.categories?.name_ru || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {product.price ? (
                        <span className="font-medium">{product.price.toLocaleString()} ₸</span>
                      ) : (
                        <span className="text-gray-400">По запросу</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.is_active ? 'Активен' : 'Скрыт'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Редактировать
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Страница {page} из {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/products?page=${page - 1}${search ? `&search=${search}` : ''}${categoryId ? `&category=${categoryId}` : ''}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Назад
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/products?page=${page + 1}${search ? `&search=${search}` : ''}${categoryId ? `&category=${categoryId}` : ''}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Вперед
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
