import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Total images
  const { count: totalImages } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
  
  console.log('Total images:', totalImages)
  
  // Get ALL source URLs to count truly unique
  let allUrls: string[] = []
  let offset = 0
  const batchSize = 1000
  
  while (true) {
    const { data } = await supabase
      .from('product_images')
      .select('source_url')
      .range(offset, offset + batchSize - 1)
    
    if (!data || data.length === 0) break
    allUrls = allUrls.concat(data.map(d => d.source_url).filter(Boolean))
    offset += batchSize
    if (offset % 10000 === 0) console.log(`  fetched ${offset}...`)
  }
  
  const uniqueUrls = new Set(allUrls)
  console.log('\nUnique URLs:', uniqueUrls.size)
  
  // Analyze patterns - extract base filename
  const basePatterns = new Set<string>()
  uniqueUrls.forEach(url => {
    // Pattern: /img/product/XXX/ID-rest-of-name.ext
    const match = url.match(/\/img\/product\/\d+\/\d+-(.+)$/)
    if (match) {
      basePatterns.add(match[1])
    }
  })
  
  console.log('Unique base patterns (real unique images):', basePatterns.size)
  console.log('\nSample patterns:')
  Array.from(basePatterns).slice(0, 15).forEach(p => console.log(' -', p))
}

main().catch(console.error)
