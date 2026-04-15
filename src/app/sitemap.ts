import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // cache sitemap for 1 hour
export const maxDuration = 60 // Vercel function timeout (seconds)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://temir-service.kz'

// Chunk size for product sitemaps. Google caps a single sitemap at 50k URLs;
// we stay under that and keep each function invocation well under maxDuration.
const PRODUCTS_PER_SITEMAP = 40000

// Simple interfaces for sitemap data
interface SlugItem { slug: string }
interface SlugWithDate { slug: string; updated_at?: string | null; created_at?: string | null; published_at?: string | null }
interface ProductRow { slug: string; updated_at: string | null }

// generateSitemaps tells Next.js to produce a sitemap index with one entry per id.
// Next.js serves the index at /sitemap.xml and each chunk at /sitemap/<id>.xml.
// id=0 holds static pages + all non-product dynamic content (categories, news, etc).
// id>=1 holds product URLs in PRODUCTS_PER_SITEMAP-sized chunks.
export async function generateSitemaps() {
  const supabase = await createClient()
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)

  const total = count ?? 0
  const productChunks = Math.max(1, Math.ceil(total / PRODUCTS_PER_SITEMAP))
  // id 0 = meta/static/categories/etc; ids 1..N = product chunks
  return Array.from({ length: productChunks + 1 }, (_, i) => ({ id: i }))
}

async function fetchProductChunk(chunkIndex: number): Promise<ProductRow[]> {
  const supabase = await createClient()
  const start = chunkIndex * PRODUCTS_PER_SITEMAP
  const end = start + PRODUCTS_PER_SITEMAP - 1
  const rows: ProductRow[] = []
  const BATCH = 1000

  // Supabase caps per-request rows at 1000, so fan the chunk into BATCH-sized reads.
  for (let offset = start; offset <= end; offset += BATCH) {
    const upper = Math.min(offset + BATCH - 1, end)
    const { data } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('id', { ascending: true })
      .range(offset, upper) as { data: ProductRow[] | null }

    if (!data || data.length === 0) break
    rows.push(...data)
    if (data.length < upper - offset + 1) break
  }

  return rows
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  // Product chunk sitemaps
  if (id >= 1) {
    const products = await fetchProductChunk(id - 1)
    return products.map((product) => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  }

  // id === 0: static pages + all non-product dynamic content
  const supabase = await createClient()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    // Main pages
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/katalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dostavka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },

    // Commercial pages
    { url: `${SITE_URL}/uznat-cenu`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/zakaz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/opt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/dlya-biznesa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/partneram`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Brands and manufacturers
    { url: `${SITE_URL}/brendy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/proizvoditeli`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

    // Reference pages
    { url: `${SITE_URL}/data`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/data/gost`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/data/marki-stali`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/data/materialy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },

    // Calculators
    { url: `${SITE_URL}/kalkulyatory`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/kalkulyatory/ves-metalla`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/kalkulyatory/raschet-truby`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/kalkulyatory/raschet-lista`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/kalkulyatory/raschet-armatury`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Services
    { url: `${SITE_URL}/uslugi/rezka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/uslugi/gibka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/uslugi/svarka`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/uslugi/komplektaciya-obektov`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Documents
    { url: `${SITE_URL}/sertifikaty-i-dokumenty`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Geo pages
    { url: `${SITE_URL}/sklad`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/geo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Company
    { url: `${SITE_URL}/company/requisites`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/company/quality`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/company/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },

    // Cases
    { url: `${SITE_URL}/cases`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },

    // Q&A
    { url: `${SITE_URL}/questions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ]

  // Dynamic: Categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug, updated_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${SITE_URL}/katalog/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  // Products live in separate sitemap chunks (see generateSitemaps / fetchProductChunk above)

  // Dynamic: News
  const { data: news } = await supabase
    .from('news')
    .select('slug, updated_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(100) as { data: SlugWithDate[] | null }

  const newsPages: MetadataRoute.Sitemap = (news || []).map((item) => ({
    url: `${SITE_URL}/news/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Dynamic: Brands
  const { data: brands } = await supabase
    .from('brands')
    .select('slug, created_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const brandPages: MetadataRoute.Sitemap = (brands || []).map((brand) => ({
    url: `${SITE_URL}/brendy/${brand.slug}`,
    lastModified: brand.created_at ? new Date(brand.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic: Manufacturers
  const { data: manufacturers } = await supabase
    .from('manufacturers')
    .select('slug, created_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const manufacturerPages: MetadataRoute.Sitemap = (manufacturers || []).map((m) => ({
    url: `${SITE_URL}/proizvoditeli/${m.slug}`,
    lastModified: m.created_at ? new Date(m.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic: Cities (geo)
  const { data: cities } = await supabase
    .from('cities')
    .select('slug')
    .eq('is_active', true) as { data: SlugItem[] | null }

  const cityPages: MetadataRoute.Sitemap = (cities || []).flatMap((city) => [
    {
      url: `${SITE_URL}/geo/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/sklad/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ])

  // Dynamic: GOST
  const { data: gosts } = await supabase
    .from('gost_standards')
    .select('slug, created_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const gostPages: MetadataRoute.Sitemap = (gosts || []).map((gost) => ({
    url: `${SITE_URL}/data/gost/${gost.slug}`,
    lastModified: gost.created_at ? new Date(gost.created_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  // Dynamic: Steel grades
  const { data: steelGrades } = await supabase
    .from('steel_grades')
    .select('slug, created_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const steelGradePages: MetadataRoute.Sitemap = (steelGrades || []).map((sg) => ({
    url: `${SITE_URL}/data/marki-stali/${sg.slug}`,
    lastModified: sg.created_at ? new Date(sg.created_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  // Dynamic: Glossary
  const { data: glossary } = await supabase
    .from('glossary_terms')
    .select('slug, created_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const glossaryPages: MetadataRoute.Sitemap = (glossary || []).map((term) => ({
    url: `${SITE_URL}/glossary/${term.slug}`,
    lastModified: term.created_at ? new Date(term.created_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }))

  // Dynamic: Guides
  const { data: guides } = await supabase
    .from('guides')
    .select('slug, published_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const guidePages: MetadataRoute.Sitemap = (guides || []).map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: guide.published_at ? new Date(guide.published_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // Dynamic: Cases
  const { data: cases } = await supabase
    .from('cases')
    .select('slug, published_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const casePages: MetadataRoute.Sitemap = (cases || []).map((c) => ({
    url: `${SITE_URL}/cases/${c.slug}`,
    lastModified: c.published_at ? new Date(c.published_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  // Dynamic: FAQ categories
  const { data: faqCategories } = await supabase
    .from('faq_categories')
    .select('slug')
    .eq('is_active', true) as { data: SlugItem[] | null }

  const faqPages: MetadataRoute.Sitemap = (faqCategories || []).map((cat) => ({
    url: `${SITE_URL}/faq/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Dynamic: Special offers
  const { data: offers } = await supabase
    .from('special_offers')
    .select('slug, created_at')
    .eq('is_active', true) as { data: SlugWithDate[] | null }

  const offerPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/katalog/special-offer`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    ...(offers || []).map((offer) => ({
      url: `${SITE_URL}/katalog/special-offer/${offer.slug}`,
      lastModified: offer.created_at ? new Date(offer.created_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  return [
    ...staticPages,
    ...categoryPages,
    ...newsPages,
    ...brandPages,
    ...manufacturerPages,
    ...cityPages,
    ...gostPages,
    ...steelGradePages,
    ...glossaryPages,
    ...guidePages,
    ...casePages,
    ...faqPages,
    ...offerPages,
  ]
}
