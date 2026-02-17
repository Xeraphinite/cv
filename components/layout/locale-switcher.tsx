'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { locales, localeLabels, defaultLocale, type Locale } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'
import { Icon } from '@iconify/react'
import { useTransition } from 'react'

export default function LocaleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('common')
  const [isPending, startTransition] = useTransition()
  
  // Get current locale with fallback
  const currentLocale = getLocaleFromPathname(pathname) || defaultLocale
  
  const handleLocaleChange = (locale: Locale) => {
    startTransition(() => {
      const href = createLocalizedPath(pathname, locale)
      router.push(href)
    })
  }
  
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-2">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 px-3 py-1">
            <Icon icon="mingcute:translate-2-line" className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">
              {t('language')}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex gap-1">
            {locales.map((locale) => {
              const href = createLocalizedPath(pathname, locale)
              const isActive = currentLocale === locale
              
              return (
                <div key={locale}>
                  {/* Regular link for non-JS environments */}
                  <Link
                    href={href}
                    className={`block px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${ isActive ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800' } ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
                    title={`Switch to ${localeLabels[locale]}`}
                    aria-label={`Switch to ${localeLabels[locale]}`}
                    onClick={(e) => {
                      e.preventDefault()
                      if (!isPending && locale !== currentLocale) {
                        handleLocaleChange(locale)
                      }
                    }}
                  >
                    {localeLabels[locale]}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-gray-500 bg-white/80 p-2 rounded">
          Current: {currentLocale} | Path: {pathname}
        </div>
      )}
    </div>
  )
} 
