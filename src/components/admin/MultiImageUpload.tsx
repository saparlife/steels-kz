'use client'

import { GripVertical, Loader2, Star, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useState } from 'react'

interface ProductImage {
  id?: string
  url: string
  alt_ru?: string
  sort_order: number
  is_primary: boolean
}

interface MultiImageUploadProps {
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
  folder?: string
  maxImages?: number
}

export function MultiImageUpload({
  images,
  onChange,
  folder = 'products',
  maxImages = 10,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (images.length + files.length > maxImages) {
        setError(`Максимум ${maxImages} изображений`)
        return
      }

      setError('')
      setIsUploading(true)

      try {
        const newImages: ProductImage[] = []

        for (const file of Array.from(files)) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('folder', folder)

          const res = await fetch('/api/admin/upload', {
            method: 'POST',
            body: formData,
          })

          const data = await res.json()

          if (!res.ok) {
            setError(data.error || 'Ошибка загрузки')
            continue
          }

          newImages.push({
            url: data.url,
            sort_order: images.length + newImages.length,
            is_primary: images.length === 0 && newImages.length === 0,
          })
        }

        if (newImages.length > 0) {
          onChange([...images, ...newImages])
        }
      } catch {
        setError('Ошибка сети')
      } finally {
        setIsUploading(false)
      }
    },
    [folder, images, maxImages, onChange]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleUpload(files)
    }
    e.target.value = ''
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  }

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    // If removed image was primary, make first one primary
    if (images[index].is_primary && newImages.length > 0) {
      newImages[0].is_primary = true
    }
    // Reorder
    newImages.forEach((img, i) => {
      img.sort_order = i
    })
    onChange(newImages)
  }

  const handleSetPrimary = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }))
    onChange(newImages)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const temp = newImages[index - 1]
    newImages[index - 1] = newImages[index]
    newImages[index] = temp
    newImages.forEach((img, i) => {
      img.sort_order = i
    })
    onChange(newImages)
  }

  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return
    const newImages = [...images]
    const temp = newImages[index + 1]
    newImages[index + 1] = newImages[index]
    newImages[index] = temp
    newImages.forEach((img, i) => {
      img.sort_order = i
    })
    onChange(newImages)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Изображения товара
      </label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          {images.map((image, index) => (
            <div
              key={image.id || image.url}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.is_primary ? 'border-orange-500' : 'border-gray-200'
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={image.alt_ru || 'Product image'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Primary badge */}
              {image.is_primary && (
                <div className="absolute top-1 left-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded">
                  Главное
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Сделать главным"
                  >
                    <Star className="w-4 h-4 text-orange-500" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Reorder buttons */}
              <div className="absolute bottom-1 right-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 bg-white/80 rounded hover:bg-white disabled:opacity-50"
                  title="Вверх"
                >
                  <GripVertical className="w-3 h-3 rotate-90" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={isUploading}
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              <span className="mt-2 text-sm text-gray-500">Загрузка...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">
                Перетащите файлы или нажмите
              </span>
              <span className="mt-1 text-xs text-gray-400">
                JPEG, PNG, WebP, GIF до 10MB. Макс. {maxImages} изображений
              </span>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

      <p className="mt-2 text-xs text-gray-500">
        {images.length} из {maxImages} изображений
      </p>
    </div>
  )
}
