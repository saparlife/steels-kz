import { MetadataRoute } from 'next'

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

// Direct PostgREST calls (no supabase/ssr client) — generateSitemaps runs at
// build time, outside any request scope, so the cookie-bound server client
// cannot be used here.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function fetchRows<T>(path: string): Promise<T[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    cache: 'no-store',
  })
  if (!res.ok) return []
  return (await res.json()) as T[]
}

async function countActiveProducts(): Promise<number> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id&is_active=eq.true`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
      cache: 'no-store',
    }
  )
  const range = res.headers.get('content-range') // "0-0/183725"
  const total = range?.split('/')?.[1]
  return total ? Number(total) : 0
}

async function fetchProductChunk(chunkIndex: number): Promise<ProductRow[]> {
  const start = chunkIndex * PRODUCTS_PER_SITEMAP
  const end = start + PRODUCTS_PER_SITEMAP - 1
  const rows: ProductRow[] = []
  const BATCH = 1000

  for (let offset = start; offset <= end; offset += BATCH) {
    const upper = Math.min(offset + BATCH - 1, end)
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=slug,updated_at&is_active=eq.true&order=id.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Range: `${offset}-${upper}`,
          'Range-Unit': 'items',
        },
        cache: 'no-store',
      }
    )
    if (!res.ok) break
    const data = (await res.json()) as ProductRow[]
    if (!data || data.length === 0) break
    rows.push(...data)
    if (data.length < upper - offset + 1) break
  }

  return rows
}

// generateSitemaps tells Next.js to produce a sitemap index with one entry per id.
// Next.js serves the index at /sitemap.xml and each chunk at /sitemap/<id>.xml.
// id=0 holds static pages + all non-product dynamic content (categories, news, etc).
// id>=1 holds product URLs in PRODUCTS_PER_SITEMAP-sized chunks.
export async function generateSitemaps() {
  const total = await countActiveProducts()
  const productChunks = Math.max(1, Math.ceil(total / PRODUCTS_PER_SITEMAP))
  return Array.from({ length: productChunks + 1 }, (_, i) => ({ id: i }))
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

  // Load all non-product dynamic tables in parallel
  const [
    categories,
    news,
    brands,
    manufacturers,
    cities,
    gosts,
    steelGrades,
    glossary,
    guides,
    cases,
    faqCategories,
    offers,
  ] = await Promise.all([
    fetchRows<SlugWithDate>('categories?select=slug,updated_at&is_active=eq.true'),
    fetchRows<SlugWithDate>('news?select=slug,updated_at&is_published=eq.true&order=published_at.desc&limit=100'),
    fetchRows<SlugWithDate>('brands?select=slug,created_at&is_active=eq.true'),
    fetchRows<SlugWithDate>('manufacturers?select=slug,created_at&is_active=eq.true'),
    fetchRows<SlugItem>('cities?select=slug&is_active=eq.true'),
    fetchRows<SlugWithDate>('gost_standards?select=slug,created_at&is_active=eq.true'),
    fetchRows<SlugWithDate>('steel_grades?select=slug,created_at&is_active=eq.true'),
    fetchRows<SlugWithDate>('glossary_terms?select=slug,created_at&is_active=eq.true'),
    fetchRows<SlugWithDate>('guides?select=slug,published_at&is_active=eq.true'),
    fetchRows<SlugWithDate>('cases?select=slug,published_at&is_active=eq.true'),
    fetchRows<SlugItem>('faq_categories?select=slug&is_active=eq.true'),
    fetchRows<SlugWithDate>('special_offers?select=slug,created_at&is_active=eq.true'),
  ])

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/katalog/${cat.slug}`,
    lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const newsPages: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${SITE_URL}/news/${item.slug}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const brandPages: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/brendy/${brand.slug}`,
    lastModified: brand.created_at ? new Date(brand.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const manufacturerPages: MetadataRoute.Sitemap = manufacturers.map((m) => ({
    url: `${SITE_URL}/proizvoditeli/${m.slug}`,
    lastModified: m.created_at ? new Date(m.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const cityPages: MetadataRoute.Sitemap = cities.flatMap((city) => [
    { url: `${SITE_URL}/geo/${city.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${SITE_URL}/sklad/${city.slug}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ])

  const gostPages: MetadataRoute.Sitemap = gosts.map((gost) => ({
    url: `${SITE_URL}/data/gost/${gost.slug}`,
    lastModified: gost.created_at ? new Date(gost.created_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  const steelGradePages: MetadataRoute.Sitemap = steelGrades.map((sg) => ({
    url: `${SITE_URL}/data/marki-stali/${sg.slug}`,
    lastModified: sg.created_at ? new Date(sg.created_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }))

  const glossaryPages: MetadataRoute.Sitemap = glossary.map((term) => ({
    url: `${SITE_URL}/glossary/${term.slug}`,
    lastModified: term.created_at ? new Date(term.created_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.4,
  }))

  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: guide.published_at ? new Date(guide.published_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const casePages: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${SITE_URL}/cases/${c.slug}`,
    lastModified: c.published_at ? new Date(c.published_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const faqPages: MetadataRoute.Sitemap = faqCategories.map((cat) => ({
    url: `${SITE_URL}/faq/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  const offerPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/katalog/special-offer`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    ...offers.map((offer) => ({
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
