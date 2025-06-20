import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,

  // Always use a locale prefix (e.g. /en/about)
  localePrefix: 'always',

  // Set the domain for locale detection
  // This helps with better SEO and user experience
  localeDetection: true,

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