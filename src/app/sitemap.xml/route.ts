import {
  PRODUCTS_PER_SITEMAP,
  SITE_URL,
  countActiveProducts,
  sitemapIndexXml,
} from '../sitemaps/_lib'

export const revalidate = 3600
export const maxDuration = 30

export async function GET() {
  const total = await countActiveProducts()
  const productChunks = Math.max(1, Math.ceil(total / PRODUCTS_PER_SITEMAP))
  const now = new Date().toISOString()

  const entries = [
    { loc: `${SITE_URL}/sitemaps/static`, lastmod: now },
    ...Array.from({ length: productChunks }, (_, i) => ({
      loc: `${SITE_URL}/sitemaps/products/${i}`,
      lastmod: now,
    })),
  ]

  return new Response(sitemapIndexXml(entries), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
