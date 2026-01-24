import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { TLDRBlock } from '@/components/blocks/TLDRBlock'
import { CTABlock } from '@/components/blocks/CTABlock'
import { createClient } from '@/lib/supabase/server'
import { FileCheck, Award, Shield, FileText, Download } from 'lucide-react'
import type { Document } from '@/types/database'

export const metadata: Metadata = {
  title: 'Сертификаты и документы - Сталь Сервис Казахстан',
  description: 'Сертификаты качества на металлопрокат. Документы, лицензии, паспорта качества. Гарантия соответствия ГОСТ.',
}

const documentTypes = [
  { type: 'certificate', label: 'Сертификаты соответствия', icon: Award },
  { type: 'gost', label: 'Документы ГОСТ', icon: FileText },
  { type: 'license', label: 'Лицензии', icon: Shield },
  { type: 'quality', label: 'Паспорта качества', icon: FileCheck },
]

export default async function DocumentsPage() {
  const supabase = await createClient()

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as { data: Document[] | null }

  // Group by type
  const grouped: Record<string, Document[]> = {}
  documents?.forEach((doc) => {
    if (!grouped[doc.type]) {
      grouped[doc.type] = []
    }
    grouped[doc.type]?.push(doc)
  })

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Сертификаты и документы' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Сертификаты и документы
            </h1>
            <TLDRBlock
              content="Вся продукция сертифицирована и соответствует требованиям ГОСТ. Предоставляем сертификаты качества, паспорта на продукцию, лицензии компании."
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {documentTypes.map((docType) => {
              const count = grouped[docType.type]?.length || 0
              return (
                <div
                  key={docType.type}
                  className="bg-white border border-gray-200 rounded-lg p-6 text-center"
                >
                  <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <docType.icon className="w-7 h-7 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{docType.label}</h3>
                  <p className="text-gray-500 text-sm">{count} документов</p>
                </div>
              )
            })}
          </div>

          {!documents?.length ? (
            <div className="text-center py-16">
              <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Документы загружаются
              </h2>
              <p className="text-gray-600 mb-6">
                Свяжитесь с нами для получения сертификатов
              </p>
              <Link
                href="/contacts"
                className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Связаться с нами
              </Link>
            </div>
          ) : (
            <div className="space-y-12">
              {documentTypes.map((docType) => {
                const docs = grouped[docType.type]
                if (!docs?.length) return null

                return (
                  <div key={docType.type}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <docType.icon className="w-6 h-6 text-orange-500" />
                      {docType.label}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white border border-gray-200 rounded-lg p-6"
                        >
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {doc.title_ru}
                          </h3>
                          {doc.issuer && (
                            <p className="text-gray-500 text-sm mb-2">
                              Выдан: {doc.issuer}
                            </p>
                          )}
                          {doc.issue_date && (
                            <p className="text-gray-500 text-sm mb-4">
                              Дата: {new Date(doc.issue_date).toLocaleDateString('ru-RU')}
                            </p>
                          )}
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
                            >
                              <Download className="w-4 h-4" />
                              Скачать PDF
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <CTABlock
        title="Нужны документы на конкретную продукцию?"
        description="Свяжитесь с нами, мы предоставим все необходимые сертификаты"
        primaryButton={{ text: 'Связаться с нами', href: '/contacts' }}
        secondaryButton={{ text: 'Смотреть каталог', href: '/katalog' }}
      />
    </div>
  )
}
