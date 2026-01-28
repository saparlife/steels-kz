import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'images'
const FOLDER = 'products'
const CONCURRENT_DOWNLOADS = 5
const DELAY_MS = 100

// Stats
let downloaded = 0
let failed = 0
let updated = 0

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Extract base filename from URL (without the unique ID prefix)
function getBaseFilename(url: string): string | null {
  // Pattern: /img/product/XXX/ID-rest-of-name.ext
  const match = url.match(/\/img\/product\/\d+\/\d+-(.+)$/)
  return match ? match[1] : null
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*',
      }
    })

    if (!response.ok) {
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch {
    return null
  }
}

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || 'png'
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
  }
  return mimeTypes[ext] || 'image/png'
}

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  Smart Image Downloader (with deduplication)')
  console.log('═══════════════════════════════════════════════════\n')

  // Step 1: Get all unique base patterns and one example URL for each
  console.log('Step 1: Analyzing image patterns...')

  const patternMap = new Map<string, string>() // basePattern -> example source_url
  let offset = 0
  const batchSize = 1000

  while (true) {
    const { data } = await supabase
      .from('product_images')
      .select('source_url')
      .range(offset, offset + batchSize - 1)

    if (!data || data.length === 0) break

    data.forEach(img => {
      if (img.source_url) {
        const base = getBaseFilename(img.source_url)
        if (base && !patternMap.has(base)) {
          patternMap.set(base, img.source_url)
        }
      }
    })

    offset += batchSize
    if (offset % 50000 === 0) {
      console.log(`  Analyzed ${offset} records, found ${patternMap.size} unique patterns`)
    }
  }

  console.log(`\n  Total unique images to download: ${patternMap.size}`)

  // Step 2: Check what's already in storage
  console.log('\nStep 2: Checking existing files in storage...')

  const { data: existingFiles } = await supabase.storage
    .from(BUCKET_NAME)
    .list(FOLDER, { limit: 10000 })

  const existingSet = new Set(existingFiles?.map(f => f.name) || [])
  console.log(`  Already in storage: ${existingSet.size} files`)

  // Step 3: Download missing images
  console.log('\nStep 3: Downloading missing images...')

  const toDownload = Array.from(patternMap.entries())
    .filter(([base]) => !existingSet.has(base))

  console.log(`  Need to download: ${toDownload.length} files\n`)

  // Download with concurrency
  for (let i = 0; i < toDownload.length; i += CONCURRENT_DOWNLOADS) {
    const batch = toDownload.slice(i, i + CONCURRENT_DOWNLOADS)

    await Promise.all(batch.map(async ([baseFilename, sourceUrl]) => {
      await delay(DELAY_MS)

      const imageData = await downloadImage(sourceUrl)
      if (!imageData) {
        failed++
        console.log(`  ✗ Failed: ${baseFilename}`)
        return
      }

      const filePath = `${FOLDER}/${baseFilename}`
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, imageData, {
          contentType: getMimeType(baseFilename),
          upsert: true,
        })

      if (error) {
        failed++
        console.log(`  ✗ Upload failed: ${baseFilename} - ${error.message}`)
      } else {
        downloaded++
        console.log(`  ✓ Downloaded: ${baseFilename}`)
      }
    }))

    // Progress
    const progress = Math.min(i + CONCURRENT_DOWNLOADS, toDownload.length)
    console.log(`\n  Progress: ${progress}/${toDownload.length} (${downloaded} ok, ${failed} failed)\n`)
  }

  // Step 4: Create mapping and update product_images
  console.log('\nStep 4: Updating product_images with new URLs...')

  // Get public URL base
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${FOLDER}/test`)
  const publicUrlBase = urlData.publicUrl.replace('/test', '')

  // Update in batches
  offset = 0
  const updateBatchSize = 500

  while (true) {
    const { data: images } = await supabase
      .from('product_images')
      .select('id, source_url')
      .filter('url', 'ilike', '%temir-service.kz%')
      .range(offset, offset + updateBatchSize - 1)

    if (!images || images.length === 0) break

    // Build updates
    const updates = images
      .filter(img => img.source_url)
      .map(img => {
        const base = getBaseFilename(img.source_url)
        if (!base) return null
        return {
          id: img.id,
          url: `${publicUrlBase}/${base}`
        }
      })
      .filter(Boolean)

    // Batch update
    for (const update of updates) {
      if (update) {
        await supabase
          .from('product_images')
          .update({ url: update.url })
          .eq('id', update.id)
        updated++
      }
    }

    console.log(`  Updated ${updated} records...`)

    // Check remaining
    const { count } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true })
      .filter('url', 'ilike', '%temir-service.kz%')

    if (!count || count === 0) break
  }

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\n  Downloaded: ${downloaded}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Updated records: ${updated}`)
  console.log(`\n  Storage URL: ${publicUrlBase}/`)
}

main().catch(console.error)
