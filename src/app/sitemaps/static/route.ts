import { SITE_URL, SitemapUrl, fetchRows, urlsetXml } from '../_lib'

export const revalidate = 3600
export const maxDuration = 60

interface SlugItem { slug: string }
interface SlugWithDate { slug: string; updated_at?: string | null; created_at?: string | null; published_at?: string | null }

const now = () => new Date().toISOString()

export async function GET() {
  const staticPages: SitemapUrl[] = [
    { loc: SITE_URL, changefreq: 'daily', priority: 1 },
    { loc: `${SITE_URL}/katalog`, changefreq: 'daily', priority: 0.9 },
    { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/contacts`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/services`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/dostavka`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/faq`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${SITE_URL}/news`, changefreq: 'daily', priority: 0.7 },
    { loc: `${SITE_URL}/uznat-cenu`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/zakaz`, changefreq: 'monthly', priority: 0.8 },
    { loc: `${SITE_URL}/opt`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/dlya-biznesa`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/partneram`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/brendy`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${SITE_URL}/proizvoditeli`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${SITE_URL}/data`, changefreq: 'weekly', priority: 0.6 },
    { loc: `${SITE_URL}/data/gost`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/data/marki-stali`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/data/materialy`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/glossary`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/guides`, changefreq: 'weekly', priority: 0.6 },
    { loc: `${SITE_URL}/kalkulyatory`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/kalkulyatory/ves-metalla`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/kalkulyatory/raschet-truby`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/kalkulyatory/raschet-lista`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/kalkulyatory/raschet-armatury`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/uslugi/rezka`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/uslugi/gibka`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/uslugi/svarka`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/uslugi/komplektaciya-obektov`, changefreq: 'monthly', priority: 0.7 },
    { loc: `${SITE_URL}/sertifikaty-i-dokumenty`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/sklad`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/geo`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${SITE_URL}/company/requisites`, changefreq: 'yearly', priority: 0.4 },
    { loc: `${SITE_URL}/company/quality`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/company/terms`, changefreq: 'monthly', priority: 0.5 },
    { loc: `${SITE_URL}/cases`, changefreq: 'weekly', priority: 0.6 },
    { loc: `${SITE_URL}/questions`, changefreq: 'weekly', priority: 0.6 },
  ]

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

  const lastmodFrom = (date: string | null | undefined) =>
    date ? new Date(date).toISOString() : now()

  const urls: SitemapUrl[] = [
    ...staticPages,
    ...categories.map<SitemapUrl>((c) => ({ loc: `${SITE_URL}/katalog/${c.slug}`, lastmod: lastmodFrom(c.updated_at), changefreq: 'daily', priority: 0.8 })),
    ...news.map<SitemapUrl>((n) => ({ loc: `${SITE_URL}/news/${n.slug}`, lastmod: lastmodFrom(n.updated_at), changefreq: 'monthly', priority: 0.5 })),
    ...brands.map<SitemapUrl>((b) => ({ loc: `${SITE_URL}/brendy/${b.slug}`, lastmod: lastmodFrom(b.created_at), changefreq: 'monthly', priority: 0.6 })),
    ...manufacturers.map<SitemapUrl>((m) => ({ loc: `${SITE_URL}/proizvoditeli/${m.slug}`, lastmod: lastmodFrom(m.created_at), changefreq: 'monthly', priority: 0.6 })),
    ...cities.flatMap<SitemapUrl>((c) => [
      { loc: `${SITE_URL}/geo/${c.slug}`, changefreq: 'monthly', priority: 0.5 },
      { loc: `${SITE_URL}/sklad/${c.slug}`, changefreq: 'monthly', priority: 0.5 },
    ]),
    ...gosts.map<SitemapUrl>((g) => ({ loc: `${SITE_URL}/data/gost/${g.slug}`, lastmod: lastmodFrom(g.created_at), changefreq: 'yearly', priority: 0.5 })),
    ...steelGrades.map<SitemapUrl>((s) => ({ loc: `${SITE_URL}/data/marki-stali/${s.slug}`, lastmod: lastmodFrom(s.created_at), changefreq: 'yearly', priority: 0.5 })),
    ...glossary.map<SitemapUrl>((t) => ({ loc: `${SITE_URL}/glossary/${t.slug}`, lastmod: lastmodFrom(t.created_at), changefreq: 'yearly', priority: 0.4 })),
    ...guides.map<SitemapUrl>((g) => ({ loc: `${SITE_URL}/guides/${g.slug}`, lastmod: lastmodFrom(g.published_at), changefreq: 'monthly', priority: 0.6 })),
    ...cases.map<SitemapUrl>((c) => ({ loc: `${SITE_URL}/cases/${c.slug}`, lastmod: lastmodFrom(c.published_at), changefreq: 'monthly', priority: 0.5 })),
    ...faqCategories.map<SitemapUrl>((c) => ({ loc: `${SITE_URL}/faq/${c.slug}`, changefreq: 'weekly', priority: 0.5 })),
    { loc: `${SITE_URL}/katalog/special-offer`, changefreq: 'daily', priority: 0.7 },
    ...offers.map<SitemapUrl>((o) => ({ loc: `${SITE_URL}/katalog/special-offer/${o.slug}`, lastmod: lastmodFrom(o.created_at), changefreq: 'weekly', priority: 0.6 })),
  ]

  return new Response(urlsetXml(urls), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
