export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://temir-service.kz'

export const PRODUCTS_PER_SITEMAP = 40000

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export interface ProductRow {
  slug: string
  updated_at: string | null
}

export async function fetchRows<T>(path: string): Promise<T[]> {
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

export async function countActiveProducts(): Promise<number> {
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
  const range = res.headers.get('content-range')
  const total = range?.split('/')?.[1]
  return total ? Number(total) : 0
}

export async function fetchProductChunk(
  chunkIndex: number
): Promise<ProductRow[]> {
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

export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

export function urlsetXml(urls: SitemapUrl[]): string {
  const body = urls
    .map((u) => {
      const parts = [`<loc>${xmlEscape(u.loc)}</loc>`]
      if (u.lastmod) parts.push(`<lastmod>${u.lastmod}</lastmod>`)
      if (u.changefreq) parts.push(`<changefreq>${u.changefreq}</changefreq>`)
      if (u.priority !== undefined)
        parts.push(`<priority>${u.priority}</priority>`)
      return `<url>${parts.join('')}</url>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`
}

export function sitemapIndexXml(
  entries: { loc: string; lastmod?: string }[]
): string {
  const body = entries
    .map((e) => {
      const parts = [`<loc>${xmlEscape(e.loc)}</loc>`]
      if (e.lastmod) parts.push(`<lastmod>${e.lastmod}</lastmod>`)
      return `<sitemap>${parts.join('')}</sitemap>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`
}
