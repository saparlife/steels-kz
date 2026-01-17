import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BASE_URL = 'https://steels.kz'
const PRODUCTS_PER_PAGE = 24
const DELAY_MS = 30
const CONCURRENT_REQUESTS = 30

// Stats
let totalProducts = 0
let insertedProducts = 0
let skippedProducts = 0
let failedProducts = 0
let processedCategories = 0
let createdAttributes = 0

// Cache
const attributeCache = new Map<string, string>()

interface ParsedProduct {
  name_ru: string
  slug: string
  sku: string | null
  description_ru: string | null
  image_url: string | null
  meta_title_ru: string | null
  meta_description_ru: string | null
  attributes: Array<{ name: string; value: string; unit: string | null }>
  source_url: string
}

// Transliteration map
const translitMap: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  ' ': '-', '/': '-', '.': '', ',': '', '(': '', ')': '', '№': 'n'
}

function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(char => translitMap[char] ?? char)
    .join('')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseAttributeName(rawName: string): { name: string; unit: string | null } {
  // "Ширина, мм" -> { name: "Ширина", unit: "мм" }
  // "Материал" -> { name: "Материал", unit: null }
  const match = rawName.match(/^(.+?),?\s*(мм|м|кг|шт|мм²|°С|Ом|бар|тн|дюйм)$/i)
  if (match) {
    return { name: match[1].trim(), unit: match[2] }
  }

  // Check for unit in parentheses: "Диаметр (мм)"
  const parenMatch = rawName.match(/^(.+?)\s*\(([^)]+)\)$/)
  if (parenMatch) {
    return { name: parenMatch[1].trim(), unit: parenMatch[2] }
  }

  return { name: rawName.trim(), unit: null }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'ru-RU,ru;q=0.9',
      }
    })

    if (!response.ok) {
      if (response.status === 404) return null
      return null
    }

    const html = await response.text()
    return cheerio.load(html)
  } catch {
    return null
  }
}

function extractSlug(url: string): string {
  const parts = url.replace(/\/$/, '').split('/')
  return parts[parts.length - 1] || ''
}

function parseProductListing($: cheerio.CheerioAPI): Array<{ name: string; url: string; image: string | null }> {
  const products: Array<{ name: string; url: string; image: string | null }> = []

  $('.product-card').each((_, el) => {
    const $card = $(el)
    const $link = $card.find('.product-card__title')
    const href = $link.attr('href')
    const name = $link.find('[itemprop="name"]').text().trim() || $link.text().trim()

    if (!href || !name) return

    let image = $card.find('.product-card__img img').attr('src') || null
    if (image && !image.startsWith('http')) {
      image = BASE_URL + image
    }

    products.push({
      name,
      url: href.startsWith('http') ? href : BASE_URL + href,
      image
    })
  })

  return products
}

function parseProductPage($: cheerio.CheerioAPI, url: string): ParsedProduct | null {
  const title = $('title').text().trim()
  const name = $('h1').first().text().trim() || title.replace(/,\s*цены.*$/, '').trim()

  if (!name || title.includes('не найдена')) {
    return null
  }

  const skuText = $('.s-product__article').text().trim()
  const sku = skuText.replace('Артикул:', '').trim() || null

  let imageUrl = $('.s-product__img img').attr('src') || null
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = BASE_URL + imageUrl
  }

  const description = $('.s-description__text').text().trim() || null
  const metaDescription = $('meta[name="description"]').attr('content') || null

  // Parse attributes with unit extraction
  const attributes: Array<{ name: string; value: string; unit: string | null }> = []
  $('.s-specifications__table tbody tr').each((_, row) => {
    const $row = $(row)
    const rawName = $row.find('td:first-child span').text().trim()
    const value = $row.find('td:last-child').text().trim()

    if (rawName && value) {
      const { name: attrName, unit } = parseAttributeName(rawName)
      attributes.push({ name: attrName, value, unit })
    }
  })

  const slug = extractSlug(url)

  return {
    name_ru: name,
    slug,
    sku,
    description_ru: description,
    image_url: imageUrl,
    meta_title_ru: title.substring(0, 200),
    meta_description_ru: metaDescription?.substring(0, 300) || null,
    attributes,
    source_url: url
  }
}

