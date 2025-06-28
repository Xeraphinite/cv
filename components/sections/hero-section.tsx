'use client'

import { Icon } from '@iconify/react'
import { Download } from "lucide-react"
import { useTranslations } from 'next-intl'
import { getResponsiveImageProps } from '@/lib/image-utils'
import { LoadingImage } from '@/components/ui/loading-image'

interface HeroSectionProps {
  data: {
    name: string
    enName: string
    avatar: string
    location: string
    age: number
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
      // Legacy fields for backward compatibility
      phone?: string
      linkedin?: string
      twitter?: string
      researchGate?: string
    }
  }
  locale?: string
}

// Define social platform configurations with mingcute icons
const socialPlatforms = [
  {
    key: 'email',
    iconLine: 'mingcute:mail-line',
    iconFill: 'mingcute:mail-fill',
    getHref: (value: string) => `mailto:${value}`,
    getLabel: (value: string) => value,
    external: false
  },
  {
    key: 'github',
    iconLine: 'mingcute:github-line',
    iconFill: 'mingcute:github-fill',
    getHref: (value: string) => value,
    getLabel: (value: string) => `GitHub: ${value.split("/").pop()}`,
    external: true
  },
  {
    key: 'wechat',
    iconLine: 'mingcute:wechat-line',
    iconFill: 'mingcute:wechat-fill',
    getHref: (_value: string) => '#',
    getLabel: (value: string) => `WeChat: ${value}`,
    external: false
  },
  {
    key: 'website',
    iconLine: 'mingcute:world-line',
    iconFill: 'mingcute:world-fill',
    getHref: (value: string) => value,
    getLabel: (value: string) => value.replace(/^https?:\/\/(www\.)?/, ""),
    external: true
  },
  {
    key: 'googleScholar',
    iconLine: 'mingcute:user-search-line',
    iconFill: 'mingcute:user-search-fill',
    getHref: (value: string) => value,
    getLabel: (_value: string) => 'Google Scholar',
    external: true
  },
  {
    key: 'orcid',
    iconLine: 'mingcute:idcard-line',
    iconFill: 'mingcute:idcard-fill',
    getHref: (value: string) => value,
    getLabel: (_value: string) => 'ORCID',
    external: true
  },
  {
    key: 'bluesky',
    iconLine: 'mingcute:bluesky-social-line',
    iconFill: 'mingcute:bluesky-social-fill',
    getHref: (value: string) => value,
    getLabel: (_value: string) => 'Bluesky',
    external: true
  }
] as const

export function HeroSection({ data, locale }: HeroSectionProps) {
  const t = useTranslations()
  
  const handleDownloadPDF = () => {
    const link = document.createElement('a')
    link.href = '/cv.pdf'
    link.download = `${data.name.replace(/\s+/g, '_')}_CV.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Format name with ruby text for Japanese
  const formatNameWithRuby = () => {
    if (locale === 'ja') {
      return (
        <ruby className="paper-ruby">
          {data.name}
          <rt>{data.enName}</rt>
        </ruby>
      )
    }
    return data.name
  }

  const formatAge = (ageString: string | number) => {
    if (typeof ageString === 'string' && ageString.includes('-')) {
      // Handle birth date format (YYYY-MM)
      const [year, month] = ageString.split('-')
      const birthDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return `${age} ${t('content.yearsOld')}`
    }
    return `${ageString} ${t('content.yearsOld')}`
  }

  return (
    <header className="paper-container py-12 print:py-8 border-b border-border/30 print:bg-white print:border-b print:border-gray-300">
      <div className="print:break-after-avoid">
        {/* Main header content with magazine-like layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
          {/* Avatar with enhanced styling */}
          <div className="shrink-0 lg:order-2">
            <div className="relative w-32 h-32 paper-avatar print:w-24 print:h-24 print:border-gray-300">
              <LoadingImage
                src={data.avatar || "/placeholder-user.jpg"}
                alt={`${data.name} - ${data.enName}`}
                fill
                className="object-cover"
                priority
                {...getResponsiveImageProps(
                  data.avatar || "/placeholder-user.jpg",
                  "(max-width: 768px) 128px, (max-width: 1024px) 128px, 128px"
                )}
              />
            </div>
          </div>

          {/* Name and basic info with magazine typography */}
          <div className="flex-1 min-w-0 lg:order-1">
            <div className="mb-6">
              <h1 className="paper-title print:text-black mb-3">
                {formatNameWithRuby()}
              </h1>
              {locale !== 'ja' && (
                <h2 className="text-xl text-muted-foreground/80 print:text-gray-600 font-medium tracking-wide">
                  {data.enName}
                </h2>
              )}
              {/* Description */}
              {data.description && (
                <div className="mt-4">
                  <p className="text-lg font-semibold text-primary/90 print:text-gray-800 tracking-wide">
                    {data.description}
                  </p>
                </div>
              )}
            </div>

            {/* Basic details with improved spacing */}
            <div className="flex flex-wrap gap-6 paper-meta print:text-gray-600 mb-6">
              {data.location && (
                <div className="flex items-center gap-3">
                  <Icon 
                    icon="mingcute:location-line" 
                    className="h-5 w-5 text-primary/70" 
                  />
                  <span className="font-medium">{data.location}</span>
                </div>
              )}
              {data.age && (
                <div className="flex items-center gap-3">
                  <Icon 
                    icon="mingcute:calendar-line" 
                    className="h-5 w-5 text-primary/70" 
                  />
                  <span className="font-medium">{formatAge(data.age)}</span>
                </div>
              )}
            </div>

            {/* Bio with enhanced typography */}
            {data.bio && (
              <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg text-foreground/85 print:text-gray-700 leading-relaxed font-light">
                  {data.bio}
                </p>
              </div>
            )}
          </div>

          {/* Download button with Apple styling */}
          <div className="shrink-0 print:hidden lg:order-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="paper-button"
            >
              <Download className="h-5 w-5" />
              {t('actions.downloadPDF')}
            </button>
          </div>
        </div>

        {/* Contact information with magazine grid layout */}
        <div className="border-t border-border/30 pt-8 print:border-t print:border-gray-300">
          <h3 className="paper-subtitle mb-6 print:text-black">{t('content.contact')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm">
            {socialPlatforms.map(({ key, iconLine, iconFill, getHref, getLabel, external }) => {
              const value = data.social[key as keyof typeof data.social]
              if (!value) return null

              const href = getHref(value)
              const label = getLabel(value)
              const isClickable = key !== 'wechat'

              const content = (
                <>
                  <div className="relative h-5 w-5">
                    {/* Line icon (default state) */}
                    <Icon 
                      icon={iconLine}
                      className="h-5 w-5 text-primary/70 absolute inset-0 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                    />
                    {/* Fill icon (hover state) */}
                    <Icon 
                      icon={iconFill}
                      className="h-5 w-5 text-primary absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                    />
                  </div>
                  <span className="truncate font-medium">{label}</span>
                </>
              )

              if (isClickable) {
                return (
                  <a
                    key={key}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="paper-contact-link group print:hover:text-primary"
                  >
                    {content}
                  </a>
                )
              }

              return (
                <div key={key} className="paper-contact-link group">
                  {content}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </header>
  )
}
