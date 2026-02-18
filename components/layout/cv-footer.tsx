'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useMemo } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { locales, localeLabels } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'

interface CVFooterProps {
  className?: string
  compact?: boolean
  showLocaleThemeControls?: boolean
  lastUpdated?: string
}

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

export function CVFooter({ className, compact = false, showLocaleThemeControls = false, lastUpdated }: CVFooterProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  const currentThemeOption = themeOptions.find((option) => option.value === theme) || themeOptions[2]

  const relativeUpdated = useMemo(() => {
    const locale = currentLocale || 'en'
    const parsedDate = lastUpdated ? new Date(lastUpdated) : new Date()
    const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate
    const diffMs = safeDate.getTime() - Date.now()

    const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
      ['year', 1000 * 60 * 60 * 24 * 365],
      ['month', 1000 * 60 * 60 * 24 * 30],
      ['week', 1000 * 60 * 60 * 24 * 7],
      ['day', 1000 * 60 * 60 * 24],
      ['hour', 1000 * 60 * 60],
      ['minute', 1000 * 60],
    ]

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

    for (const [unit, ms] of ranges) {
      if (Math.abs(diffMs) >= ms || unit === 'minute') {
        return rtf.format(Math.round(diffMs / ms), unit)
      }
    }

    return rtf.format(0, 'minute')
  }, [currentLocale, lastUpdated])

  const footerLinks = [
    {
      href: '/llms.txt',
      label: 'LLMs.txt',
      icon: 'mingcute:ai-line'
    }
  ]

  return (
    <footer
      className={clsx(
        'mx-auto mt-12 max-w-2xl border-t border-border/30 bg-background/60 backdrop-blur-sm',
        className
      )}
    >
      <div
        className={clsx(
          'flex flex-col items-center gap-3 px-4 text-xs text-muted-foreground sm:flex-row sm:justify-between',
          compact ? 'pt-0 pb-4' : 'py-6'
        )}
      >
        {/* Last Updated */}
        <div className="flex items-center gap-1.5">
          <Icon icon="mingcute:calendar-line" className="h-3 w-3" />
          <span>
            {t('common.lastUpdated')}: {relativeUpdated}
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
              title={link.label}
            >
              <Icon icon={link.icon} className="h-3 w-3" />
              <span>{link.label}</span>
            </a>
          ))}

          {showLocaleThemeControls && (
            <>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-muted/50"
                    aria-label={t('common.language')}
                  >
                    <Icon icon={languageFlags[currentLocale || 'en']} className="h-3.5 w-3.5" />
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
                    className="h-7 w-7 p-0 hover:bg-muted/50"
                    aria-label="Toggle theme"
                  >
                    <Icon icon={currentThemeOption.icon} className="h-3.5 w-3.5" />
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
            </>
          )}
        </div>
      </div>
    </footer>
  )
} 
