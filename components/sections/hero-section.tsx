'use client'

import Image from "next/image"
import { MapPin, Calendar, Mail, Globe, Github, Linkedin, Phone, MessageCircle, Download, User, BookOpen } from "lucide-react"
import { useTranslations } from 'next-intl'

interface HeroSectionProps {
  data: {
    name: string
    enName: string
    avatar: string
    location: string
    age: number
    bio?: string
    social: {
      github?: string
      email?: string
      linkedin?: string
      website?: string
      phone?: string
      wechat?: string
      twitter?: string
      orcid?: string
      googleScholar?: string
      researchGate?: string
    }
  }
  locale?: string
}

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
              <Image
                src={data.avatar || "/placeholder-user.jpg"}
                alt={`${data.name} - ${data.enName}`}
                fill
                className="object-cover"
                priority
                sizes="128px"
                quality={95}
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
            </div>

            {/* Basic details with improved spacing */}
            <div className="flex flex-wrap gap-6 paper-meta print:text-gray-600 mb-6">
              {data.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary/70" />
                  <span className="font-medium">{data.location}</span>
                </div>
              )}
              {data.age && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary/70" />
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
            {/* Essential contacts */}
            {data.social.email && (
              <a
                href={`mailto:${data.social.email}`}
                className="paper-contact-link print:hover:text-primary"
              >
                <Mail className="h-5 w-5 text-primary/70" />
                <span className="truncate font-medium">{data.social.email}</span>
              </a>
            )}

            {data.social.phone && (
              <a
                href={`tel:${data.social.phone.replace(/\s/g, '')}`}
                className="paper-contact-link print:hover:text-primary"
              >
                <Phone className="h-5 w-5 text-primary/70" />
                <span className="font-medium">{data.social.phone}</span>
              </a>
            )}

            {data.social.website && (
              <a
                href={data.social.website}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-contact-link print:hover:text-primary"
              >
                <Globe className="h-5 w-5 text-primary/70" />
                <span className="truncate font-medium">
                  {data.social.website.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </a>
            )}

            {data.social.github && (
              <a
                href={data.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-contact-link print:hover:text-primary"
              >
                <Github className="h-5 w-5 text-primary/70" />
                <span className="truncate font-medium">
                  GitHub: {data.social.github.split("/").pop()}
                </span>
              </a>
            )}

            {data.social.linkedin && (
              <a
                href={data.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-contact-link print:hover:text-primary"
              >
                <Linkedin className="h-5 w-5 text-primary/70" />
                <span className="font-medium">LinkedIn</span>
              </a>
            )}

            {data.social.wechat && (
              <div className="paper-contact-link">
                <MessageCircle className="h-5 w-5 text-primary/70" />
                <span className="font-medium">WeChat: {data.social.wechat}</span>
              </div>
            )}

            {/* Academic/Research contacts */}
            {data.social.orcid && (
              <a
                href={data.social.orcid}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-contact-link print:hover:text-primary"
              >
                <User className="h-5 w-5 text-primary/70" />
                <span className="font-medium">ORCID</span>
              </a>
            )}

            {data.social.googleScholar && (
              <a
                href={data.social.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-contact-link print:hover:text-primary"
              >
                <BookOpen className="h-5 w-5 text-primary/70" />
                <span className="font-medium">Google Scholar</span>
              </a>
            )}

            {data.social.researchGate && (
              <a
                href={data.social.researchGate}
                target="_blank"
                rel="noopener noreferrer"
                className="paper-contact-link print:hover:text-primary"
              >
                <BookOpen className="h-5 w-5 text-primary/70" />
                <span className="font-medium">ResearchGate</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
