import { Button } from '@/components/ui/Button'
import { createServiceClient } from '@/lib/supabase/server'
import type { AttributeDefinition } from '@/types/database'
import { Plus, Settings } from 'lucide-react'
import Link from 'next/link'

export default async function AdminAttributesPage() {
  const supabase = await createServiceClient()

  const { data } = await supabase
    .from('attribute_definitions')
    .select('*')
    .order('name_ru')

  const attributes = (data || []) as AttributeDefinition[]

  const typeLabels: Record<string, string> = {
    text: 'Текст',
    number: 'Число',
    select: 'Выбор из списка',
    boolean: 'Да/Нет',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Атрибуты (Характеристики)</h1>
          <p className="text-gray-600 mt-1">
            Определения характеристик товаров: Диаметр, Марка, ГОСТ и т.д.
          </p>
        </div>
        <Link href="/admin/attributes/new">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Добавить атрибут
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Тип
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Единица
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attributes.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Атрибуты не созданы</p>
                  <Link href="/admin/attributes/new" className="text-orange-500 hover:underline mt-2 inline-block">
                    Создать первый атрибут
                  </Link>
                </td>
              </tr>
            ) : (
              attributes.map((attr) => (
                <tr key={attr.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{attr.name_ru}</div>
                    {attr.name_kz !== attr.name_ru && (
                      <div className="text-sm text-gray-500">{attr.name_kz}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {attr.slug}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex px-2 py-1 bg-gray-100 rounded text-gray-700">
                      {typeLabels[attr.type] || attr.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {attr.unit || '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/attributes/${attr.id}`}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900">Как использовать:</h3>
        <ol className="mt-2 text-sm text-blue-800 list-decimal list-inside space-y-1">
          <li>Создайте атрибуты (Диаметр, Марка, ГОСТ, Материал)</li>
          <li>Привяжите атрибуты к категориям (в редактировании категории)</li>
          <li>При добавлении товара атрибуты будут показаны автоматически</li>
          <li>Фильтры на сайте строятся из атрибутов категории</li>
        </ol>
      </div>
    </div>
  )
}
