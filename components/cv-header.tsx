'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Moon, Sun, Languages, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const t = useTranslations('common')
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  
  const lastUpdated = new Date().toLocaleDateString(currentLocale || 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="print:hidden bg-background border-b border-border">
      <div className="max-w-[210mm] mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline">{localeLabels[currentLocale || 'en']}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {locales.map((locale) => {
                  const href = createLocalizedPath(pathname, locale)
                  const isActive = currentLocale === locale
                  
                  return (
                    <DropdownMenuItem key={locale} asChild>
                      <Link
                        href={href}
                        className={`flex w-full ${isActive ? 'bg-accent' : ''}`}
                      >
                        {localeLabels[locale]}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="gap-2"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 