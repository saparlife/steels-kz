import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - list all attributes
export async function GET() {
  const supabase = await createServiceClient()

  const { data, error } = await supabase
    .from('attribute_definitions')
    .select('*')
    .order('name_ru')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

// POST - create attribute
export async function POST(request: Request) {
  const body = await request.json()
  const { name_ru, name_kz, slug, type, unit, options } = body

  if (!name_ru || !type) {
    return NextResponse.json(
      { error: 'Название и тип обязательны' },
      { status: 400 }
    )
  }

  const supabase = await createServiceClient()

  // Generate slug if not provided
  const attrSlug = slug || name_ru
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('attribute_definitions')
    .insert({
      name_ru,
      name_kz: name_kz || name_ru,
      slug: attrSlug,
      type,
      unit: unit || null,
      options: options || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
