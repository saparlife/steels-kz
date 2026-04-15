import { notFound } from 'next/navigation'
import {
  SITE_URL,
  SitemapUrl,
  fetchProductChunk,
  getProductChunkCount,
  urlsetXml,
} from '../../_lib'

export const revalidate = 3600
export const maxDuration = 60

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const chunkIndex = Number(id)
  if (!Number.isInteger(chunkIndex) || chunkIndex < 0) notFound()

  const totalChunks = await getProductChunkCount()
  if (chunkIndex >= totalChunks) notFound()

  const products = await fetchProductChunk(chunkIndex, totalChunks)
  const urls: SitemapUrl[] = products.map((p) => ({
    loc: `${SITE_URL}/product/${p.slug}`,
    lastmod: p.updated_at ? new Date(p.updated_at).toISOString() : undefined,
    changefreq: 'weekly',
    priority: 0.7,
  }))

  return new Response(urlsetXml(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
