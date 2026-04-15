export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://temir-service.kz'

// Target products per sitemap (approximate — chunks are split on UUID prefix
// so sizes vary slightly). Google allows up to 50k per sitemap.
export const PRODUCTS_PER_SITEMAP = 10000

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use service role key: high-offset pagination on 183k rows exceeds the
// anon role's ~3s statement timeout on Supabase. Service role has 60s.
// (sitemap routes do not expose any user data beyond slug/updated_at.)
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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

// Compute total number of chunks. Derived from the active product count
// via ceil(count / PRODUCTS_PER_SITEMAP). The sitemap index route and the
// chunk-range builder both need this to agree.
export async function getProductChunkCount(): Promise<number> {
  const total = await countActiveProducts()
  return Math.max(1, Math.ceil(total / PRODUCTS_PER_SITEMAP))
}

// Compute UUID boundary i/N as a canonical UUID string. Boundary 0 is all
// zeros, boundary N is all Fs. UUIDs in the DB are uniformly distributed,
// so this gives approximately even chunk sizes.
function uuidBoundary(i: number, total: number): string {
  const max = (BigInt(1) << BigInt(128)) - BigInt(1)
  const value = (max * BigInt(i)) / BigInt(total)
  const hex = value.toString(16).padStart(32, '0')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`
}

// Fetch one chunk by UUID range. Uses keyset pagination within the range
// so each PostgREST call hits the primary-key index (no slow OFFSET scan).
export async function fetchProductChunk(
  chunkIndex: number,
  totalChunks: number
): Promise<ProductRow[]> {
  const loUuid = uuidBoundary(chunkIndex, totalChunks)
  const hiUuid = uuidBoundary(chunkIndex + 1, totalChunks)
  const BATCH = 1000

  const rows: ProductRow[] = []
  let cursor = loUuid
  let inclusiveOp = 'gte' // first iteration includes the lower boundary

  // Loop until the range is exhausted. Each request uses the pk index so
  // it stays well inside the statement timeout even for the last chunk.
  while (true) {
    const q = new URLSearchParams({
      select: 'id,slug,updated_at',
      is_active: 'eq.true',
      id: `${inclusiveOp}.${cursor}`,
      order: 'id.asc',
      limit: String(BATCH),
    })
    // The upper bound is exclusive of the next chunk's lower boundary so
    // chunks don't overlap. We append it as a second filter on id.
    const url = `${SUPABASE_URL}/rest/v1/products?${q.toString()}&id=lt.${hiUuid}`
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: 'no-store',
    })
    if (!res.ok) break
    const data = (await res.json()) as Array<ProductRow & { id: string }>
    if (!data || data.length === 0) break

    for (const r of data) rows.push({ slug: r.slug, updated_at: r.updated_at })
    if (data.length < BATCH) break

    cursor = data[data.length - 1].id
    inclusiveOp = 'gt' // subsequent iterations skip the last-seen id
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
