'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { locales, localeLabels } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'
import clsx from 'clsx'

// Navigation menu items for TOC
const navigationItems = [
  { id: 'hero', href: '#hero' },
  { id: 'profile', href: '#profile' },
  { id: 'education', href: '#education' },
  { id: 'experience', href: '#experience' },
  { id: 'skills', href: '#skills' },
  { id: 'publications', href: '#publications' },
  { id: 'awards', href: '#awards' },
]

const themeOptions = [
  { value: 'light', label: 'Light', icon: 'mingcute:sun-line' },
  { value: 'dark', label: 'Dark', icon: 'mingcute:moon-line' },
  { value: 'system', label: 'System', icon: 'mingcute:computer-line' },
]

// Language flags using twemoji
const languageFlags: Record<string, string> = {
  'en': 'twemoji:flag-united-states',
  'zh': 'twemoji:flag-china',
  'yue': 'twemoji:flag-hong-kong-sar-china',
  'ja': 'twemoji:flag-japan',
  'ko': 'twemoji:flag-south-korea',
}

export function CVHeader() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSection, setCurrentSection] = useState<string>(navigationItems[0]?.id || 'hero')

  // Track current section using intersection observer
  const debouncedSetCurrentSection = useCallback((sectionId: string) => {
    setCurrentSection(sectionId)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const observerOptions = {
      threshold: [0.1, 0.5, 0.9],
      rootMargin: '-80px 0px -60% 0px'
    }

    const sectionElements = new Map<string, HTMLElement>()
    const observers = new Map<string, IntersectionObserver>()
    
    // Find and store all section elements
    navigationItems.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        sectionElements.set(section.id, element)
      }
    })

    // Create intersection observers for each section
    sectionElements.forEach((element, sectionId) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
              debouncedSetCurrentSection(sectionId)
            }
          })
        },
        observerOptions
      )
      
      observer.observe(element)
      observers.set(sectionId, observer)
    })

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      observers.forEach((observer) => observer.disconnect())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [debouncedSetCurrentSection])

  const handleSectionClick = (href: string) => {
    const sectionId = href.replace('#', '')
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }

  const getNavigationLabel = (id: string) => {
    const labelMap: Record<string, string> = {
      'hero': t('navigation.about') || 'About',
      'profile': t('sections.profileHighlights') || 'Profile',
      'education': t('sections.education') || 'Education',
      'experience': t('sections.experience') || 'Experience',
      'skills': t('sections.skills') || 'Skills',
      'publications': t('sections.publications') || 'Publications',
      'awards': t('sections.awards') || 'Awards',
    }
    return labelMap[id] || id
  }

  const currentThemeOption = themeOptions.find(option => option.value === theme) || themeOptions[2]
  const currentSectionLabel = getNavigationLabel(currentSection)

  return (
    <header 
      className={clsx(
        'sticky top-4 z-50 mx-auto mb-8 max-w-2xl transition-all duration-300 print:hidden',
        isScrolled 
          ? 'rounded-2xl border border-border bg-background/80 px-4 py-2 shadow-lg backdrop-blur-lg' 
          : 'rounded-2xl border border-transparent bg-background/60 px-4 py-2 backdrop-blur-sm'
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left: Home Icon */}
        <Link
          href="/"
          className="flex items-center"
          aria-label="Home"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted/50"
          >
            <Icon icon="mingcute:home-1-line" className="h-4 w-4" />
          </Button>
        </Link>

        {/* Center: Current Section / TOC */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-muted/50"
              aria-label="Table of Contents"
            >
              <Icon icon="mingcute:list-check-3-line" className="h-4 w-4" />
              <span className="max-w-32 truncate">
                {isScrolled ? currentSectionLabel : 'CV'}
              </span>
              <Icon icon="mingcute:down-line" className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="center" 
            className="w-48"
            sideOffset={8}
          >
            {navigationItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleSectionClick(item.href)}
                className={clsx(
                  "cursor-pointer",
                  currentSection === item.id 
                    ? "bg-primary/10 font-medium text-primary" 
                    : "hover:bg-muted/50"
                )}
              >
                {getNavigationLabel(item.id)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right: Language & Theme */}
        <div className="flex items-center gap-1">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
                aria-label={t('common.language')}
              >
                <Icon 
                  icon={languageFlags[currentLocale || 'en']} 
                  className="h-4 w-4" 
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-40"
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
                        "flex w-full cursor-pointer items-center gap-2", 
                        isActive 
                          ? "bg-primary/10 font-medium text-primary" 
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Icon 
                        icon={languageFlags[locale]} 
                        className="h-4 w-4" 
                      />
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
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
                aria-label="Toggle theme"
              >
                <Icon icon={currentThemeOption.icon} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-32"
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
                    <Icon icon={option.icon} className="h-4 w-4" />
                    {option.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 