import { SchemaOrg } from './SchemaOrg'

interface ArticleSchemaProps {
  headline: string
  description?: string
  image?: string
  url: string
  datePublished: string
  dateModified?: string
  author?: string
  publisher?: {
    name: string
    logo?: string
  }
}

export function ArticleSchema({
  headline,
  description,
  image,
  url,
  datePublished,
  dateModified,
  author = 'Темир Сервис Казахстан',
  publisher = {
    name: 'Темир Сервис Казахстан',
    logo: 'https://steels.kz/logo.png',
  },
}: ArticleSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    url,
    datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      logo: publisher.logo
        ? {
            '@type': 'ImageObject',
            url: publisher.logo,
          }
        : undefined,
    },
  }

  if (description) schema.description = description
  if (image) schema.image = image
  if (dateModified) schema.dateModified = dateModified

  return <SchemaOrg schema={schema} />
}
