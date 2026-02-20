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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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

  const { relativeUpdated, updateToneClass } = useMemo(() => {
    const locale = currentLocale || 'en'
    const parsedDate = lastUpdated ? new Date(lastUpdated) : new Date()
    const safeDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate
    const diffMs = safeDate.getTime() - Date.now()
    const elapsedMs = Math.max(0, Date.now() - safeDate.getTime())

    const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
      ['year', 1000 * 60 * 60 * 24 * 365],
      ['month', 1000 * 60 * 60 * 24 * 30],
      ['week', 1000 * 60 * 60 * 24 * 7],
      ['day', 1000 * 60 * 60 * 24],
      ['hour', 1000 * 60 * 60],
      ['minute', 1000 * 60],
    ]

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
    let text = rtf.format(0, 'minute')

    for (const [unit, ms] of ranges) {
      if (Math.abs(diffMs) >= ms || unit === 'minute') {
        text = rtf.format(Math.round(diffMs / ms), unit)
        break
      }
    }

    let toneClass = 'text-foreground/80'
    if (elapsedMs < 1000 * 60 * 30) {
      toneClass = 'text-foreground'
    } else if (elapsedMs < 1000 * 60 * 60 * 6) {
      toneClass = 'text-foreground/85'
    } else if (elapsedMs < 1000 * 60 * 60 * 24) {
      toneClass = 'text-foreground/80'
    } else if (elapsedMs < 1000 * 60 * 60 * 24 * 7) {
      toneClass = 'text-foreground/80'
    } else if (elapsedMs < 1000 * 60 * 60 * 24 * 30) {
      toneClass = 'text-foreground/80'
    }

    return { relativeUpdated: text, updateToneClass: toneClass }
  }, [currentLocale, lastUpdated])

  const footerLinks = [
    {
      href: '/llms.txt',
      label: 'LLMs.txt',
      icon: 'mingcute:ai-line'
    }
  ]
  const copyrightText = `© ${new Date().getFullYear()} Xeraphinite. All rights reserved.`

  return (
    <footer
      className={clsx(
        'mx-auto mt-12 max-w-2xl border-t border-border/30 bg-background/60 backdrop-blur-sm',
        className
      )}
    >
      <TooltipProvider delayDuration={120}>
        <div
          className={clsx(
            'px-4 text-xs text-foreground/80',
            compact ? 'pt-0 pb-2' : 'pt-6 pb-3'
          )}
        >
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <Icon icon="mingcute:calendar-line" className="h-3 w-3" />
                  <span className={clsx('transition-colors', updateToneClass)}>{relativeUpdated}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>Last updated</span>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-4">
              {footerLinks.map((link) => (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <a
                      href={link.href}
                      className="flex items-center gap-1 transition-colors hover:text-foreground"
                      title={link.label}
                    >
                      <Icon icon={link.icon} className="h-3 w-3" />
                      <span>{link.label}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <span>{link.label}</span>
                  </TooltipContent>
                </Tooltip>
              ))}

              {showLocaleThemeControls && (
                <>
                  <DropdownMenu modal={false}>
                    <Tooltip>
                      <TooltipTrigger asChild>
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
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <span>{t('common.language')}</span>
                      </TooltipContent>
                    </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted/50" aria-label="Theme">
                            <Icon icon={currentThemeOption.icon} className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <span>Theme</span>
                      </TooltipContent>
                    </Tooltip>
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

          <div className="mt-2 text-center">
            <span className="whitespace-nowrap text-foreground/80">{copyrightText}</span>
          </div>
        </div>
      </TooltipProvider>
    </footer>
  )
} 
