'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { locales, localeLabels } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'

const navigationItems = [
  { id: 'hero', href: '#hero' },
  { id: 'education', href: '#education' },
  { id: 'experience', href: '#experience' },
  { id: 'skills', href: '#skills' },
  { id: 'projects', href: '#projects' },
  { id: 'publications', href: '#publications' },
  { id: 'awards', href: '#awards' },
] as const

const themeOptions = [
  { value: 'light', label: 'Light', icon: 'mingcute:sun-line' },
  { value: 'dark', label: 'Dark', icon: 'mingcute:moon-line' },
  { value: 'system', label: 'System', icon: 'mingcute:computer-line' },
] as const

const languageFlags: Record<string, string> = {
  en: 'twemoji:flag-united-states',
  zh: 'twemoji:flag-china',
  yue: 'twemoji:flag-hong-kong-sar-china',
  ja: 'twemoji:flag-japan',
  ko: 'twemoji:flag-south-korea',
}

export function CVHeader() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [currentSection, setCurrentSection] = useState<string>(navigationItems[0]?.id || 'hero')
  const lastScrollYRef = useRef(0)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isScrolledRef = useRef(false)

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }

    const scheduleHeaderHide = () => {
      clearHideTimer()
      hideTimerRef.current = setTimeout(() => {
        setIsHeaderVisible((previous) => (isScrolledRef.current ? false : previous))
      }, 2200)
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollYRef.current
      const next = currentScrollY > 20

      setIsScrolled((previous) => (previous === next ? previous : next))
      isScrolledRef.current = next
      if (!next) {
        setIsHeaderVisible(true)
        clearHideTimer()
      } else if (delta < -2) {
        setIsHeaderVisible(true)
        scheduleHeaderHide()
      } else if (delta > 2) {
        scheduleHeaderHide()
      }

      lastScrollYRef.current = currentScrollY
    }

    const handleUserActivity = () => {
      if (!isScrolledRef.current) return
      setIsHeaderVisible(true)
      scheduleHeaderHide()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let bestId: string | null = null
        let bestRatio = 0

        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio <= 0.1) continue
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestId = entry.target.id
          }
        }

        if (bestId) {
          setCurrentSection((previous) => (previous === bestId ? previous : bestId))
        }
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '-80px 0px -60% 0px',
      }
    )

    for (const section of navigationItems) {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    }

    lastScrollYRef.current = window.scrollY
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleUserActivity, { passive: true })
    window.addEventListener('touchstart', handleUserActivity, { passive: true })
    window.addEventListener('keydown', handleUserActivity)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('touchstart', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      clearHideTimer()
    }
  }, [])

  const handleSectionClick = (href: string) => {
    const sectionId = href.replace('#', '')
    const element = document.getElementById(sectionId)
    if (!element) return

    window.scrollTo({
      top: element.offsetTop - 80,
      behavior: 'smooth',
    })
  }

  const getNavigationLabel = (id: string) => {
    switch (id) {
      case 'hero':
        return t('navigation.about') || 'About'
      case 'education':
        return t('sections.education') || 'Education'
      case 'experience':
        return t('sections.experience') || 'Experience'
      case 'skills':
        return t('sections.skills') || 'Skills'
      case 'projects':
        return t('sections.selectedProjects') || 'Projects'
      case 'publications':
        return t('sections.publications') || 'Publications'
      case 'awards':
        return t('sections.awards') || 'Awards'
      default:
        return id
    }
  }

  const currentThemeOption = themeOptions.find((option) => option.value === theme) || themeOptions[2]
  const currentSectionLabel = getNavigationLabel(currentSection)

  return (
    <header
      className={clsx(
        'sticky top-4 z-50 mx-auto mb-8 max-w-2xl transition-all duration-300 ',
        isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0 pointer-events-none',
        isScrolled
          ? 'rounded-2xl border border-border bg-background/80 px-4 py-2 shadow-lg backdrop-blur-lg'
          : 'rounded-2xl border border-transparent bg-background/60 px-4 py-2 backdrop-blur-sm'
      )}
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Home">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
            <Icon icon="mingcute:home-1-line" className="h-4 w-4" />
          </Button>
        </Link>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium hover:bg-muted/50"
              aria-label="Table of Contents"
            >
              <span className="max-w-32 truncate">{isScrolled ? currentSectionLabel : 'CV'}</span>
              <Icon icon="mingcute:down-line" className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48" sideOffset={8}>
            {navigationItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleSectionClick(item.href)}
                className={clsx(
                  'cursor-pointer',
                  currentSection === item.id ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted/50'
                )}
              >
                {getNavigationLabel(item.id)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-muted/50"
                aria-label={t('common.language')}
              >
                <Icon icon={languageFlags[currentLocale || 'en']} className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40" sideOffset={8}>
              {locales.map((locale) => {
                const href = createLocalizedPath(pathname, locale)
                const isActive = currentLocale === locale

                return (
                  <DropdownMenuItem key={locale} asChild>
                    <Link
                      href={href}
                      className={clsx(
                        'flex w-full cursor-pointer items-center gap-2',
                        isActive ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted/50'
                      )}
                    >
                      <Icon icon={languageFlags[locale]} className="h-4 w-4" />
                      {localeLabels[locale]}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu modal={false}>
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
            <DropdownMenuContent align="end" className="w-32" sideOffset={8}>
              {themeOptions.map((option) => {
                const isActive = theme === option.value

                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={clsx(
                      'flex cursor-pointer items-center gap-2',
                      isActive ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted/50'
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
