import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - get attributes for a category
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceClient()

  // Get attributes linked to this category
  const { data, error } = await supabase
    .from('category_attributes')
    .select(`
      attribute_id,
      is_required,
      sort_order,
      attribute_definitions (
        id,
        name_ru,
        name_kz,
        slug,
        type,
        unit,
        options
      )
    `)
    .eq('category_id', id)
    .order('sort_order')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Flatten the response
  const attributes = (data || []).map((item: { attribute_id: string; is_required: boolean; sort_order: number; attribute_definitions: Record<string, unknown> | null }) => ({
    ...(item.attribute_definitions || {}),
    is_required: item.is_required,
    sort_order: item.sort_order,
  }))

  return NextResponse.json(attributes)
}

// PUT - update attributes for a category
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { attributes } = body

  const supabase = await createServiceClient()

  // Delete existing category attributes
  await supabase
    .from('category_attributes')
    .delete()
    .eq('category_id', id)

  // Insert new attributes
  if (attributes && attributes.length > 0) {
    const categoryAttributes = attributes.map((attr: { attribute_id: string; is_required?: boolean; sort_order?: number }, index: number) => ({
      category_id: id,
      attribute_id: attr.attribute_id,
      is_required: attr.is_required || false,
      sort_order: attr.sort_order ?? index,
    }))

    const { error } = await supabase
      .from('category_attributes')
      .insert(categoryAttributes)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
