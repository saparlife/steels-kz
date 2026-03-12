import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('sort_order')

    if (error) throw error

    return NextResponse.json({ pages: data })
  } catch (error) {
    console.error('Get pages error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки страниц' },
      { status: 500 }
    )
  }
}
