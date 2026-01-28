import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name_ru')
    .order('name_ru')

  console.log(`Total categories: ${categories?.length}\n`)

  const descriptions = new Set<string>()
  const phones = new Set<string>()
  const emails = new Set<string>()
  const addresses = new Set<string>()
  const namePatterns: string[] = []

  // Get 1 product from each category
  for (const cat of categories || []) {
    const { data: product } = await supabase
      .from('products')
      .select('name_ru, description_ru, meta_title_ru, meta_description_ru')
      .eq('category_id', cat.id)
      .limit(1)
      .single()

    if (product) {
      // Collect name patterns
      if (product.name_ru) {
        namePatterns.push(product.name_ru)
      }

      // Extract unique patterns from description
      if (product.description_ru) {
        // Extract phone
        const phoneMatch = product.description_ru.match(/\+7\s*\([^)]+\)\s*[\d-]+/g)
        if (phoneMatch) phoneMatch.forEach((p: string) => phones.add(p.trim()))

        // Extract email
        const emailMatch = product.description_ru.match(/[\w.]+@[\w.]+\.[a-z]+/gi)
        if (emailMatch) emailMatch.forEach((e: string) => emails.add(e))

        // Extract address (after "адресу")
        const addrMatch = product.description_ru.match(/адресу\s+([^,]+,[^,]+,[^,]+)/i)
        if (addrMatch) addresses.add(addrMatch[1].trim())

        // Get description template (first 100 chars)
        const template = product.description_ru.substring(0, 150)
        descriptions.add(template)
      }
    }
  }

  console.log('=== PHONES ===')
  phones.forEach(p => console.log(p))

  console.log('\n=== EMAILS ===')
  emails.forEach(e => console.log(e))

  console.log('\n=== ADDRESSES ===')
  addresses.forEach(a => console.log(a))

  console.log('\n=== DESCRIPTION TEMPLATES (first 20) ===')
  Array.from(descriptions).slice(0, 20).forEach((d, i) => {
    console.log(`\n[${i + 1}] ${d}...`)
  })

  console.log('\n=== NAME PATTERNS (sample 20) ===')
  namePatterns.slice(0, 20).forEach((n, i) => {
    console.log(`${i + 1}. ${n}`)
  })

  console.log('\n=== META TITLE PATTERNS ===')
  const { data: metaSample } = await supabase
    .from('products')
    .select('meta_title_ru, meta_description_ru')
    .not('meta_title_ru', 'is', null)
    .limit(10)

  metaSample?.forEach((m, i) => {
    console.log(`\n[${i + 1}] Title: ${m.meta_title_ru}`)
    console.log(`    Desc: ${m.meta_description_ru}`)
  })
}

main().catch(console.error)