async function getOrCreateAttribute(
  name: string,
  unit: string | null,
  isNumber: boolean
): Promise<string> {
  const slug = transliterate(name)
  const cacheKey = slug

  if (attributeCache.has(cacheKey)) {
    return attributeCache.get(cacheKey)!
  }

  // Check if exists
  const { data: existing } = await supabase
    .from('attribute_definitions')
    .select('id')
    .eq('slug', slug)
    .limit(1)

  if (existing && existing.length > 0) {
    attributeCache.set(cacheKey, existing[0].id)
    return existing[0].id
  }

  // Create new
  const { data: created, error } = await supabase
    .from('attribute_definitions')
    .insert({
      slug,
      name_ru: name,
      type: isNumber ? 'number' : 'text',
      unit: unit,
      is_filterable: true,
      is_searchable: true,
      sort_order: 0
    })
    .select('id')
    .single()

  if (error) {
    // Maybe race condition, try to fetch again
    const { data: retry } = await supabase
      .from('attribute_definitions')
      .select('id')
      .eq('slug', slug)
      .limit(1)

    if (retry && retry.length > 0) {
      attributeCache.set(cacheKey, retry[0].id)
      return retry[0].id
    }

    throw new Error(`Failed to create attribute ${name}: ${error.message}`)
  }

  createdAttributes++
  attributeCache.set(cacheKey, created.id)
  return created.id
}

async function linkAttributeToCategory(categoryId: string, attributeId: string) {
  // Check if already linked
  const { data: existing } = await supabase
    .from('category_attributes')
    .select('id')
    .eq('category_id', categoryId)
    .eq('attribute_id', attributeId)
    .limit(1)

  if (existing && existing.length > 0) return

  await supabase.from('category_attributes').insert({
    category_id: categoryId,
    attribute_id: attributeId,
    is_required: false,
    sort_order: 0
  })
}

