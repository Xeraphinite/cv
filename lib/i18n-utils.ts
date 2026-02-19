import { type Locale, locales } from '@/i18n'

/**
 * Validates if a string is a valid locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

/**
 * Gets the locale from a pathname
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segments = pathname.split('/')
  const possibleLocale = segments[1]
  
  if (possibleLocale && isValidLocale(possibleLocale)) {
    return possibleLocale
  }
  
  return null
}

/**
 * Creates a localized path
 */
export function createLocalizedPath(
  path: string,
  locale: Locale,
  removeCurrentLocale = true
): string {
  const segments = path.split('/')
  
  if (removeCurrentLocale && segments[1] && isValidLocale(segments[1])) {
    // Remove current locale from path
    segments.splice(1, 1)
  }
  
  // Add new locale
  const newPath = `/${locale}${segments.join('') || ''}`
  
  return newPath
}

/**
 * Navigation messages type for type-safe translation keys
 */
export type NavigationMessages = {
  common: {
    language: string
    loading: string
    error: string
  }
  navigation: {
    home: string
    about: string
    contact: string
  }
  section: {
    education: string
    experience: string
    skills: string
    awards: string
    publications: string
  }
  label: {
    supervisor: string
    expected: string
    present: string
    duration: string
    location: string
    position: string
    company: string
    date: string
    description: string
  }
  action: {
    viewMore: string
    download: string
    print: string
    share: string
  }
}

/**
 * Type-safe translation keys
 */
export type TranslationKey = keyof NavigationMessages

/**
 * Direction type for RTL/LTR support
 */
export type Direction = 'ltr' | 'rtl'

/**
 * Get text direction for a locale
 */
export function getDirection(locale: Locale): Direction {
  // Add RTL locales here if needed
  const rtlLocales: Locale[] = []
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr'
} 
