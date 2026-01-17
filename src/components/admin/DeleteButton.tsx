'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface DeleteButtonProps {
  id: string
  endpoint: string
  confirmMessage?: string
}

export function DeleteButton({ id, endpoint, confirmMessage = 'Удалить этот элемент?' }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(confirmMessage)) return

    setIsDeleting(true)
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Ошибка удаления')
      }
    } catch {
      alert('Произошла ошибка')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-pulse' : ''}`} />
    </button>
  )
}
