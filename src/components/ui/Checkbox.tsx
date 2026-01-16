'use client'

import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={cn(
            'w-4 h-4 text-orange-500 border-gray-300 rounded',
            'focus:ring-orange-500 focus:ring-2',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="ml-2 text-sm text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export { Checkbox }
