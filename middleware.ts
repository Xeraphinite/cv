import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,

  // Use no prefix for default locale (e.g. /, /about) and prefixes for others (e.g. /en/about)
  localePrefix: 'as-needed',

  // Keep default locale on unprefixed routes instead of auto-redirecting to browser locale
  localeDetection: false,

  // Alternate links for better SEO
  alternateLinks: true
})

export const config = {
  // Match only internationalized pathnames
  // Updated to use a more specific matcher
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
} 
