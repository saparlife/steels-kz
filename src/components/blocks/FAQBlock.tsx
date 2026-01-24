'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { FAQSchema } from '@/components/seo/FAQSchema'

interface FAQItem {
  question: string
  answer: string
}

interface FAQBlockProps {
  title?: string
  items: FAQItem[]
  showSchema?: boolean
  className?: string
}

export function FAQBlock({
  title = 'Часто задаваемые вопросы',
  items,
  showSchema = true,
  className = '',
}: FAQBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items.length) return null

  return (
    <section className={`py-12 ${className}`}>
      {showSchema && <FAQSchema items={items} />}

      <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
