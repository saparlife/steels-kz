'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { CheckCircle, Loader2 } from 'lucide-react'

interface LeadFormProps {
  type: 'price_request' | 'order' | 'wholesale' | 'business' | 'partner' | 'callback'
  title?: string
  description?: string
  productId?: string
  categoryId?: string
  sourcePage?: string
  showCompany?: boolean
  showMessage?: boolean
  showEmail?: boolean
  buttonText?: string
  className?: string
  onSuccess?: () => void
}

export function LeadForm({
  type,
  title,
  description,
  productId,
  categoryId,
  sourcePage,
  showCompany = false,
  showMessage = false,
  showEmail = false,
  buttonText = 'Отправить',
  className = '',
  onSuccess,
}: LeadFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      type,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string | undefined,
      company: formData.get('company') as string | undefined,
      message: formData.get('message') as string | undefined,
      product_id: productId,
      category_id: categoryId,
      source_page: sourcePage || window.location.pathname,
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Ошибка отправки заявки')
      }

      setIsSuccess(true)
      onSuccess?.()
    } catch {
      setError('Произошла ошибка. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-8 text-center ${className}`}>
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-900 mb-2">Заявка отправлена!</h3>
        <p className="text-green-700">
          Наш менеджер свяжется с вами в ближайшее время.
        </p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            name="name"
            placeholder="Ваше имя *"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            name="phone"
            type="tel"
            placeholder="Телефон *"
            required
            disabled={isLoading}
          />
        </div>

        {showEmail && (
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              disabled={isLoading}
            />
          </div>
        )}

        {showCompany && (
          <div>
            <Input
              name="company"
              placeholder="Компания"
              disabled={isLoading}
            />
          </div>
        )}

        {showMessage && (
          <div>
            <Textarea
              name="message"
              placeholder="Сообщение"
              rows={4}
              disabled={isLoading}
            />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Отправка...
            </>
          ) : (
            buttonText
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <a href="/privacy" className="text-orange-500 hover:underline">
            политикой конфиденциальности
          </a>
        </p>
      </form>
    </div>
  )
}
