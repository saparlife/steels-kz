import { createClient } from '@/lib/supabase/server'
import { FolderTree, Package, Newspaper, FileText } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const [categoriesRes, productsRes, newsRes, pagesRes] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('pages').select('*', { count: 'exact', head: true }),
  ])

  return {
    categories: categoriesRes.count || 0,
    products: productsRes.count || 0,
    news: newsRes.count || 0,
    pages: pagesRes.count || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Категории',
      value: stats.categories,
      icon: FolderTree,
      href: '/admin/categories',
      color: 'bg-blue-500',
    },
    {
      title: 'Товары',
      value: stats.products,
      icon: Package,
      href: '/admin/products',
      color: 'bg-green-500',
    },
    {
      title: 'Новости',
      value: stats.news,
      icon: Newspaper,
      href: '/admin/news',
      color: 'bg-purple-500',
    },
    {
      title: 'Страницы',
      value: stats.pages,
      icon: FileText,
      href: '/admin/pages',
      color: 'bg-orange-500',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Панель управления</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            <Link
              href="/admin/categories/new"
              className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              + Добавить категорию
            </Link>
            <Link
              href="/admin/products/new"
              className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              + Добавить товар
            </Link>
            <Link
              href="/admin/news/new"
              className="block px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              + Добавить новость
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Добро пожаловать в панель управления сайтом Сталь Сервис.</p>
            <p>Здесь вы можете управлять категориями, товарами, страницами и настройками сайта.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
