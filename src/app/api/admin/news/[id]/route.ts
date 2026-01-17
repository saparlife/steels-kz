import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - get single news
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!news) {
    return NextResponse.json({ error: 'Новость не найдена' }, { status: 404 })
  }

  return NextResponse.json(news)
}

// PUT - update news
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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

  const supabase = await createServiceClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: news, error } = await (supabase as any)
    .from('news')
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(news)
}

// DELETE - delete news
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
