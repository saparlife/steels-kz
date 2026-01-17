import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

// Config
const BASE_URL = 'https://steels.kz'
const CATALOG_URL = `${BASE_URL}/katalog-produktsii/`
const DELAY_MS = 300 // Delay between requests

// Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface ParsedCategory {
  name_ru: string
  slug: string
  image_url: string | null
  products_count: number
  source_url: string
  parent_path: string
  children: ParsedCategory[]
}

// Stats
let totalCategories = 0
let totalRequests = 0
const categoryByLevel: Record<number, number> = {}

// Utility: delay
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Utility: extract slug from URL
function extractSlug(url: string): string {
  const parts = url.replace(/\/$/, '').split('/')
  return parts[parts.length - 1] || ''
}

// Utility: get expected parent path from URL
function getParentPath(url: string): string {
  // URL like /katalog-produktsii/chernyj-metalloprokat/sortovoj-prokat/
  // Parent path: chernyj-metalloprokat
  const match = url.match(/\/katalog-produktsii\/(.+?)\/?$/)
  if (!match) return ''

  const parts = match[1].replace(/\/$/, '').split('/')
  parts.pop() // Remove last segment
  return parts.join('/')
}

// Fetch and parse HTML
async function fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
  totalRequests++
  console.log(`  [${totalRequests}] Fetching: ${url}`)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      }
    })

    if (!response.ok) {
      console.error(`    HTTP ${response.status} for ${url}`)
      return null
    }

    const html = await response.text()
    return cheerio.load(html)
  } catch (error) {
    console.error(`    Error fetching ${url}:`, error)
    return null
  }
}

// Parse category cards from a page
// Key insight: category CARDS have images, sidebar menu items don't
function parseCategoryCards($: cheerio.CheerioAPI, currentPath: string): ParsedCategory[] {
  const categories: ParsedCategory[] = []
  const seenSlugs = new Set<string>()

  // Find all links that:
  // 1. Point to /katalog-produktsii/...
  // 2. Have an image inside (category cards have images)
  // 3. Are direct children of the current category path

  $('a[href^="/katalog-produktsii/"]').each((_, el) => {
    const $link = $(el)
    const href = $link.attr('href') || ''

    // Skip if no href or is root catalog
    if (!href || href === '/katalog-produktsii/') return

    // Check if this link contains an image (category cards have images)
    const $img = $link.find('img')
    if ($img.length === 0) return

    // Extract slug and verify it's a direct child
    const slug = extractSlug(href)
    if (!slug || seenSlugs.has(slug)) return

    // Build full path from href
    const hrefPath = href.replace('/katalog-produktsii/', '').replace(/\/$/, '')

    // Check if this is a direct child of current path
    // currentPath: "" (root) -> child should be "something" (no slashes)
    // currentPath: "chernyj-metalloprokat" -> child should be "chernyj-metalloprokat/something"
    if (currentPath === '') {
      // Root level - should have no slashes (direct child)
      if (hrefPath.includes('/')) return
    } else {
      // Nested - should start with current path and have exactly one more segment
      if (!hrefPath.startsWith(currentPath + '/')) return
      const remaining = hrefPath.slice(currentPath.length + 1)
      if (remaining.includes('/')) return
    }

    seenSlugs.add(slug)

    // Get text - category name
    const fullText = $link.text().trim()

    // Extract product count
    const countMatch = fullText.match(/(\d[\d\s]*)\s*товар/)
    const productsCount = countMatch
      ? parseInt(countMatch[1].replace(/\s/g, ''), 10)
      : 0

    // Extract name (remove product count)
    let name = fullText.replace(/\d[\d\s]*\s*товар[а-я]*/gi, '').trim()

    // Fallback to img alt
    if (!name || name.length < 2) {
      name = $img.attr('alt') || slug
    }

    // Get image URL
    let imageUrl = $img.attr('src') || null
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = BASE_URL + imageUrl
    }

    categories.push({
      name_ru: name,
      slug,
      image_url: imageUrl,
      products_count: productsCount,
      source_url: BASE_URL + href,
      parent_path: currentPath,
      children: []
    })
  })

  return categories
}

