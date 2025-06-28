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
import { locales, localeLabels } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'
import { TableOfContents, type TOCSection } from './table-of-contents'

// Define the TOC sections based on the CV structure
const getTOCSections = (t: (key: string) => string): TOCSection[] => [
  { id: 'hero', title: t('navigation.about') || 'About' },
  { id: 'profile', title: t('sections.profileHighlights') || 'Profile' },
  { id: 'research', title: t('sections.researchInterests') || 'Research' },
  { id: 'education', title: t('sections.education') || 'Education' },
  { id: 'experience', title: t('sections.experience') || 'Experience' },
  { id: 'skills', title: t('sections.skills') || 'Skills' },
  { id: 'publications', title: t('sections.publications') || 'Publications' },
  { id: 'awards', title: t('sections.awards') || 'Awards' },
  { id: 'talks', title: t('sections.talks') || 'Talks' },
]

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

  const tocSections = getTOCSections(t)

  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-lg transition-all duration-300 print:hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left: Last Updated */}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span className="font-medium text-muted-foreground">
              {t('common.lastUpdated')}: {lastUpdated}
            </span>
          </div>
          
          {/* Center: Table of Contents */}
          <div className="flex-1 flex justify-center">
            <TableOfContents sections={tocSections} />
          </div>
          
          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="px-3 py-2 h-auto"
                  aria-label={t('common.language')}
                >
                  <Languages className="h-4 w-4" />
                  <span className="hidden sm:inline-block ml-2 font-medium">
                    {localeLabels[currentLocale || 'en']}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48"
                sideOffset={8}
              >
                {locales.map((locale) => {
                  const href = createLocalizedPath(pathname, locale)
                  const isActive = currentLocale === locale
                  
                  return (
                    <DropdownMenuItem key={locale} asChild>
                      <Link
                        href={href}
                        className={`flex w-full cursor-pointer transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-muted/50'
                        }`}
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
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-3 py-2 h-auto relative overflow-hidden"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 