import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // 1. Get all categories
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('id, name_ru, parent_id, level, products_count')
    .order('level', { ascending: true })

  if (catErr || !categories) {
    console.error('Failed to load categories:', catErr?.message)
    return
  }

  console.log(`${categories.length} categories loaded`)

  // 2. Count direct products per category
  const directCounts = new Map<string, number>()

  for (const cat of categories) {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', cat.id)
      .eq('is_active', true)

    if (!error && count !== null) {
      directCounts.set(cat.id, count)
    }
  }

  console.log(`Direct counts fetched`)

  // 3. Build parent->children map
  const childrenMap = new Map<string, string[]>()
  for (const cat of categories) {
    if (cat.parent_id) {
      if (!childrenMap.has(cat.parent_id)) childrenMap.set(cat.parent_id, [])
      childrenMap.get(cat.parent_id)!.push(cat.id)
    }
  }

  // 4. Calculate total counts (own + all descendants) bottom-up
  const totalCounts = new Map<string, number>()

  function getTotalCount(catId: string): number {
    if (totalCounts.has(catId)) return totalCounts.get(catId)!

    let total = directCounts.get(catId) || 0
    const children = childrenMap.get(catId) || []
    for (const childId of children) {
      total += getTotalCount(childId)
    }
    totalCounts.set(catId, total)
    return total
  }

  for (const cat of categories) {
    getTotalCount(cat.id)
  }

  // 5. Update categories where count changed
  let updated = 0
  for (const cat of categories) {
    const newCount = totalCounts.get(cat.id) || 0
    if (newCount !== cat.products_count) {
      const { error } = await supabase
        .from('categories')
        .update({ products_count: newCount })
        .eq('id', cat.id)

      if (error) {
        console.error('Error updating', cat.name_ru, ':', error.message)
      } else {
        console.log(`  ${cat.name_ru}: ${cat.products_count} -> ${newCount}`)
        updated++
      }
    }
  }

  console.log(`\nUpdated ${updated} categories`)
}

main().catch(console.error)
