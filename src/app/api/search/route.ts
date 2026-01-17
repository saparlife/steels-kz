import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const page = Number(searchParams.get('page')) || 1
  const limit = 24

  if (!query.trim()) {
    return NextResponse.json({ products: [], total: 0, totalPages: 0 })
  }

  const supabase = await createServiceClient()

  const from = (page - 1) * limit
  const to = from + limit - 1

  // Search in products
  const { data, count, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name_ru, slug),
      product_images (id, url, is_primary, sort_order)
    `, { count: 'exact' })
    .eq('is_active', true)
    .or(`name_ru.ilike.%${query}%,name_kz.ilike.%${query}%,sku.ilike.%${query}%,description_ru.ilike.%${query}%`)
    .order('views_count', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Ошибка поиска' }, { status: 500 })
  }

  return NextResponse.json({
    products: data || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
  })
}
