'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon, Sun, Monitor, Languages } from 'lucide-react'
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
import clsx from 'clsx'

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

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
]

export function CVHeader() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const tocSections = getTOCSections(t)
  const currentThemeOption = themeOptions.find(option => option.value === theme) || themeOptions[2] // Default to system

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={clsx(
      "sticky top-0 z-50 border-b backdrop-blur-lg transition-all duration-200 print:hidden",
      isScrolled 
        ? "border-border/30 bg-background/95 shadow-sm" 
        : "border-border/20 bg-background/80"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Center: Table of Contents */}
          <div className="flex flex-1 justify-center">
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
                  className="h-auto px-3 py-2 transition-colors"
                  aria-label={t('common.language')}
                >
                  <Languages className="h-4 w-4" />
                  <span className="ml-2 hidden font-medium sm:inline-block">
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
                        className={clsx(
                          "flex w-full cursor-pointer", 
                          isActive 
                            ? "bg-primary/10 font-medium text-primary" 
                            : "hover:bg-muted/50"
                        )}
                      >
                        {localeLabels[locale]}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-auto px-3 py-2 transition-colors"
                  aria-label="Toggle theme"
                >
                  <currentThemeOption.icon className="h-4 w-4" />
                  <span className="ml-2 hidden font-medium sm:inline-block">
                    {currentThemeOption.label}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-36"
                sideOffset={8}
              >
                {themeOptions.map((option) => {
                  const isActive = theme === option.value
                  
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={clsx(
                        "flex cursor-pointer items-center gap-2",
                        isActive 
                          ? "bg-primary/10 font-medium text-primary" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <option.icon className="h-4 w-4" />
                      {option.label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
} 