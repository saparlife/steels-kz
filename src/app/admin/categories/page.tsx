import { DeleteButton } from '@/components/admin/DeleteButton'
import { Button } from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/server'
import type { Category } from '@/types/database'
import { Edit, FolderTree, Plus, Settings } from 'lucide-react'
import Link from 'next/link'

interface CategoryWithAttrs extends Category {
  attributes_count: number
}

async function getCategories(): Promise<CategoryWithAttrs[]> {
  const supabase = await createServiceClient()

  // Get categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('level')
    .order('sort_order')

  const categories = (categoriesData || []) as Category[]

  // Get attribute counts for each category
  const { data: attrCounts } = await supabase
    .from('category_attributes')
    .select('category_id')

  const countMap = new Map<string, number>()
  ;(attrCounts || []).forEach((item: { category_id: string }) => {
    countMap.set(item.category_id, (countMap.get(item.category_id) || 0) + 1)
  })

  return categories.map(cat => ({
    ...cat,
    attributes_count: countMap.get(cat.id) || 0
  }))
}

function buildCategoryTree(categories: CategoryWithAttrs[]): (CategoryWithAttrs & { children: CategoryWithAttrs[] })[] {
  const map = new Map<string, CategoryWithAttrs & { children: CategoryWithAttrs[] }>()
  const roots: (CategoryWithAttrs & { children: CategoryWithAttrs[] })[] = []

  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] })
  })

  categories.forEach(cat => {
    const item = map.get(cat.id)!
    if (cat.parent_id && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.children.push(item)
    } else {
      roots.push(item)
    }
  })

  return roots
}

function CategoryRow({
  category,
  level = 0
}: {
  category: CategoryWithAttrs & { children: CategoryWithAttrs[] }
  level?: number
}) {
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            <FolderTree className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{category.name_ru}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-gray-500 font-mono text-sm">{category.slug}</td>
        <td className="px-4 py-3 text-gray-500">{category.products_count}</td>
        <td className="px-4 py-3">
          {category.attributes_count > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
              <Settings className="w-3 h-3" />
              {category.attributes_count}
            </span>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 rounded-full text-xs ${
            category.is_active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {category.is_active ? 'Активна' : 'Скрыта'}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/categories/${category.id}`}
              className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </Link>
            <DeleteButton
              id={category.id}
              endpoint="/api/admin/categories"
              confirmMessage="Удалить эту категорию? Все товары в ней останутся без категории."
            />
          </div>
        </td>
      </tr>
      {category.children.map(child => (
        <CategoryRow key={child.id} category={child as CategoryWithAttrs & { children: CategoryWithAttrs[] }} level={level + 1} />
      ))}
    </>
  )
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  const tree = buildCategoryTree(categories)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Категории</h1>
        <Link href="/admin/categories/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Добавить категорию
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Название</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Товаров</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Атрибутов</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Статус</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tree.map(category => (
              <CategoryRow key={category.id} category={category} />
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Категории пока не добавлены
          </div>
        )}
      </div>
    </div>
  )
}
