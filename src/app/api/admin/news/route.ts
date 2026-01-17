import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Transliteration map
const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  ' ': '-', '/': '-', '.': '', ',': '', '(': '', ')': '', '№': 'n',
  'ә': 'a', 'і': 'i', 'ң': 'n', 'ғ': 'g', 'ү': 'u', 'ұ': 'u', 'қ': 'k',
  'ө': 'o', 'һ': 'h'
}

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] ?? char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 200)
}

// GET - list news
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isActive = searchParams.get('is_active')
  const limit = searchParams.get('limit')

  const supabase = await createServiceClient()

  let query = supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  if (isActive === 'true') {
    query = query.eq('is_active', true)
  } else if (isActive === 'false') {
    query = query.eq('is_active', false)
  }

  if (limit) {
    query = query.limit(parseInt(limit))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - create news
export async function POST(request: Request) {
  const body = await request.json()
  const {
    title_ru,
    title_kz,
    slug,
    excerpt_ru,
    excerpt_kz,
    content_ru,
    content_kz,
    image_url,
    meta_title_ru,
    meta_title_kz,
    meta_description_ru,
    meta_description_kz,
    is_active,
    published_at,
  } = body

  if (!title_ru) {
    return NextResponse.json(
      { error: 'Заголовок обязателен' },
      { status: 400 }
    )
  }

  const supabase = await createServiceClient()

  // Generate slug if not provided (with transliteration)
  const newsSlug = slug || transliterate(title_ru)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: news, error } = await (supabase as any)
    .from('news')
    .insert({
      title_ru,
      title_kz: title_kz || title_ru,
      slug: newsSlug,
      excerpt_ru,
      excerpt_kz,
      content_ru,
      content_kz,
      image_url,
      meta_title_ru: meta_title_ru || title_ru,
      meta_title_kz: meta_title_kz || title_kz || title_ru,
      meta_description_ru: meta_description_ru || excerpt_ru,
      meta_description_kz: meta_description_kz || excerpt_kz,
      is_active: is_active !== false,
      published_at: published_at || new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(news, { status: 201 })
}
