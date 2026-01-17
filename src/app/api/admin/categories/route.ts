import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('categories')
      .select('id, name_ru, level')
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = await createServiceClient()

    const insertData = {
      parent_id: body.parent_id,
      slug: body.slug,
      name_ru: body.name_ru,
      name_kz: body.name_kz || null,
      description_ru: body.description_ru || null,
      description_kz: body.description_kz || null,
      meta_title_ru: body.meta_title_ru || null,
      meta_title_kz: body.meta_title_kz || null,
      meta_description_ru: body.meta_description_ru || null,
      meta_description_kz: body.meta_description_kz || null,
      image_url: body.image_url || null,
      icon_url: body.icon_url || null,
      sort_order: body.sort_order || 0,
      is_active: body.is_active ?? true,
    }

    const { data, error } = await supabase
      .from('categories')
      .insert(insertData as never)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Категория с таким URL уже существует' },
          { status: 400 }
        )
      }
      throw error
    }

    return NextResponse.json({ category: data })
  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json(
      { error: 'Ошибка создания категории' },
      { status: 500 }
    )
  }
}
