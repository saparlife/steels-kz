import { SchemaOrg } from './SchemaOrg'

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  phone?: string
  email?: string
  address?: {
    street?: string
    city?: string
    region?: string
    postalCode?: string
    country?: string
  }
  socialLinks?: string[]
}

export function OrganizationSchema({
  name = 'Темир Сервис Казахстан',
  url = 'https://steels.kz',
  logo = 'https://steels.kz/logo.png',
  phone = '+7 (727) 123-45-67',
  email = 'info@steels.kz',
  address = {
    street: 'ул. Примерная, 1',
    city: 'Алматы',
    region: 'Алматинская область',
    postalCode: '050000',
    country: 'KZ',
  },
  socialLinks = [],
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    telephone: phone,
    email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    sameAs: socialLinks,
  }

  return <SchemaOrg schema={schema} />
}

export function LocalBusinessSchema({
  name = 'Темир Сервис Казахстан',
  description = 'Продажа металлопроката оптом и в розницу в Казахстане',
  url = 'https://steels.kz',
  phone = '+7 (727) 123-45-67',
  address = {
    street: 'ул. Примерная, 1',
    city: 'Алматы',
    region: 'Алматинская область',
    postalCode: '050000',
    country: 'KZ',
  },
  geo = { lat: 43.238949, lng: 76.945465 },
  openingHours = ['Mo-Fr 09:00-18:00', 'Sa 10:00-15:00'],
  priceRange = '$$',
}: {
  name?: string
  description?: string
  url?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    region?: string
    postalCode?: string
    country?: string
  }
  geo?: { lat: number; lng: number }
  openingHours?: string[]
  priceRange?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${url}/#localbusiness`,
    name,
    description,
    url,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    },
    openingHoursSpecification: openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0].split('-'),
      opens: hours.split(' ')[1]?.split('-')[0] || '09:00',
      closes: hours.split(' ')[1]?.split('-')[1] || '18:00',
    })),
    priceRange,
  }

  return <SchemaOrg schema={schema} />
}

export function WebSiteSchema({
  name = 'Темир Сервис Казахстан',
  url = 'https://steels.kz',
  searchUrl = 'https://steels.kz/search?q=',
}: {
  name?: string
  url?: string
  searchUrl?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}{search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return <SchemaOrg schema={schema} />
}
