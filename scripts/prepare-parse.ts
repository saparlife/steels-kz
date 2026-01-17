import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BASE_URL = 'https://steels.kz'

async function createTables() {
  console.log('Checking tables...')
  // Tables should be created via SQL in Supabase Dashboard
  // This function just verifies they exist

  const { error: progressError } = await supabase
    .from('parse_progress')
    .select('category_id')
    .limit(1)

  if (progressError?.message?.includes('does not exist')) {
    console.error('\n⚠ Table parse_progress does not exist!')
    console.log('Please run the SQL from docs/parsing.md in Supabase Dashboard first.\n')
    process.exit(1)
  }

  console.log('✓ Tables ready')
}

async function findLeafCategories() {
  console.log('\nFinding leaf categories (no children)...')

  // Get all categories
  const { data: allCategories, error } = await supabase
    .from('categories')
    .select('id, slug, name_ru, parent_id, level')
    .eq('is_active', true)
    .order('level')
    .order('sort_order')

  if (error) {
    console.error('Failed to fetch categories:', error.message)
    process.exit(1)
  }

  const categories = allCategories || []

  // Find categories that have no children (leaf categories)
  const parentIds = new Set(categories.map(c => c.parent_id).filter(Boolean))
  const leafCategories = categories.filter(c => !parentIds.has(c.id))

  console.log(`Total categories: ${categories.length}`)
  console.log(`Leaf categories (for parsing): ${leafCategories.length}`)

  // Show by level
  const byLevel: Record<number, number> = {}
  leafCategories.forEach(c => {
    byLevel[c.level] = (byLevel[c.level] || 0) + 1
  })
  console.log('\nLeaf categories by level:')
  Object.entries(byLevel).forEach(([level, count]) => {
    console.log(`  Level ${level}: ${count}`)
  })

  return leafCategories
}

async function initializeProgress(leafCategories: Array<{ id: string; slug: string; name_ru: string }>) {
  console.log('\nInitializing parse_progress...')

  // Get existing entries
  const { data: existing } = await supabase
    .from('parse_progress')
    .select('category_id')

  const existingIds = new Set((existing || []).map(e => e.category_id))

  // Filter out already existing
  const newCategories = leafCategories.filter(cat => !existingIds.has(cat.id))

  if (newCategories.length === 0) {
    console.log(`✓ All ${leafCategories.length} categories already in parse_progress`)
    return
  }

  // Batch insert new entries
  const BATCH_SIZE = 100
  let inserted = 0

  for (let i = 0; i < newCategories.length; i += BATCH_SIZE) {
    const batch = newCategories.slice(i, i + BATCH_SIZE)
    const records = batch.map(cat => ({
      category_id: cat.id,
      source_url: `${BASE_URL}/katalog-produktsii/${cat.slug}/`,
      attributes_parsed: false,
      products_parsed: false,
      products_count: 0,
      last_page: 0,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('parse_progress')
      .insert(records)

    if (error) {
      console.error(`  Batch error: ${error.message}`)
    } else {
      inserted += batch.length
      console.log(`  Inserted ${inserted}/${newCategories.length}...`)
    }
  }

  console.log(`✓ Progress initialized: ${inserted} new, ${existingIds.size} existing`)
}

async function showStats() {
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  Current parsing status')
  console.log('═══════════════════════════════════════════════════\n')

  // Attributes parsed
  const { count: attrParsed } = await supabase
    .from('parse_progress')
    .select('*', { count: 'exact', head: true })
    .eq('attributes_parsed', true)

  const { count: attrNotParsed } = await supabase
    .from('parse_progress')
    .select('*', { count: 'exact', head: true })
    .eq('attributes_parsed', false)

  // Products parsed
  const { count: prodParsed } = await supabase
    .from('parse_progress')
    .select('*', { count: 'exact', head: true })
    .eq('products_parsed', true)

  const { count: prodNotParsed } = await supabase
    .from('parse_progress')
    .select('*', { count: 'exact', head: true })
    .eq('products_parsed', false)

  // Total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  // Total attributes
  const { count: totalAttrs } = await supabase
    .from('attribute_definitions')
    .select('*', { count: 'exact', head: true })

  console.log(`Attributes parsing: ${attrParsed || 0}/${(attrParsed || 0) + (attrNotParsed || 0)} categories done`)
  console.log(`Products parsing: ${prodParsed || 0}/${(prodParsed || 0) + (prodNotParsed || 0)} categories done`)
  console.log(`\nTotal attribute definitions: ${totalAttrs || 0}`)
  console.log(`Total products in DB: ${totalProducts || 0}`)
}

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  Parse Preparation')
  console.log('═══════════════════════════════════════════════════\n')

  // Create tables (might fail if no exec_sql RPC, but that's ok)
  await createTables()

  // Find leaf categories
  const leafCategories = await findLeafCategories()

  // Initialize progress tracking
  await initializeProgress(leafCategories)

  // Show current stats
  await showStats()

  console.log('\n✓ Ready to parse!')
  console.log('\nNext steps:')
  console.log('  1. npm run parse:attributes  - Parse category attributes/filters')
  console.log('  2. npm run parse:products    - Parse products')
  console.log('  3. npm run download:product-images - Download product images')
}

main().catch(console.error)
