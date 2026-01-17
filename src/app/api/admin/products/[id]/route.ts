import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - get single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceClient()

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_attributes (
        attribute_id,
        value_text,
        value_number
      ),
      product_images (
        id,
        url,
        alt_ru,
        sort_order,
        is_primary
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!product) {
    return NextResponse.json({ error: 'Товар не найден' }, { status: 404 })
  }

  return NextResponse.json(product)
}

// PUT - update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const {
    name_ru,
    name_kz,
    slug,
    description_ru,
    description_kz,
    category_id,
    sku,
    price,
    is_active,
    meta_title_ru,
    meta_description_ru,
    attributes,
    images
  } = body

  const supabase = await createServiceClient()

  // Update product
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: product, error: productError } = await (supabase as any)
    .from('products')
    .update({
      name_ru,
      name_kz,
      slug,
      description_ru,
      description_kz,
      category_id,
      sku,
      price: price ? Number(price) : null,
      is_active,
      meta_title_ru,
      meta_description_ru,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 })
  }

  // Update attributes - delete old ones and insert new
  if (attributes) {
    // Delete existing attributes
    await supabase
      .from('product_attributes')
      .delete()
      .eq('product_id', id)

    // Insert new attributes
    if (attributes.length > 0) {
      const productAttributes = attributes.map((attr: { attribute_id: string; value_text?: string; value_number?: number }) => ({
        product_id: id,
        attribute_id: attr.attribute_id,
        value_text: attr.value_text || null,
        value_number: attr.value_number || null,
      }))

      await supabase
        .from('product_attributes')
        .insert(productAttributes)
    }
  }

  // Update images - delete old ones and insert new
  if (images) {
    // Delete existing images
    await supabase
      .from('product_images')
      .delete()
      .eq('product_id', id)

    // Insert new images
    if (images.length > 0) {
      const productImages = images.map((img: { url: string; alt_ru?: string; sort_order: number; is_primary: boolean }) => ({
        product_id: id,
        url: img.url,
        alt_ru: img.alt_ru || null,
        sort_order: img.sort_order,
        is_primary: img.is_primary,
      }))

      await supabase
        .from('product_images')
        .insert(productImages)
    }
  }

  return NextResponse.json(product)
}

// DELETE - delete product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createServiceClient()

  // Delete product attributes first
  await supabase
    .from('product_attributes')
    .delete()
    .eq('product_id', id)

  // Delete product images
  await supabase
    .from('product_images')
    .delete()
    .eq('product_id', id)

  // Delete product
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
