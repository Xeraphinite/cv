'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon, Sun, Monitor, Languages, Calendar } from 'lucide-react'
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
  
  const lastUpdated = new Date().toLocaleDateString(currentLocale || 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
      "sticky top-0 z-50 border-border/20 border-b backdrop-blur-lg transition-all duration-300 print:hidden",
      isScrolled 
        ? "bg-background/95 shadow-lg shadow-black/5 border-border/30" 
        : "bg-background/80 hover:bg-background/90"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left: Last Updated */}
          <div className="flex items-center gap-3 text-sm transition-all duration-200 hover:scale-105">
            <Calendar className="h-4 w-4 text-primary/70 transition-colors duration-200" />
            <span className="font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              {t('common.lastUpdated')}: {lastUpdated}
            </span>
          </div>
          
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
                  className="h-auto px-3 py-2 transition-all duration-200 hover:scale-105 hover:shadow-md group"
                  aria-label={t('common.language')}
                >
                  <Languages className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                  <span className="ml-2 hidden font-medium sm:inline-block transition-all duration-200">
                    {localeLabels[currentLocale || 'en']}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
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
                          "flex w-full cursor-pointer transition-all duration-200 hover:translate-x-1", 
                          isActive 
                            ? "bg-primary/10 font-medium text-primary border-l-2 border-primary" 
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
                  className="relative h-auto overflow-hidden px-3 py-2 transition-all duration-200 hover:scale-105 hover:shadow-md group"
                  aria-label="Toggle theme"
                >
                  <currentThemeOption.icon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                  <span className="ml-2 hidden font-medium sm:inline-block">
                    {currentThemeOption.label}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-36 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200"
                sideOffset={8}
              >
                {themeOptions.map((option) => {
                  const isActive = theme === option.value
                  
                  return (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={clsx(
                        "flex items-center gap-2 cursor-pointer transition-all duration-200 hover:translate-x-1",
                        isActive 
                          ? "bg-primary/10 font-medium text-primary border-l-2 border-primary" 
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