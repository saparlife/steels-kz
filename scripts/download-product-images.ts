import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'images'
const FOLDER = 'products'
const BATCH_SIZE = 100
const CONCURRENT_DOWNLOADS = 10
const DELAY_MS = 50

// Stats
let downloaded = 0
let skipped = 0
let failed = 0
let deduplicated = 0

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
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

function getFileExtension(url: string): string {
  const match = url.match(/\.(\w+)(?:\?.*)?$/)
  return match ? match[1].toLowerCase() : 'png'
}

function generateFileName(sourceUrl: string): string {
  // Extract filename from URL and sanitize
  const urlPath = sourceUrl.split('?')[0]
  const parts = urlPath.split('/')
  let fileName = parts[parts.length - 1] || 'image'

  // Remove special characters
  fileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-')

  // Ensure extension
  if (!fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    const ext = getFileExtension(sourceUrl)
    fileName = `${fileName}.${ext}`
  }

  return fileName
}

async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number
): Promise<R[]> {
  const results: R[] = []
  let index = 0

  async function worker() {
    while (index < items.length) {
      const i = index++
      await delay(DELAY_MS)
      results[i] = await fn(items[i])
    }
  }

  const workers = Array(Math.min(concurrency, items.length)).fill(null).map(() => worker())
  await Promise.all(workers)

  return results
}

async function processImage(image: { id: string; source_url: string; product_id: string }): Promise<boolean> {
  const { source_url } = image

  // Check if already in mapping
  const { data: mapping } = await supabase
    .from('image_mapping')
    .select('storage_url')
    .eq('source_url', source_url)
    .single()

  if (mapping?.storage_url) {
    // Already downloaded, just update product_images
    const { error } = await supabase
      .from('product_images')
      .update({ url: mapping.storage_url })
      .eq('id', image.id)

    if (!error) {
      deduplicated++
      return true
    }
    return false
  }

  // Download image
  const imageData = await downloadImage(source_url)
  if (!imageData) {
    failed++
    return false
  }

  // Generate file path
  const fileName = generateFileName(source_url)
  const filePath = `${FOLDER}/${fileName}`

  // Get mime type
  const ext = getFileExtension(source_url)
  const mimeExt = ext === 'jpg' ? 'jpeg' : ext

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageData, {
      contentType: `image/${mimeExt}`,
      upsert: true,
    })

  if (uploadError) {
    // Try with unique name
    const uniquePath = `${FOLDER}/${Date.now()}-${fileName}`
    const { error: retryError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniquePath, imageData, {
        contentType: `image/${mimeExt}`,
        upsert: true,
      })

    if (retryError) {
      failed++
      return false
    }
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  const storageUrl = urlData.publicUrl

  // Save to mapping
  await supabase
    .from('image_mapping')
    .upsert({
      source_url,
      storage_url: storageUrl,
      file_name: fileName
    }, { onConflict: 'source_url' })

  // Update product_images
  await supabase
    .from('product_images')
    .update({ url: storageUrl })
    .eq('id', image.id)

  downloaded++
  return true
}

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  Product Images Downloader')
  console.log('═══════════════════════════════════════════════════\n')

  // Get images that need downloading (source_url != url, meaning not yet processed)
  const { count: totalImages } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .not('source_url', 'is', null)
    .filter('url', 'ilike', '%steels.kz%')

  console.log(`Found ${totalImages} images to process\n`)

  if (!totalImages || totalImages === 0) {
    console.log('No images to download!')
    return
  }

  const startTime = Date.now()
  let offset = 0

  while (offset < totalImages) {
    console.log(`Processing batch ${Math.floor(offset / BATCH_SIZE) + 1}...`)

    // Get batch of images
    const { data: images, error } = await supabase
      .from('product_images')
      .select('id, source_url, product_id')
      .not('source_url', 'is', null)
      .filter('url', 'ilike', '%steels.kz%')
      .range(offset, offset + BATCH_SIZE - 1)

    if (error) {
      console.error('Failed to fetch images:', error.message)
      break
    }

    if (!images || images.length === 0) break

    // Process with concurrency
    await processWithConcurrency(
      images.filter(img => img.source_url),
      (img) => processImage(img as { id: string; source_url: string; product_id: string }),
      CONCURRENT_DOWNLOADS
    )

    console.log(`  Downloaded: ${downloaded}, Deduped: ${deduplicated}, Failed: ${failed}`)

    // Note: offset stays same because we're updating records we select
    // Re-fetch will get different records
    const { count: remaining } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true })
      .not('source_url', 'is', null)
      .filter('url', 'ilike', '%steels.kz%')

    if (!remaining || remaining === 0) break

    // If remaining same as before, we might be stuck
    if (remaining === totalImages - offset) {
      offset += BATCH_SIZE
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\n  Downloaded: ${downloaded}`)
  console.log(`  Deduplicated: ${deduplicated}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Time: ${elapsed} minutes\n`)
}

main().catch(console.error)
