import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Building2, Copy } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Реквизиты компании - Сталь Сервис Казахстан',
  description: 'Банковские реквизиты, ИИН/БИН, юридический адрес компании Сталь Сервис Казахстан.',
}

const requisites = {
  name: 'ТОО "Сталь Сервис Казахстан"',
  bin: '123456789012',
  iin: '',
  address: 'г. Алматы, ул. Примерная, д. 1',
  director: 'Иванов Иван Иванович',
  bank: 'АО "Народный Банк Казахстана"',
  bik: 'HSBKKZKX',
  iban: 'KZ123456789012345678',
  kbe: '17',
}

export default function RequisitesPage() {
  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'О компании', href: '/about' },
              { label: 'Реквизиты' },
            ]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Реквизиты компании
                </h1>
                <p className="text-gray-600">
                  Банковские и юридические реквизиты
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">Наименование</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">БИН</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.bin}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">Юридический адрес</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.address}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">Директор</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.director}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">Банк</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.bank}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">БИК</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.bik}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">IBAN (ИИК)</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.iban}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">КБе</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{requisites.kbe}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-orange-50 rounded-lg">
              <h2 className="font-semibold text-orange-900 mb-2">
                Нужна карточка предприятия?
              </h2>
              <p className="text-orange-800 text-sm">
                Для получения карточки предприятия или других документов свяжитесь с нашим отделом продаж.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
