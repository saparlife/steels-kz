import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Get all attribute definitions for reference
  const { data: allDefs } = await supabase
    .from('attribute_definitions')
    .select('id, slug, name_ru, type, unit')
    .order('name_ru')

  const defMap = new Map(allDefs?.map(d => [d.id, d]) || [])
  console.log(`=== ALL ${allDefs?.length} ATTRIBUTE DEFINITIONS ===`)
  allDefs?.forEach(d => console.log(`  ${d.name_ru} (${d.type}${d.unit ? ', ' + d.unit : ''})`))

  // Get top-level categories (level 0)
  const { data: topCats } = await supabase
    .from('categories')
    .select('id, name_ru, slug, level')
    .eq('level', 0)
    .order('name_ru')

  console.log(`\n=== TOP-LEVEL CATEGORIES (${topCats?.length}) ===`)
  topCats?.forEach(c => console.log(`  ${c.name_ru}`))

  // Sample 20 diverse products with their attributes from different categories
  const { data: leafCats } = await supabase
    .from('categories')
    .select('id, name_ru, slug, products_count, level')
    .gt('products_count', 0)
    .order('name_ru')

  // Pick every 30th category for diversity
  const step = Math.floor((leafCats?.length || 1) / 20)
  const selectedCats = leafCats?.filter((_, i) => i % step === 0).slice(0, 20) || []

  console.log(`\n=== SAMPLED PRODUCTS WITH ATTRIBUTES (${selectedCats.length} categories) ===\n`)

  for (const cat of selectedCats) {
    // Get one product
    const { data: products } = await supabase
      .from('products')
      .select('id, name_ru, description_ru, meta_title_ru, meta_description_ru')
      .eq('category_id', cat.id)
      .limit(1)

    if (!products || products.length === 0) continue
    const p = products[0]

    // Get its attributes
    const { data: attrs } = await supabase
      .from('product_attributes')
      .select('attribute_id, value_text, value_number')
      .eq('product_id', p.id)

    console.log(`--- ${cat.name_ru} (${cat.products_count} products, level ${cat.level}) ---`)
    console.log(`  Name: ${p.name_ru}`)
    console.log(`  Meta Title: ${p.meta_title_ru}`)
    console.log(`  Meta Desc: ${p.meta_description_ru}`)
    console.log(`  Description: ${p.description_ru?.substring(0, 200)}...`)

    if (attrs && attrs.length > 0) {
      console.log(`  Attributes (${attrs.length}):`)
      attrs.forEach(a => {
        const def = defMap.get(a.attribute_id)
        const val = a.value_text || a.value_number
        console.log(`    ${def?.name_ru || '?'}: ${val}${def?.unit ? ' ' + def.unit : ''}`)
      })
    } else {
      console.log(`  Attributes: NONE`)
    }
    console.log()
  }

  // Stats: how many products have attributes
  const { count: prodsWithAttrs } = await supabase
    .from('product_attributes')
    .select('product_id', { count: 'exact', head: true })
  console.log(`\nTotal product_attribute rows: ${prodsWithAttrs}`)

  // Get distinct product_ids that have attributes
  const { data: distinctProds } = await supabase.rpc('count_distinct_products_with_attrs').maybeSingle()

  // Alternative: count via sample
  const batchSize = 10000
  const uniqueIds = new Set<string>()
  let offset = 0
  let hasMore = true
  while (hasMore && offset < 100000) {
    const { data } = await supabase
      .from('product_attributes')
      .select('product_id')
      .range(offset, offset + batchSize - 1)
    if (!data || data.length === 0) { hasMore = false; break }
    data.forEach(r => uniqueIds.add(r.product_id))
    offset += batchSize
    if (data.length < batchSize) hasMore = false
  }
  console.log(`Unique products with attributes (from first 100k rows): ${uniqueIds.size}`)

  // Average attributes per product
  console.log(`Average attrs per product: ${(100000 / uniqueIds.size).toFixed(1)} (estimated from first 100k rows)`)
}

main()
