import * as cheerio from 'cheerio'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BASE_URL = 'https://steels.kz'
const DELAY_MS = 200

// Stats
let totalCategories = 0
let parsedCategories = 0
let totalAttributes = 0
let newAttributes = 0
let linkedAttributes = 0

interface ParsedAttribute {
  slug: string
  name_ru: string
  unit: string | null
  type: 'text' | 'number'
  values: string[]
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

function parseFilters($: cheerio.CheerioAPI): ParsedAttribute[] {
  const attributes: ParsedAttribute[] = []
  const seen = new Set<string>()

  // Find all filter items
  $('.filter__wrap-item').each((_, el) => {
    const $item = $(el)
    const title = $item.attr('data-title') || $item.find('.filter__header span').first().text().trim()

    if (!title) return

    // Extract values from checkboxes
    const values: string[] = []
    let attrSlug = ''

    $item.find('input[type="checkbox"]').each((_, input) => {
      const value = $(input).attr('value') || ''
      // Format: "slug|value" e.g. "marka|09g2s"
      const parts = value.split('|')
      if (parts.length === 2) {
        if (!attrSlug) attrSlug = parts[0]
        const valueText = $(input).siblings('.checkbox__text').text().trim() ||
          $(input).parent().find('.checkbox__text').text().trim()
        if (valueText) {
          values.push(valueText)
        }
      }
    })

    if (!attrSlug || values.length === 0) return
    if (seen.has(attrSlug)) return
    seen.add(attrSlug)

    // Determine type (number or text)
    // Check if name contains "мм" or most values are numeric
    const nameHasUnit = title.match(/,\s*(мм|м|кг|шт|мм²)$/i)
    const unit = nameHasUnit ? nameHasUnit[1] : null
    const cleanName = title.replace(/,\s*(мм|м|кг|шт|мм²)$/i, '').trim()

    // Check if values are mostly numeric
    const numericValues = values.filter(v => /^[\d.,]+$/.test(v.replace(/\s/g, '')))
    const isNumeric = numericValues.length > values.length * 0.7

    attributes.push({
      slug: attrSlug,
      name_ru: cleanName,
      unit,
      type: isNumeric ? 'number' : 'text',
      values
    })
  })

  return attributes
}

async function getOrCreateAttribute(attr: ParsedAttribute): Promise<string | null> {
  // Check if exists
  const { data: existing } = await supabase
    .from('attribute_definitions')
    .select('id')
    .eq('slug', attr.slug)
    .single()

  if (existing) {
    return existing.id
  }

  // Create new
  const { data: created, error } = await supabase
    .from('attribute_definitions')
    .insert({
      slug: attr.slug,
      name_ru: attr.name_ru,
      type: attr.type,
      unit: attr.unit,
      is_filterable: true,
      is_searchable: true,
      sort_order: 0
    })
    .select('id')
    .single()

  if (error) {
    console.error(`    Error creating attribute ${attr.slug}:`, error.message)
    return null
  }

  newAttributes++
  return created.id
}

async function linkAttributeToCategory(categoryId: string, attributeId: string, sortOrder: number) {
  // Check if already linked
  const { data: existing } = await supabase
    .from('category_attributes')
    .select('id')
    .eq('category_id', categoryId)
    .eq('attribute_id', attributeId)
    .single()

  if (existing) return

  const { error } = await supabase
    .from('category_attributes')
    .insert({
      category_id: categoryId,
      attribute_id: attributeId,
      is_required: false,
      sort_order: sortOrder
    })

  if (error) {
    console.error(`    Error linking attribute:`, error.message)
  } else {
    linkedAttributes++
  }
}

async function processCategory(category: { id: string; slug: string; name_ru: string; source_url: string }) {
  const url = category.source_url || `${BASE_URL}/katalog-produktsii/${category.slug}/`

  console.log(`  [${parsedCategories + 1}/${totalCategories}] ${category.name_ru}`)

  await delay(DELAY_MS)
  const $ = await fetchPage(url)

  if (!$) {
    await supabase
      .from('parse_progress')
      .update({ error_message: 'Failed to fetch page', updated_at: new Date().toISOString() })
      .eq('category_id', category.id)
    return
  }

  const attributes = parseFilters($)
  console.log(`    Found ${attributes.length} filters`)

  // Process each attribute
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i]
    totalAttributes++

    const attrId = await getOrCreateAttribute(attr)
    if (attrId) {
      await linkAttributeToCategory(category.id, attrId, i)
    }
  }

  // Mark as parsed
  await supabase
    .from('parse_progress')
    .update({
      attributes_parsed: true,
      error_message: null,
      updated_at: new Date().toISOString()
    })
    .eq('category_id', category.id)

  parsedCategories++
}

async function main() {
  console.log('═══════════════════════════════════════════════════')
  console.log('  Attribute Parser')
  console.log('═══════════════════════════════════════════════════\n')

  // Get categories to parse
  const { data: categories, error } = await supabase
    .from('parse_progress')
    .select('category_id, source_url, categories!inner(id, slug, name_ru, level)')
    .eq('attributes_parsed', false)

  if (error) {
    console.error('Failed to fetch categories:', error.message)
    process.exit(1)
  }

  if (!categories || categories.length === 0) {
    console.log('All categories already have attributes parsed!')
    return
  }

  totalCategories = categories.length
  console.log(`Found ${totalCategories} categories to process\n`)

  const startTime = Date.now()

  for (const row of categories) {
    const cat = row.categories as unknown as { id: string; slug: string; name_ru: string }
    await processCategory({
      id: cat.id,
      slug: cat.slug,
      name_ru: cat.name_ru,
      source_url: row.source_url || ''
    })
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

  console.log('\n═══════════════════════════════════════════════════')
  console.log('  DONE!')
  console.log('═══════════════════════════════════════════════════')
  console.log(`\n  Categories processed: ${parsedCategories}`)
  console.log(`  Total attributes found: ${totalAttributes}`)
  console.log(`  New attributes created: ${newAttributes}`)
  console.log(`  Category-attribute links: ${linkedAttributes}`)
  console.log(`  Time: ${elapsed}s\n`)
}

main().catch(console.error)
