import { createClient } from '@supabase/supabase-js'

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'images'
const FOLDER = 'categories'

interface Category {
  id: string
  name_ru: string
  slug: string
  image_url: string | null
}

// Stats
let downloaded = 0
let failed = 0
let skipped = 0

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/*',
      }
    })

    if (!response.ok) {
      console.error(`    HTTP ${response.status} for ${url}`)
      return null
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error(`    Error downloading ${url}:`, error)
    return null
  }
}

function getFileExtension(url: string): string {
  const match = url.match(/\.(\w+)(?:\?.*)?$/)
  return match ? match[1].toLowerCase() : 'png'
}

function slugToFileName(slug: string): string {
  // Convert slug path to filename: chernyj-metalloprokat/kanat-stalnoj -> chernyj-metalloprokat_kanat-stalnoj
  return slug.replace(/\//g, '_')
}

async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets()

  if (!buckets?.find(b => b.name === BUCKET_NAME)) {
    console.log(`Creating bucket "${BUCKET_NAME}"...`)
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    })
    if (error && !error.message.includes('already exists')) {
      throw error
    }
  }
  console.log(`✓ Bucket "${BUCKET_NAME}" ready`)
}

async function processCategory(category: Category): Promise<boolean> {
  const { id, name_ru, slug, image_url } = category

  // Skip if no image or already our URL
  if (!image_url) {
    console.log(`  [SKIP] ${name_ru} - no image`)
    skipped++
    return false
  }

  if (image_url.includes(supabaseUrl)) {
    console.log(`  [SKIP] ${name_ru} - already in storage`)
    skipped++
    return false
  }

  // Only process external images (steels.kz)
  if (!image_url.includes('steels.kz')) {
    console.log(`  [SKIP] ${name_ru} - not steels.kz URL`)
    skipped++
    return false
  }

  console.log(`  [DOWN] ${name_ru}`)

  // Download image
  const imageData = await downloadImage(image_url)
  if (!imageData) {
    console.log(`    ✗ Failed to download`)
    failed++
    return false
  }

  // Prepare file path
  const ext = getFileExtension(image_url)
  const fileName = `${slugToFileName(slug)}.${ext}`
  const filePath = `${FOLDER}/${fileName}`

  // Upload to Supabase Storage
  // Map jpg to jpeg for correct MIME type
  const mimeExt = ext === 'jpg' ? 'jpeg' : ext
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageData, {
      contentType: `image/${mimeExt}`,
      upsert: true,
    })

  if (uploadError) {
    console.log(`    ✗ Upload failed: ${uploadError.message}`)
    failed++
    return false
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  const newImageUrl = urlData.publicUrl

  // Update category in database
  const { error: updateError } = await supabase
    .from('categories')
    .update({ image_url: newImageUrl })
    .eq('id', id)

  if (updateError) {
    console.log(`    ✗ DB update failed: ${updateError.message}`)
    failed++
    return false
  }

  console.log(`    ✓ Uploaded: ${fileName}`)
  downloaded++
  return true
}

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  Category Images Downloader')
  console.log('═══════════════════════════════════════════════════\n')

  // Ensure bucket exists
  await ensureBucketExists()

  // Get all categories with external images
  console.log('\nFetching categories...')
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name_ru, slug, image_url')
    .not('image_url', 'is', null)
    .order('level')
    .order('sort_order')

  if (error) {
    console.error('Failed to fetch categories:', error.message)
    process.exit(1)
  }

  const cats = (categories || []) as Category[]
  console.log(`Found ${cats.length} categories with images\n`)

  // Process each category
  console.log('═══════════════════════════════════════════════════')
  console.log('  Downloading and uploading images')
  console.log('═══════════════════════════════════════════════════\n')

  const startTime = Date.now()

  for (const category of cats) {
    await processCategory(category)
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\n  Downloaded: ${downloaded}`)
  console.log(`  Skipped: ${skipped}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Time: ${elapsed}s\n`)
}

main().catch(console.error)
