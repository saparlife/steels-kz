import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('=== STEELS MENTIONS ===\n')

  // Products - description_ru
  const { count: descRu } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('description_ru', '%steels%')
  console.log('products.description_ru:', descRu)

  // Products - name_ru
  const { count: nameRu } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('name_ru', '%steels%')
  console.log('products.name_ru:', nameRu)

  // Products - meta_title_ru
  const { count: metaTitleRu } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('meta_title_ru', '%steels%')
  console.log('products.meta_title_ru:', metaTitleRu)

  // Products - meta_description_ru
  const { count: metaDescRu } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .ilike('meta_description_ru', '%steels%')
  console.log('products.meta_description_ru:', metaDescRu)

  // Categories
  const { count: catDescRu } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .ilike('description_ru', '%steels%')
  console.log('categories.description_ru:', catDescRu)

  // Sample description to see the pattern
  console.log('\n=== SAMPLE DESCRIPTION ===')
  const { data: sample } = await supabase
    .from('products')
    .select('description_ru')
    .ilike('description_ru', '%steels%')
    .limit(1)
  if (sample?.[0]) {
    console.log(sample[0].description_ru)
  }

  // Check unique description patterns
  console.log('\n=== UNIQUE DESCRIPTION PATTERNS ===')
  const { data: patterns } = await supabase
    .from('products')
    .select('description_ru')
    .not('description_ru', 'is', null)
    .limit(100)

  const uniquePatterns = new Set<string>()
  patterns?.forEach(p => {
    if (p.description_ru) {
      // Extract email pattern
      const emailMatch = p.description_ru.match(/[\w.]+@steels\.kz/g)
      if (emailMatch) emailMatch.forEach((e: string) => uniquePatterns.add(e))
    }
  })
  console.log('Unique emails found:', Array.from(uniquePatterns))
}

main().catch(console.error)
