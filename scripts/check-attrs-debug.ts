import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // 1. Count product_attributes
  const { count: attrCount } = await supabase
    .from('product_attributes')
    .select('*', { count: 'exact', head: true })
  console.log(`Total product_attributes rows: ${attrCount}`)

  // 2. Count attribute_definitions
  const { count: defCount } = await supabase
    .from('attribute_definitions')
    .select('*', { count: 'exact', head: true })
  console.log(`Total attribute_definitions: ${defCount}`)

  // 3. Count products
  const { count: prodCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
  console.log(`Total products: ${prodCount}`)

  // 4. Sample product_attributes raw
  const { data: rawAttrs, error: rawErr } = await supabase
    .from('product_attributes')
    .select('*')
    .limit(5)
  console.log(`\nRaw product_attributes sample:`, JSON.stringify(rawAttrs, null, 2))
  if (rawErr) console.log('Error:', rawErr)

  // 5. Sample attribute_definitions
  const { data: defs } = await supabase
    .from('attribute_definitions')
    .select('*')
    .limit(10)
  console.log(`\nAttribute definitions sample:`, JSON.stringify(defs, null, 2))

  // 6. Try to get products WITH attributes using different join approaches
  if (rawAttrs && rawAttrs.length > 0) {
    const productId = rawAttrs[0].product_id
    console.log(`\nLooking up product: ${productId}`)

    const { data: product } = await supabase
      .from('products')
      .select('id, name_ru, slug')
      .eq('id', productId)
      .single()
    console.log('Product:', JSON.stringify(product, null, 2))

    const { data: prodAttrs, error: joinErr } = await supabase
      .from('product_attributes')
      .select(`
        value_text,
        value_numeric,
        attribute_definitions (
          name_ru,
          unit,
          attribute_type
        )
      `)
      .eq('product_id', productId)
    console.log('Product attributes with join:', JSON.stringify(prodAttrs, null, 2))
    if (joinErr) console.log('Join error:', joinErr)
  }

  // 7. Check which products have attributes
  const { data: productsWithAttrs } = await supabase
    .from('product_attributes')
    .select('product_id')
    .limit(1000)

  const uniqueProducts = new Set(productsWithAttrs?.map(a => a.product_id))
  console.log(`\nProducts that have attributes: ${uniqueProducts.size} (from first 1000 rows)`)

  // 8. Check category_attributes
  const { count: catAttrCount } = await supabase
    .from('category_attributes')
    .select('*', { count: 'exact', head: true })
  console.log(`Total category_attributes: ${catAttrCount}`)
}

main()
