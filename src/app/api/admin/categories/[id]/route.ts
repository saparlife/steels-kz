import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json({ category: data })
  } catch (error) {
    console.error('Get category error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки категории' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('categories')
      .update({
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
        sort_order: body.sort_order || 0,
        is_active: body.is_active ?? true,
      })
      .eq('id', id)
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
    console.error('Update category error:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления категории' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete category error:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления категории' },
      { status: 500 }
    )
  }
}
