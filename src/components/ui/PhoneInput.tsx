'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes, useState, useEffect } from 'react'

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label?: string
  error?: string
  value?: string
  onChange?: (value: string) => void
}

function formatPhone(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Remove leading 8 or 7 if present (we'll add +7)
  let cleaned = digits
  if (cleaned.startsWith('8') || cleaned.startsWith('7')) {
    cleaned = cleaned.slice(1)
  }

  // Limit to 10 digits (after +7)
  cleaned = cleaned.slice(0, 10)

  // Format as +7(XXX)XXX-XXXX
  if (cleaned.length === 0) return '+7'
  if (cleaned.length <= 3) return `+7(${cleaned}`
  if (cleaned.length <= 6) return `+7(${cleaned.slice(0, 3)})${cleaned.slice(3)}`
  return `+7(${cleaned.slice(0, 3)})${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
}

function unformatPhone(value: string): string {
  // Return just digits with +7 prefix
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('8')) return '+7' + digits.slice(1)
  if (digits.startsWith('7')) return '+' + digits
  return '+7' + digits
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, label, error, id, value, onChange, placeholder = '+7(XXX)XXX-XXXX', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value ? formatPhone(value) : '+7')

    useEffect(() => {
      if (value) {
        setDisplayValue(formatPhone(value))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      const formatted = formatPhone(newValue)
      setDisplayValue(formatted)

      // Pass unformatted value (with +7 prefix) to parent
      if (onChange) {
        onChange(unformatPhone(formatted))
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          type="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-2 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
