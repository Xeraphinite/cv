'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { getResponsiveImageProps } from '@/lib/image-utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { HeroLocation } from '@/components/sections/hero-location'
import { getFontClass, getTypographyClasses } from '@/lib/utils'

interface HeroSectionProps {
  data: {
    name: string
    enName?: string
    avatar: string
    location: string
    age: string | number
    bio?: string
    description?: string
    social: {
      email?: string
      github?: string
      wechat?: string
      website?: string
      googleScholar?: string
      orcid?: string
      bluesky?: string
      phone?: string
      linkedin?: string
      twitter?: string
      researchGate?: string
    }
  }
  locale?: string
}

const socialPlatforms = [
  {
    key: 'email',
    iconLine: 'mingcute:mail-line',
    iconFill: 'mingcute:mail-fill',
    getHref: (value: string) => `mailto:${value}`,
    getLabel: (value: string) => value,
    external: false,
  },
  {
    key: 'github',
    iconLine: 'mingcute:github-line',
    iconFill: 'mingcute:github-fill',
    getHref: (value: string) => value,
    getLabel: (value: string) => value.split('/').pop() || 'GitHub',
    external: true,
  },
  {
    key: 'wechat',
    iconLine: 'mingcute:wechat-line',
    iconFill: 'mingcute:wechat-fill',
    getHref: (_value: string) => '#',
    getLabel: (value: string) => value,
    external: false,
  },
  {
    key: 'website',
    iconLine: 'mingcute:world-line',
    iconFill: 'mingcute:world-fill',
    getHref: (value: string) => value,
    getLabel: (value: string) => {
      try {
        return new URL(value).hostname.replace(/^www\./, '')
      } catch {
        return value.replace(/^https?:\/\/(www\.)?/, '')
      }
    },
    external: true,
  },
  {
    key: 'googleScholar',
    iconLine: 'academicons:google-scholar',
    iconFill: 'academicons:google-scholar',
    getHref: (value: string) => value,
    getLabel: (_value: string) => 'Scholar',
    external: true,
  },
  {
    key: 'orcid',
    iconLine: 'academicons:orcid',
    iconFill: 'academicons:orcid',
    getHref: (value: string) => value,
    getLabel: (_value: string) => 'ORCID',
    external: true,
  },
  {
    key: 'bluesky',
    iconLine: 'mingcute:bluesky-social-line',
    iconFill: 'mingcute:bluesky-social-fill',
    getHref: (value: string) => value,
    getLabel: (_value: string) => 'Bsky',
    external: true,
  },
] as const

function HoverTip({ children, tip }: { children: ReactNode; tip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" align="start">
        <span>{tip}</span>
      </TooltipContent>
    </Tooltip>
  )
}

export function HeroSection({ data, locale }: HeroSectionProps) {
  const t = useTranslations()
  const typographyClasses = getTypographyClasses(locale)
  const fontClass = getFontClass(locale)

  const handleDownloadPDF = () => {
    const link = document.createElement('a')
    link.href = '/cv.pdf'
    link.download = `${data.name.replace(/\s+/g, '_')}_CV.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatNameWithRuby = () => {
    if (locale === 'ja') {
      return (
        <ruby className="paper-ruby">
          {data.name}
          <rt>{data.enName ?? data.name}</rt>
        </ruby>
      )
    }
    return data.name
  }

  const formatAge = (ageString: string | number) => {
    if (typeof ageString === 'string' && ageString.includes('-')) {
      const [year, month] = ageString.split('-')
      const birthDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return `${age} ${t('content.yearsOld')}`
    }
    return `${ageString} ${t('content.yearsOld')}`
  }

  const getSocialHoverTip = (key: (typeof socialPlatforms)[number]['key']) => {
    switch (key) {
      case 'email':
        return 'Email'
      case 'github':
        return 'GitHub'
      case 'wechat':
        return 'WeChat'
      case 'website':
        return 'Website'
      case 'googleScholar':
        return 'Google Scholar'
      case 'orcid':
        return 'ORCID'
      case 'bluesky':
        return 'Bluesky'
      default:
        return t('content.contact')
    }
  }

  return (
    <header className="pt-0 pb-6 sm:pb-8">
      <div className="paper-card">
        <div className="grid grid-cols-1 gap-6">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 paper-avatar">
            <Image
              src={data.avatar || '/placeholder-user.jpg'}
              alt={`${data.name} - ${data.enName ?? data.name}`}
              fill
              className="object-cover"
              priority
              {...getResponsiveImageProps(
                data.avatar || '/placeholder-user.jpg',
                '(max-width: 768px) 112px, 128px'
              )}
            />
          </div>

          <div className="min-w-0">
            <h1 className={`${typographyClasses.title} mb-2`}>{formatNameWithRuby()}</h1>

            {locale !== 'ja' && data.enName && (
              <h2 className={`${typographyClasses.subtitle} text-muted-foreground/80`}>{data.enName}</h2>
            )}

            {data.description && (
              <p className={`${typographyClasses.body} mt-3 text-primary/90`}>{data.description}</p>
            )}

            {data.bio && <p className={`${typographyClasses.body} mt-4 text-foreground/85`}>{data.bio}</p>}

            <TooltipProvider delayDuration={120}>
              <div className="mt-4 flex flex-col space-y-3">
                {data.location && (
                  <HeroLocation location={data.location} locale={locale} />
                )}

                {socialPlatforms.map(({ key, iconLine, iconFill, getHref, getLabel, external }) => {
                  const value = data.social[key as keyof typeof data.social]
                  if (!value) return null

                  const href = getHref(value)
                  const label = getLabel(value)
                  const isClickable = key !== 'wechat'
                  const labelClass = 'break-all'

                  if (isClickable) {
                    return (
                      <HoverTip key={key} tip={getSocialHoverTip(key)}>
                        <a
                          href={href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                          className="paper-contact-link group"
                        >
                          <div className="relative h-4 w-4">
                            <Icon
                              icon={iconLine}
                              className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
                            />
                            <Icon
                              icon={iconFill}
                              className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                            />
                          </div>
                          <span className={labelClass}>{label}</span>
                        </a>
                      </HoverTip>
                    )
                  }

                  return (
                    <HoverTip key={key} tip={getSocialHoverTip(key)}>
                      <div className="paper-contact-link group">
                        <div className="relative h-4 w-4">
                          <Icon
                            icon={iconLine}
                            className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
                          />
                          <Icon
                            icon={iconFill}
                            className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          />
                        </div>
                        <span className={labelClass}>{label}</span>
                      </div>
                    </HoverTip>
                  )
                })}

                <HoverTip tip={t('actions.downloadPDF')}>
                  <button type="button" onClick={handleDownloadPDF} className="paper-contact-link group">
                    <div className="relative h-4 w-4">
                      <Icon
                        icon="mingcute:pdf-line"
                        className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
                      />
                      <Icon
                        icon="mingcute:pdf-fill"
                        className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </div>
                    <span>PDF</span>
                  </button>
                </HoverTip>

                {data.age && (
                  <HoverTip tip={t('content.yearsOld')}>
                    <span className={`inline-flex items-center gap-2 paper-contact-link ${typographyClasses.meta}`}>
                      <Icon icon="mingcute:calendar-line" className="h-4 w-4 text-primary/70" />
                      <span className={`font-medium ${fontClass}`}>{formatAge(data.age)}</span>
                    </span>
                  </HoverTip>
                )}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  )
}
