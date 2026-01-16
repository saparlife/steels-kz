import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types/database'
import { Edit, FolderTree, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('level')
    .order('sort_order')

  return (data || []) as Category[]
}

function buildCategoryTree(categories: Category[]): (Category & { children: Category[] })[] {
  const map = new Map<string, Category & { children: Category[] }>()
  const roots: (Category & { children: Category[] })[] = []

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
  category: Category & { children: Category[] }
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
        <td className="px-4 py-3 text-gray-500">{category.slug}</td>
        <td className="px-4 py-3 text-gray-500">{category.products_count}</td>
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
            <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
      {category.children.map(child => (
        <CategoryRow key={child.id} category={child as any} level={level + 1} />
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
