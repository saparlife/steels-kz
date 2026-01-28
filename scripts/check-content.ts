import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Check products table structure and sample
  console.log('=== PRODUCTS SAMPLE ===')
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .limit(2)
  console.log(JSON.stringify(products, null, 2))

  // Check categories
  console.log('\n=== CATEGORIES SAMPLE ===')
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(2)
  console.log(JSON.stringify(categories, null, 2))

  // Search for "steels" mentions in products
  console.log('\n=== STEELS MENTIONS IN PRODUCTS ===')
  const { count: steelsInName } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('name', '%steels%')
  console.log('In name:', steelsInName)

  const { count: steelsInDesc } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('description', '%steels%')
  console.log('In description:', steelsInDesc)

  const { count: steelsInMeta } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('meta_description', '%steels%')
  console.log('In meta_description:', steelsInMeta)

  // Check source_url in products
  const { count: steelsInSource } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('source_url', '%steels%')
  console.log('In source_url:', steelsInSource)

  // Check categories for steels
  console.log('\n=== STEELS MENTIONS IN CATEGORIES ===')
  const { count: steelsInCatName } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .ilike('name', '%steels%')
  console.log('In name:', steelsInCatName)

  const { count: steelsInCatDesc } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .ilike('description', '%steels%')
  console.log('In description:', steelsInCatDesc)

  const { count: steelsInCatSource } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .ilike('source_url', '%steels%')
  console.log('In source_url:', steelsInCatSource)

  // Total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
  console.log('\n=== TOTALS ===')
  console.log('Total products:', totalProducts)

  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
  console.log('Total categories:', totalCategories)
}

main().catch(console.error)
