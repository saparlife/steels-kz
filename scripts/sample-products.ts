import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  // 1. Get all leaf categories (categories that have products)
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name_ru, slug, parent_id, level, products_count')
    .gt('products_count', 0)
    .order('name_ru')

  if (catError) {
    console.error('Error fetching categories:', catError)
    return
  }

  console.log(`Total categories with products: ${categories.length}\n`)

  // 2. For each category, get one product with its attributes
  const samples: any[] = []

  for (const cat of categories) {
    // Get one product from this category
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name_ru, slug, sku, description_ru, meta_title_ru, meta_description_ru, price, source_url')
      .eq('category_id', cat.id)
      .limit(1)

    if (prodError || !products || products.length === 0) continue

    const product = products[0]

    // Get product attributes
    const { data: attrs } = await supabase
      .from('product_attributes')
      .select('value_text, value_numeric, attribute_definitions(name_ru, unit, attribute_type)')
      .eq('product_id', product.id)

    samples.push({
      category: cat.name_ru,
      category_level: cat.level,
      category_slug: cat.slug,
      products_count: cat.products_count,
      product: {
        name: product.name_ru,
        sku: product.sku,
        slug: product.slug,
        description: product.description_ru?.substring(0, 300),
        meta_title: product.meta_title_ru,
        meta_description: product.meta_description_ru?.substring(0, 300),
        price: product.price,
        source_url: product.source_url,
      },
      attributes: (attrs || []).map((a: any) => ({
        name: a.attribute_definitions?.name_ru,
        unit: a.attribute_definitions?.unit,
        type: a.attribute_definitions?.attribute_type,
        value: a.value_text || a.value_numeric,
      })),
    })
  }

  console.log(`Sampled ${samples.length} products from ${categories.length} categories\n`)

  // 3. Output as JSON for analysis
  console.log(JSON.stringify(samples, null, 2))

  // 4. Summary statistics
  console.log('\n\n=== SUMMARY ===')

  // Name patterns
  const names = samples.map(s => s.product.name)
  const avgNameLen = names.reduce((sum, n) => sum + n.length, 0) / names.length
  console.log(`\nAvg name length: ${avgNameLen.toFixed(0)} chars`)

  // Description stats
  const withDesc = samples.filter(s => s.product.description)
  console.log(`Products with description: ${withDesc.length}/${samples.length}`)

  // Meta title stats
  const withMetaTitle = samples.filter(s => s.product.meta_title)
  console.log(`Products with meta_title: ${withMetaTitle.length}/${samples.length}`)

  // Meta description stats
  const withMetaDesc = samples.filter(s => s.product.meta_description)
  console.log(`Products with meta_description: ${withMetaDesc.length}/${samples.length}`)

  // Price stats
  const withPrice = samples.filter(s => s.product.price)
  console.log(`Products with price: ${withPrice.length}/${samples.length}`)

  // Attribute stats
  const attrCounts = samples.map(s => s.attributes.length)
  const avgAttrs = attrCounts.reduce((sum, n) => sum + n, 0) / attrCounts.length
  console.log(`Avg attributes per product: ${avgAttrs.toFixed(1)}`)

  // Unique attribute names
  const allAttrNames = new Set<string>()
  samples.forEach(s => s.attributes.forEach((a: any) => allAttrNames.add(a.name)))
  console.log(`Unique attribute names: ${allAttrNames.size}`)
  console.log(`Attributes: ${[...allAttrNames].sort().join(', ')}`)

  // Category levels distribution
  const levels: Record<number, number> = {}
  samples.forEach(s => { levels[s.category_level] = (levels[s.category_level] || 0) + 1 })
  console.log(`\nCategory levels: ${JSON.stringify(levels)}`)

  // Products count per category
  const prodCounts = samples.map(s => s.products_count)
  const totalProds = prodCounts.reduce((sum: number, n: number) => sum + n, 0)
  console.log(`Total products across sampled categories: ${totalProds}`)
  console.log(`Min products in category: ${Math.min(...prodCounts)}`)
  console.log(`Max products in category: ${Math.max(...prodCounts)}`)
  console.log(`Avg products per category: ${(totalProds / samples.length).toFixed(0)}`)
}

main()
