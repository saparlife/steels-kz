import { Button } from '@/components/ui/Button'
import { FileText, Plus } from 'lucide-react'
import Link from 'next/link'

export default function AdminPagesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Страницы</h1>
          <p className="text-gray-600 mt-1">Управление статическими страницами</p>
        </div>
        <Button variant="primary" disabled>
          <Plus className="w-4 h-4 mr-2" />
          Добавить страницу
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Раздел в разработке</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Здесь будет возможность управлять статическими страницами сайта:
          О компании, Услуги, Доставка, Контакты и другие.
        </p>
      </div>
    </div>
  )
}
