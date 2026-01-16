import { cn } from '@/lib/utils'
import {
  FileText,
  FolderTree,
  Home,
  LogOut,
  Newspaper,
  Package,
  Settings,
  Users,
} from 'lucide-react'
import Link from 'next/link'

const sidebarLinks = [
  { href: '/admin', label: 'Дашборд', icon: Home },
  { href: '/admin/categories', label: 'Категории', icon: FolderTree },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/pages', label: 'Страницы', icon: FileText },
  { href: '/admin/news', label: 'Новости', icon: Newspaper },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="p-4">
          <Link href="/admin" className="text-xl font-bold">
            СТАЛЬ<span className="text-orange-500">АДМИН</span>
          </Link>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors',
                    'hover:bg-gray-800 text-gray-300 hover:text-white'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Link
            href="/admin/logout"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Вернуться на сайт
            </Link>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
