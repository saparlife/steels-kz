import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('attribute_definitions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Атрибут не найден' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const supabase = await createServiceClient()

  const updateData = {
    name_ru: body.name_ru,
    name_kz: body.name_kz || null,
    slug: body.slug,
    type: body.type,
    unit: body.unit || null,
    options: body.options || [],
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('attribute_definitions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Атрибут с таким slug уже существует' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceClient()

  // Check if attribute is used in any category
  const { data: usedInCategories } = await supabase
    .from('category_attributes')
    .select('id')
    .eq('attribute_id', id)
    .limit(1)

  if (usedInCategories && usedInCategories.length > 0) {
    return NextResponse.json(
      { error: 'Атрибут используется в категориях. Сначала удалите его из категорий.' },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from('attribute_definitions')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
