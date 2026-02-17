'use client'

import Image from 'next/image'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { getResponsiveImageProps } from '@/lib/image-utils'
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

  return (
    <header className="py-6 sm:py-8 print:py-6">
      <div className="paper-card">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[128px_1fr] md:gap-8">
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
            <h1 className={`${typographyClasses.title} mb-2 print:text-black`}>{formatNameWithRuby()}</h1>

            {locale !== 'ja' && data.enName && (
              <h2 className={`${typographyClasses.subtitle} text-muted-foreground/80 print:text-gray-600`}>{data.enName}</h2>
            )}

            <div className="mt-3 flex flex-wrap gap-2 sm:gap-3 print:mt-3">
              {data.location && (
                <div className="paper-contact-link group">
                  <div className="relative h-4 w-4">
                    <Icon
                      icon="mingcute:canton-tower-line"
                      className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
                    />
                    <Icon
                      icon="mingcute:canton-tower-fill"
                      className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                  </div>
                  <span className={fontClass}>{data.location}</span>
                </div>
              )}

              {socialPlatforms.map(({ key, iconLine, iconFill, getHref, getLabel, external }) => {
                const value = data.social[key as keyof typeof data.social]
                if (!value) return null

                const href = getHref(value)
                const label = getLabel(value)
                const isClickable = key !== 'wechat'
                const labelClass = key === 'email' ? 'break-all' : 'max-w-36 truncate'

                if (isClickable) {
                  return (
                    <a
                      key={key}
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
                  )
                }

                return (
                  <div key={key} className="paper-contact-link group">
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
                )
              })}

              <button type="button" onClick={handleDownloadPDF} className="paper-contact-link group print:hidden">
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
            </div>

            {data.description && (
              <p className={`${typographyClasses.body} mt-3 text-primary/90 print:text-gray-800`}>{data.description}</p>
            )}

            <div className={`mt-4 flex flex-wrap gap-4 ${typographyClasses.meta} print:text-gray-600`}>
              {data.age && (
                <span className="inline-flex items-center gap-2">
                  <Icon icon="mingcute:calendar-line" className="h-4 w-4 text-primary/70" />
                  <span className={`font-medium ${fontClass}`}>{formatAge(data.age)}</span>
                </span>
              )}
            </div>

            {data.bio && <p className={`${typographyClasses.body} mt-4 text-foreground/85 print:text-gray-700`}>{data.bio}</p>}
          </div>
        </div>
      </div>
    </header>
  )
}
