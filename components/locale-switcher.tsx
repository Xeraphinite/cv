'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { locales, localeLabels, type Locale } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'
import { Languages } from 'lucide-react'

export default function LocaleSwitcher() {
  const pathname = usePathname()
  const t = useTranslations('common')
  const currentLocale = getLocaleFromPathname(pathname)
  
  return (
    <div className="fixed top-6 right-6 z-50 print:hidden">
      <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-2">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 px-3 py-1">
            <Languages className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">{t('language')}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex gap-1">
            {locales.map((locale) => {
              const href = createLocalizedPath(pathname, locale)
              const isActive = currentLocale === locale
              
              return (
                <Link
                  key={locale}
                  href={href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                  title={localeLabels[locale]}
                  aria-label={`Switch to ${localeLabels[locale]}`}
                >
                  {localeLabels[locale]}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
} 