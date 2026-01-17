import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('categories')
      .select('id, slug, name_ru, name_kz, level, parent_id, image_url, icon_url, products_count')
      .eq('is_active', true)
      .order('level')
      .order('sort_order')

    if (error) throw error

    return NextResponse.json({ categories: data })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки категорий' },
      { status: 500 }
    )
  }
}
