'use client'

import { cn } from '@/lib/utils'
import {
  ExternalLink,
  FileText,
  FolderTree,
  Home,
  LogOut,
  Newspaper,
  Package,
  Settings,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarLinks = [
  { href: '/admin', label: 'Дашборд', icon: Home, exact: true },
  { href: '/admin/categories', label: 'Категории', icon: FolderTree },
  { href: '/admin/attributes', label: 'Атрибуты', icon: Settings },
  { href: '/admin/products', label: 'Товары', icon: Package },
  { href: '/admin/pages', label: 'Страницы', icon: FileText },
  { href: '/admin/news', label: 'Новости', icon: Newspaper },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href
    }
    return pathname === href || pathname.startsWith(href + '/')
  }

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
                    isActive(link.href, link.exact)
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Открыть сайт
          </Link>
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
      <main className="ml-64 min-h-screen p-6">
        {children}
      </main>
    </div>
  )
}
