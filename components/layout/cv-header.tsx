'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Moon, Sun, Languages, Calendar } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { locales, localeLabels, type Locale } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'

export function CVHeader() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  
  const lastUpdated = new Date().toLocaleDateString(currentLocale || 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="print:hidden bg-background/80 backdrop-blur-lg border-b border-border/20 sticky top-0 z-50 transition-all duration-300">
      <div className="paper-container">
        <div className="flex items-center justify-between py-4">
          {/* Last updated with elegant styling */}
          <div className="flex items-center gap-3 paper-meta">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span className="font-medium">{t('common.lastUpdated')}: {lastUpdated}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Switcher with Apple-inspired design */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button" 
                  className="paper-button-outline !px-4 !py-2 !text-sm"
                  aria-label={t('common.language')}
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline font-medium">{localeLabels[currentLocale || 'en']}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="paper-card !p-2 !m-0 border border-border/30 backdrop-blur-xl"
                sideOffset={8}
              >
                {locales.map((locale) => {
                  const href = createLocalizedPath(pathname, locale)
                  const isActive = currentLocale === locale
                  
                  return (
                    <DropdownMenuItem key={locale} asChild className="rounded-lg">
                      <Link
                        href={href}
                        className={`flex w-full px-4 py-3 text-sm transition-all duration-200 rounded-lg font-medium ${
                          isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                      >
                        {localeLabels[locale]}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle with Apple aesthetics */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="paper-button-outline !px-3 !py-2 relative overflow-hidden"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 