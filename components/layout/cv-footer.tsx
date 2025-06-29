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
    <footer className="mt-16 py-8 border-t bg-background/50 backdrop-blur-sm print:hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          {/* Last Updated */}
          <div className="flex items-center gap-2">
            <Icon icon="mingcute:calendar-line" className="h-4 w-4" />
            <span>
              {t('common.lastUpdated')}: {fullDate}
            </span>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                title={link.label}
              >
                <Icon icon={link.icon} className="h-4 w-4" />
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 