import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { defaultLocale, locales, type Locale } from './config'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const headersList = await headers()

  // Check cookie first
  let locale = cookieStore.get('locale')?.value as Locale | undefined

  // Check Accept-Language header
  if (!locale) {
    const acceptLanguage = headersList.get('Accept-Language')
    if (acceptLanguage) {
      const preferredLocale = acceptLanguage
        .split(',')
        .map((lang) => lang.split(';')[0].trim().substring(0, 2))
        .find((lang) => locales.includes(lang as Locale))
      locale = preferredLocale as Locale | undefined
    }
  }

  // Fallback to default
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
