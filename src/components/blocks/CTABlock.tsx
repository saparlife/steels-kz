import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'

interface CTABlockProps {
  title: string
  description?: string
  primaryButton?: {
    text: string
    href: string
  }
  secondaryButton?: {
    text: string
    href: string
  }
  phone?: string
  variant?: 'dark' | 'light' | 'orange'
  className?: string
}

export function CTABlock({
  title,
  description,
  primaryButton,
  secondaryButton,
  phone,
  variant = 'dark',
  className = '',
}: CTABlockProps) {
  const variants = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-gray-50 text-gray-900',
    orange: 'bg-orange-500 text-white',
  }

  const buttonVariants = {
    dark: 'bg-orange-500 hover:bg-orange-600 text-white',
    light: 'bg-orange-500 hover:bg-orange-600 text-white',
    orange: 'bg-white hover:bg-gray-100 text-orange-600',
  }

  const secondaryButtonVariants = {
    dark: 'border border-gray-600 hover:border-gray-500 text-white',
    light: 'border border-gray-300 hover:border-gray-400 text-gray-900',
    orange: 'border border-white/50 hover:border-white text-white',
  }

  return (
    <section className={`py-16 ${variants[variant]} ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>

        {description && (
          <p className={`mb-8 max-w-2xl mx-auto ${variant === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {primaryButton && (
            <Link
              href={primaryButton.href}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 ${buttonVariants[variant]}`}
            >
              {primaryButton.text}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}

          {secondaryButton && (
            <Link
              href={secondaryButton.href}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${secondaryButtonVariants[variant]}`}
            >
              {secondaryButton.text}
            </Link>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, '')}`}
              className="inline-flex items-center gap-2 font-semibold"
            >
              <Phone className="w-5 h-5" />
              {phone}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
