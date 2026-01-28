import { SchemaOrg } from './SchemaOrg'

interface ProductSchemaProps {
  name: string
  description?: string
  image?: string
  sku?: string
  brand?: string
  manufacturer?: string
  price?: number
  currency?: string
  inStock?: boolean
  url: string
  category?: string
  reviewCount?: number
  ratingValue?: number
}

export function ProductSchema({
  name,
  description,
  image,
  sku,
  brand,
  manufacturer,
  price,
  currency = 'KZT',
  inStock = true,
  url,
  category,
  reviewCount,
  ratingValue,
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    url,
  }

  if (description) schema.description = description
  if (image) schema.image = image
  if (sku) schema.sku = sku
  if (category) schema.category = category

  if (brand) {
    schema.brand = {
      '@type': 'Brand',
      name: brand,
    }
  }

  if (manufacturer) {
    schema.manufacturer = {
      '@type': 'Organization',
      name: manufacturer,
    }
  }

  if (price) {
    schema.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url,
      seller: {
        '@type': 'Organization',
        name: 'Темир Сервис Казахстан',
      },
    }
  }

  if (reviewCount && ratingValue) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return <SchemaOrg schema={schema} />
}
