import { createClient } from '@supabase/supabase-js'
import http from 'http'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'images'
const FOLDER = 'products'
const CONCURRENT_DOWNLOADS = 5
const CONCURRENT_UPDATES = 50  // Parallel DB updates
const DELAY_MS = 100
const PORT = 3000

// Progress state
const state = {
  status: 'starting',
  phase: '',
  totalImages: 0,
  uniquePatterns: 0,
  existingInStorage: 0,
  toDownload: 0,
  downloaded: 0,
  failed: 0,
  updated: 0,
  totalToUpdate: 0,
  startedAt: new Date().toISOString(),
  lastUpdate: new Date().toISOString(),
}

function updateState(updates: Partial<typeof state>) {
  Object.assign(state, updates, { lastUpdate: new Date().toISOString() })
}

// HTTP Server for health/progress
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json')

  if (req.url === '/health' || req.url === '/') {
    const progress = state.toDownload > 0
      ? Math.round((state.downloaded + state.failed) / state.toDownload * 100)
      : 0
    const updateProgress = state.totalToUpdate > 0
      ? Math.round(state.updated / state.totalToUpdate * 100)
      : 0

    res.end(JSON.stringify({
      ...state,
      downloadProgress: `${progress}%`,
      updateProgress: `${updateProgress}%`,
    }, null, 2))
  } else {
    res.statusCode = 404
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

server.listen(PORT, () => {
  console.log(`Health server running on port ${PORT}`)
})

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Extract base filename from URL (without the unique ID prefix)
function getBaseFilename(url: string): string | null {
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

    if (!response.ok) return null

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

  updateState({ status: 'running', phase: 'analyzing' })

  // Step 1: Get total count
  const { count: totalImages } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })

  updateState({ totalImages: totalImages || 0 })
  console.log(`Total images in DB: ${totalImages}`)

  // Step 2: Get all unique base patterns
  console.log('\nStep 1: Analyzing image patterns...')
  const patternMap = new Map<string, string>()
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
      updateState({ uniquePatterns: patternMap.size })
    }
  }

  updateState({ uniquePatterns: patternMap.size })
  console.log(`\n  Total unique images: ${patternMap.size}`)

  // Step 3: Check existing in storage
  console.log('\nStep 2: Checking existing files in storage...')
  updateState({ phase: 'checking_storage' })

  const { data: existingFiles } = await supabase.storage
    .from(BUCKET_NAME)
    .list(FOLDER, { limit: 10000 })

  const existingSet = new Set(existingFiles?.map(f => f.name) || [])
  updateState({ existingInStorage: existingSet.size })
  console.log(`  Already in storage: ${existingSet.size} files`)

  // Step 4: Download missing
  console.log('\nStep 3: Downloading missing images...')
  updateState({ phase: 'downloading' })

  const toDownload = Array.from(patternMap.entries())
    .filter(([base]) => !existingSet.has(base))

  updateState({ toDownload: toDownload.length })
  console.log(`  Need to download: ${toDownload.length} files\n`)

  for (let i = 0; i < toDownload.length; i += CONCURRENT_DOWNLOADS) {
    const batch = toDownload.slice(i, i + CONCURRENT_DOWNLOADS)

    await Promise.all(batch.map(async ([baseFilename, sourceUrl]) => {
      await delay(DELAY_MS)

      const imageData = await downloadImage(sourceUrl)
      if (!imageData) {
        state.failed++
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
        state.failed++
        console.log(`  ✗ Upload failed: ${baseFilename}`)
      } else {
        state.downloaded++
        console.log(`  ✓ ${baseFilename}`)
      }
    }))

    updateState({})
    const progress = Math.min(i + CONCURRENT_DOWNLOADS, toDownload.length)
    console.log(`  [${progress}/${toDownload.length}] downloaded: ${state.downloaded}, failed: ${state.failed}`)
  }

  // Step 5: Update product_images with parallel updates
  console.log('\nStep 4: Updating product_images with new URLs...')
  updateState({ phase: 'updating_db' })

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${FOLDER}/test`)
  const publicUrlBase = urlData.publicUrl.replace('/test', '')

  // Get count of records to update
  const { count: toUpdateCount } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .filter('url', 'ilike', '%temir-service.kz%')

  updateState({ totalToUpdate: toUpdateCount || 0 })
  console.log(`  Records to update: ${toUpdateCount}`)

  const fetchBatchSize = 500

  while (true) {
    // Fetch batch of records that still need updating
    const { data: images } = await supabase
      .from('product_images')
      .select('id, source_url')
      .filter('url', 'ilike', '%temir-service.kz%')
      .limit(fetchBatchSize)

    if (!images || images.length === 0) break

    // Process in parallel chunks
    for (let i = 0; i < images.length; i += CONCURRENT_UPDATES) {
      const chunk = images.slice(i, i + CONCURRENT_UPDATES)

      await Promise.all(chunk.map(async (img) => {
        if (!img.source_url) return
        const base = getBaseFilename(img.source_url)
        if (!base) return

        await supabase
          .from('product_images')
          .update({ url: `${publicUrlBase}/${base}` })
          .eq('id', img.id)

        state.updated++
      }))
    }

    updateState({})
    console.log(`  Updated: ${state.updated} / ${state.totalToUpdate} (${Math.round(state.updated / state.totalToUpdate * 100)}%)`)
  }

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log('═══════════════════════════════════════════════════')
  console.log(`  Downloaded: ${state.downloaded}`)
  console.log(`  Failed: ${state.failed}`)
  console.log(`  Updated: ${state.updated}`)

  updateState({ status: 'completed', phase: 'done' })

  // Keep server running for a bit to check final status
  setTimeout(() => {
    console.log('\nShutting down...')
    server.close()
    process.exit(0)
  }, 60000)
}

main().catch(err => {
  console.error('Fatal error:', err)
  updateState({ status: 'error', phase: err.message })
})
