'use client'

import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { getLocaleFromPathname } from '@/lib/i18n-utils'

export function CVFooter() {
  const t = useTranslations()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)

  const lastUpdated = new Date()
  const fullDate = lastUpdated.toLocaleDateString(currentLocale || 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const footerLinks = [
    {
      href: '/rss.xml',
      label: 'RSS',
      icon: 'mingcute:rss-line'
    },
    {
      href: '/sitemap.xml',
      label: 'Sitemap',
      icon: 'mingcute:map-2-line'
    },
    {
      href: '/llms.txt',
      label: 'LLMs.txt',
      icon: 'mingcute:ai-line'
    }
  ]

  return (
    <footer className="mx-auto mt-12 max-w-2xl border-t border-border/30 bg-background/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        {/* Last Updated */}
        <div className="flex items-center gap-1.5">
          <Icon icon="mingcute:calendar-line" className="h-3 w-3" />
          <span>
            {t('common.lastUpdated')}: {fullDate}
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
        </div>
      </div>
    </footer>
  )
} 