async function insertProducts(
  products: ParsedProduct[],
  categoryId: string
) {
  // Deduplicate within batch first
  const seenSlugs = new Set<string>()
  const uniqueProducts = products.filter(p => {
    if (seenSlugs.has(p.slug)) return false
    seenSlugs.add(p.slug)
    return true
  })

  // Get existing slugs from DB
  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .in('slug', uniqueProducts.map(p => p.slug))

  const existingSlugs = new Set((existing || []).map(p => p.slug))
  const newProducts = uniqueProducts.filter(p => !existingSlugs.has(p.slug))
  skippedProducts += products.length - newProducts.length

  if (newProducts.length === 0) return

  // Prepare product records
  const productRecords = newProducts.map(p => ({
    category_id: categoryId,
    slug: p.slug,
    name_ru: p.name_ru,
    sku: p.sku,
    description_ru: p.description_ru,
    meta_title_ru: p.meta_title_ru,
    meta_description_ru: p.meta_description_ru,
    // source_url: p.source_url, // TODO: Add column to DB first
    is_active: true,
    in_stock: true
  }))

  // Insert products
  const { data: inserted, error } = await supabase
    .from('products')
    .insert(productRecords)
    .select('id, slug')

  if (error) {
    console.error(`    Error inserting products:`, error.message)
    failedProducts += newProducts.length
    return
  }

  insertedProducts += inserted.length
  const slugToId = new Map(inserted.map(p => [p.slug, p.id]))

  // Insert images
  const imageRecords = newProducts
    .filter(p => p.image_url && slugToId.has(p.slug))
    .map(p => ({
      product_id: slugToId.get(p.slug)!,
      url: p.image_url!,
      source_url: p.image_url,
      is_primary: true,
      sort_order: 0
    }))

  if (imageRecords.length > 0) {
    await supabase.from('product_images').insert(imageRecords)
  }

  // Collect category attributes
  const categoryAttributeIds = new Set<string>()

  // Insert product attributes
  for (const product of newProducts) {
    const productId = slugToId.get(product.slug)
    if (!productId) continue

    for (const attr of product.attributes) {
      // Check if value is numeric
      const numValue = parseFloat(attr.value.replace(/\s/g, '').replace(',', '.'))
      const isNumber = !isNaN(numValue) && /^[\d.,\s]+$/.test(attr.value)

      try {
        const attrId = await getOrCreateAttribute(attr.name, attr.unit, isNumber)
        categoryAttributeIds.add(attrId)

        await supabase.from('product_attributes').insert({
          product_id: productId,
          attribute_id: attrId,
          value_text: isNumber ? null : attr.value,
          value_number: isNumber ? numValue : null
        })
      } catch (e) {
        // Ignore errors (duplicates, etc)
      }
    }
  }

  // Link attributes to category
  for (const attrId of categoryAttributeIds) {
    await linkAttributeToCategory(categoryId, attrId)
  }
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

async function processCategory(category: {
  id: string
  slug: string
  name_ru: string
  source_url: string
  last_page: number
}) {
  const baseUrl = category.source_url || `${BASE_URL}/katalog-produktsii/${category.slug}/`

  console.log(`\n  [${processedCategories + 1}] ${category.name_ru}`)

  const firstPageUrl = category.last_page > 0 ? `${baseUrl}?page=${category.last_page + 1}` : baseUrl
  const $first = await fetchPage(firstPageUrl)

  if (!$first) {
    console.log(`    ✗ Failed to fetch`)
    await supabase
      .from('parse_progress')
      .update({ error_message: 'Failed to fetch', updated_at: new Date().toISOString() })
      .eq('category_id', category.id)
    return
  }

  // Try to get total count from "Найдено: 1050 товаров" header
  let totalCount = 0
  let totalPages = 1

  // Method 1: Look for "Найдено: X товаров" in catalog-header
  const countText = $first('.catalog-header').text() || $first('.s-category-list__title').text() || ''
  const countMatch = countText.match(/(\d[\d\s]+)/)
  if (countMatch) {
    totalCount = parseInt(countMatch[1].replace(/\s/g, ''), 10)
    totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE) || 1
  }

  // Method 2: Get last page from pagination (more reliable)
  const lastPageLink = $first('.pagination a').last().attr('href')
  if (lastPageLink) {
    const pageMatch = lastPageLink.match(/page=(\d+)/)
    if (pageMatch) {
      const paginationPages = parseInt(pageMatch[1], 10)
      if (paginationPages > totalPages) {
        totalPages = paginationPages
      }
    }
  }

  // Method 3: Count pagination items if no href
  if (totalPages === 1) {
    const paginationItems = $first('.pagination li').length
    if (paginationItems > 1) {
      totalPages = paginationItems
    }
  }

  console.log(`    ${totalCount} products, ${totalPages} pages`)

  let page = category.last_page > 0 ? category.last_page + 1 : 1
  let categoryProducts = 0

  while (page <= totalPages) {
    const pageUrl = page === 1 ? baseUrl : `${baseUrl}?page=${page}`
    await delay(DELAY_MS)
    const $ = page === 1 ? $first : await fetchPage(pageUrl)

    if (!$) {
      page++
      continue
    }

    const listings = parseProductListing($)
    if (listings.length === 0) break

    const products = await processWithConcurrency(
      listings,
      async (listing) => {
        const $product = await fetchPage(listing.url)
        if (!$product) return null
        const parsed = parseProductPage($product, listing.url)
        if (parsed && !parsed.image_url && listing.image) {
          parsed.image_url = listing.image
        }
        return parsed
      },
      CONCURRENT_REQUESTS
    )

    const validProducts = products.filter((p): p is ParsedProduct => p !== null)
    totalProducts += validProducts.length
    categoryProducts += validProducts.length

    if (validProducts.length > 0) {
      await insertProducts(validProducts, category.id)
    }

    await supabase
      .from('parse_progress')
      .update({
        last_page: page,
        products_count: categoryProducts,
        updated_at: new Date().toISOString()
      })
      .eq('category_id', category.id)

    console.log(`    p.${page}: ${validProducts.length} products`)
    page++
  }

  await supabase
    .from('parse_progress')
    .update({
      products_parsed: true,
      products_count: categoryProducts,
      error_message: null,
      updated_at: new Date().toISOString()
    })
    .eq('category_id', category.id)

  processedCategories++
  console.log(`    ✓ ${categoryProducts} products`)
}

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  Products Parser v2 (with auto-attributes)')
  console.log('═══════════════════════════════════════════════════\n')

  const { data: categories, error } = await supabase
    .from('parse_progress')
    .select('category_id, source_url, last_page, categories!inner(id, slug, name_ru, level)')
    .eq('products_parsed', false)

  if (error) {
    console.error('Failed to fetch categories:', error.message)
    process.exit(1)
  }

  if (!categories || categories.length === 0) {
    console.log('All categories already parsed!')
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
    console.log(`Total products: ${count}`)
    return
  }

  console.log(`${categories.length} categories to process\n`)

  const startTime = Date.now()

  for (const row of categories) {
    const cat = row.categories as unknown as { id: string; slug: string; name_ru: string }
    await processCategory({
      id: cat.id,
      slug: cat.slug,
      name_ru: cat.name_ru,
      source_url: row.source_url || '',
      last_page: row.last_page || 0
    })
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log('═══════════════════════════════════════════════════')
  console.log(`  Categories: ${processedCategories}`)
  console.log(`  Products: ${insertedProducts} inserted, ${skippedProducts} skipped, ${failedProducts} failed`)
  console.log(`  Attributes created: ${createdAttributes}`)
  console.log(`  Time: ${elapsed} min`)

  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`  Total in DB: ${count}`)
}

main().catch(console.error)
