import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number | null, currency: string = 'KZT'): string {
  if (price === null) return ''
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-KZ').format(num)
}

export function slugify(text: string): string {
  const translitMap: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
    'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
    'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
    'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    'ә': 'a', 'ғ': 'g', 'қ': 'q', 'ң': 'n', 'ө': 'o', 'ұ': 'u', 'ү': 'u', 'һ': 'h', 'і': 'i'
  }

  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: string
): string {
  const key = `${field}_${locale}` as keyof T
  const fallbackKey = `${field}_ru` as keyof T
  return (obj[key] as string) || (obj[fallbackKey] as string) || ''
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function buildCategoryPath(slugs: string[]): string {
  return '/katalog/' + slugs.join('/')
}

export function parseCategoryPath(path: string): string[] {
  return path.replace(/^\/katalog\/?/, '').split('/').filter(Boolean)
}
