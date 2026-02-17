'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableOfContents } from '@/components/layout/table-of-contents'
import { locales, localeLabels } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'

interface CVControlsProps {
  bare?: boolean
  className?: string
  showHome?: boolean
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

export function CVControls({ bare = false, className, showHome = true }: CVControlsProps) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)
  const currentThemeOption = themeOptions.find((option) => option.value === theme) || themeOptions[2]

  return (
    <div
      className={clsx(
        bare
          ? 'px-0 py-0'
          : 'rounded-2xl border border-border bg-background/80 px-3 py-2 shadow-sm backdrop-blur-sm',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {showHome ? (
          <Link href="/" className="flex items-center" aria-label="Home">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/50">
              <Icon icon="mingcute:home-1-line" className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <span aria-hidden className="h-8 w-8" />
        )}

        <TableOfContents />

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
    </div>
  )
}
