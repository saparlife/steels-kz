import { Info } from 'lucide-react'

interface TLDRBlockProps {
  title?: string
  content: string
  className?: string
}

export function TLDRBlock({ title = 'Кратко', content, className = '' }: TLDRBlockProps) {
  return (
    <div className={`bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-blue-900 mb-1">{title}</p>
          <p className="text-blue-800 text-sm">{content}</p>
        </div>
      </div>
    </div>
  )
}
