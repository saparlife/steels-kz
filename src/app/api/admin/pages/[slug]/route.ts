import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json(
        { error: 'Страница не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json({ page: data })
  } catch (error) {
    console.error('Get page error:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки страницы' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()

    const supabase = await createServiceClient()

    const updateData = {
      title_ru: body.title_ru,
      title_kz: body.title_kz || null,
      content_ru: body.content_ru || null,
      content_kz: body.content_kz || null,
      meta_title_ru: body.meta_title_ru || null,
      meta_title_kz: body.meta_title_kz || null,
      meta_description_ru: body.meta_description_ru || null,
      meta_description_kz: body.meta_description_kz || null,
    }

    const { data, error } = await supabase
      .from('pages')
      .update(updateData as never)
      .eq('slug', slug)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ page: data })
  } catch (error) {
    console.error('Update page error:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления страницы' },
      { status: 500 }
    )
  }
}
