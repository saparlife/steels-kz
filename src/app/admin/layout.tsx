'use client'

import { cn } from '@/lib/utils'
import {
  Award,
  Book,
  Briefcase,
  Building2,
  ExternalLink,
  Factory,
  FileCheck,
  FileText,
  FolderTree,
  HelpCircle,
  Home,
  LogOut,
  Newspaper,
  Package,
  Settings,
  Tag,
  Wrench,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarSections = [
  {
    title: 'Основное',
    links: [
      { href: '/admin', label: 'Дашборд', icon: Home, exact: true },
      { href: '/admin/categories', label: 'Категории', icon: FolderTree },
      { href: '/admin/attributes', label: 'Атрибуты', icon: Settings },
      { href: '/admin/products', label: 'Товары', icon: Package },
    ],
  },
  {
    title: 'Контент',
    links: [
      { href: '/admin/news', label: 'Новости', icon: Newspaper },
      { href: '/admin/pages', label: 'Страницы', icon: FileText },
      { href: '/admin/guides', label: 'Гайды', icon: Book },
      { href: '/admin/cases', label: 'Кейсы', icon: Briefcase },
    ],
  },
  {
    title: 'Каталог',
    links: [
      { href: '/admin/brands', label: 'Бренды', icon: Award },
      { href: '/admin/manufacturers', label: 'Производители', icon: Factory },
      { href: '/admin/special-offers', label: 'Акции', icon: Tag },
    ],
  },
  {
    title: 'Справочники',
    links: [
      { href: '/admin/gost', label: 'ГОСТ', icon: FileCheck },
      { href: '/admin/steel-grades', label: 'Марки стали', icon: Wrench },
      { href: '/admin/glossary', label: 'Глоссарий', icon: Book },
      { href: '/admin/documents', label: 'Документы', icon: FileText },
    ],
  },
  {
    title: 'Поддержка',
    links: [
      { href: '/admin/faq-categories', label: 'FAQ категории', icon: HelpCircle },
      { href: '/admin/leads', label: 'Заявки', icon: Building2 },
    ],
  },
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

        <nav className="mt-4 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {sidebarSections.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                {section.title}
              </div>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm',
                        isActive(link.href, link.exact)
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
