import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - list products
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category_id')

  const supabase = await createServiceClient()

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// POST - create product
export async function POST(request: Request) {
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
    attributes, // Array of { attribute_id, value_text, value_number }
    images // Array of { url, alt_ru, sort_order, is_primary }
  } = body

  if (!name_ru || !category_id) {
    return NextResponse.json(
      { error: 'Название и категория обязательны' },
      { status: 400 }
    )
  }

  const supabase = await createServiceClient()

  // Generate slug if not provided
  const productSlug = slug || name_ru
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 200)

  // Create product
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: product, error: productError } = await (supabase as any)
    .from('products')
    .insert({
      name_ru,
      name_kz: name_kz || name_ru,
      slug: productSlug,
      description_ru,
      description_kz,
      category_id,
      sku,
      price: price ? Number(price) : null,
      is_active: is_active !== false,
      meta_title_ru: meta_title_ru || name_ru,
      meta_description_ru,
    })
    .select()
    .single()

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 })
  }

  // Create product attributes
  if (attributes && attributes.length > 0) {
    const productAttributes = attributes.map((attr: { attribute_id: string; value_text?: string; value_number?: number }) => ({
      product_id: product.id,
      attribute_id: attr.attribute_id,
      value_text: attr.value_text || null,
      value_number: attr.value_number || null,
    }))

    const { error: attrError } = await supabase
      .from('product_attributes')
      .insert(productAttributes)

    if (attrError) {
      console.error('Error creating product attributes:', attrError)
    }
  }

  // Create product images
  if (images && images.length > 0) {
    const productImages = images.map((img: { url: string; alt_ru?: string; sort_order: number; is_primary: boolean }) => ({
      product_id: product.id,
      url: img.url,
      alt_ru: img.alt_ru || null,
      sort_order: img.sort_order,
      is_primary: img.is_primary,
    }))

    const { error: imgError } = await supabase
      .from('product_images')
      .insert(productImages)

    if (imgError) {
      console.error('Error creating product images:', imgError)
    }
  }

  return NextResponse.json(product, { status: 201 })
}