// Recursively parse categories
async function parseCategories(url: string, currentPath: string = '', depth: number = 0): Promise<ParsedCategory[]> {
  if (depth > 6) {
    console.log(`    Max depth reached at ${url}`)
    return []
  }

  await delay(DELAY_MS)

  const $ = await fetchPage(url)
  if (!$) return []

  const categories = parseCategoryCards($, currentPath)

  if (categories.length > 0) {
    console.log(`    Found ${categories.length} subcategories`)
  }

  // Recursively parse each category's children
  for (const category of categories) {
    totalCategories++
    categoryByLevel[depth] = (categoryByLevel[depth] || 0) + 1

    const childPath = currentPath ? `${currentPath}/${category.slug}` : category.slug
    console.log(`\n  [L${depth}] ${category.name_ru} (${category.products_count} товаров)`)

    // Parse children
    const children = await parseCategories(category.source_url, childPath, depth + 1)
    category.children = children
  }

  return categories
}

// Insert categories into database recursively
async function insertCategories(
  categories: ParsedCategory[],
  parentId: string | null = null,
  level: number = 0,
  parentSlug: string = ''
): Promise<number> {
  let inserted = 0

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]
    const fullSlug = parentSlug ? `${parentSlug}/${cat.slug}` : cat.slug

    const categoryData = {
      name_ru: cat.name_ru,
      name_kz: null,
      slug: fullSlug,
      image_url: cat.image_url,
      parent_id: parentId,
      level,
      sort_order: i,
      products_count: cat.products_count,
      is_active: true
    }

    // Insert category
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select('id')
      .single()

    if (error) {
      console.error(`  ✗ Error inserting "${cat.name_ru}":`, error.message)
      continue
    }

    inserted++
    console.log(`  ✓ [L${level}] ${cat.name_ru}`)

    // Insert children with this category as parent
    if (cat.children.length > 0 && data?.id) {
      const childrenInserted = await insertCategories(cat.children, data.id, level + 1, fullSlug)
      inserted += childrenInserted
    }
  }

  return inserted
}

// Main
async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  STEELS.KZ Category Parser')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\nStarting from: ${CATALOG_URL}`)
  console.log(`Delay between requests: ${DELAY_MS}ms\n`)

  // Check Supabase connection
  console.log('Checking Supabase connection...')
  const { error: pingError } = await supabase.from('categories').select('id').limit(1)
  if (pingError) {
    console.error('Failed to connect to Supabase:', pingError.message)
    process.exit(1)
  }
  console.log('✓ Supabase connected\n')

  // Clear existing categories (optional - comment out if you want to keep existing)
  console.log('Clearing existing categories...')
  const { error: deleteError } = await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('Warning: Could not clear categories:', deleteError.message)
  }
  console.log('✓ Categories cleared\n')

  // Parse categories
  console.log('═══════════════════════════════════════════════════')
  console.log('  PHASE 1: Parsing categories from steels.kz')
  console.log('═══════════════════════════════════════════════════\n')

  const startTime = Date.now()
  const categories = await parseCategories(CATALOG_URL)
  const parseTime = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  PARSING COMPLETE')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\n  Total categories found: ${totalCategories}`)
  console.log(`  Total HTTP requests: ${totalRequests}`)
  console.log(`  Parse time: ${parseTime}s`)
  console.log('\n  Categories by level:')
  Object.entries(categoryByLevel).forEach(([level, count]) => {
    console.log(`    Level ${level}: ${count} categories`)
  })

  // Insert into database
  console.log('\n═══════════════════════════════════════════════════')
  console.log('  PHASE 2: Inserting into database')
  console.log('═══════════════════════════════════════════════════\n')

  const insertStart = Date.now()
  const insertedCount = await insertCategories(categories)
  const insertTime = ((Date.now() - insertStart) / 1000).toFixed(1)

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\n  Categories inserted/updated: ${insertedCount}`)
  console.log(`  Insert time: ${insertTime}s`)
  console.log(`  Total time: ${((Date.now() - startTime) / 1000).toFixed(1)}s\n`)
}

main().catch(console.error)
