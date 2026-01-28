'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { LeadForm } from '@/components/blocks/LeadForm'
import { X } from 'lucide-react'

interface ProductPriceRequestProps {
  productId: string
  productName: string
}

export function ProductPriceRequest({ productId, productName }: ProductPriceRequestProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        variant="primary"
        className="w-full"
        onClick={() => setIsModalOpen(true)}
      >
        Узнать цену
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Узнать цену
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                {productName}
              </p>

              <LeadForm
                type="price_request"
                productId={productId}
                buttonText="Отправить заявку"
                className="border-0 shadow-none p-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
