'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { MarkdownText } from '@/components/ui/markdown-text'
import { formatToYearMonth } from '@/lib/date-format'

interface Experience {
  company: string
  position: string
  location?: string
  startDate: string
  endDate?: string
  summary?: string
  highlights: string[]
}

interface ExperienceSectionProps {
  data: Experience[]
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
  const t = useTranslations()

  const renderYearMonthWithSup = (value: string) => {
    const formatted = formatToYearMonth(value)
    const match = formatted.match(/^(\d{4})\.?(\d{2})$/)
    if (!match) return <>{formatted}</>
    return (
      <>
        <span>{match[1]}</span>
        <sup className="relative top-[0.04em] ml-0.5 align-super text-[0.72em] font-semibold">{match[2]}</sup>
      </>
    )
  }
  
  if (!data || data.length === 0) {
    return null
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title !mb-1.5 sm:!mb-2 !pb-0.5 sm:!pb-1">
        <Icon icon="mingcute:telescope-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.experience')}
      </h2>

      <div className="space-y-4">
        {data.map((experience, index) => (
          <div key={`${experience.company}-${experience.position}-${index}`} className="paper-card transition-all duration-300">
            <div className="grid grid-cols-[minmax(12ch,auto)_minmax(0,1fr)] items-start gap-x-4 gap-y-2">
              <p className="paper-meta whitespace-nowrap font-sans !text-sm !font-bold leading-tight text-muted-foreground">
                {renderYearMonthWithSup(experience.startDate)} - {renderYearMonthWithSup(experience.endDate || 'Present')}
              </p>
              <div className="min-w-0">
                <h3 className="paper-subtitle">{experience.position}</h3>
                <div className="flex items-center gap-2 paper-body mt-1">
                  <Icon icon="mingcute:at-fill" className="h-4 w-4 text-muted-foreground" />
                  <span>{experience.company}</span>
                </div>
              </div>

              {experience.summary && (
                <MarkdownText content={experience.summary} className="paper-body col-start-2 text-sm text-muted-foreground" />
              )}

              {experience.highlights && experience.highlights.length > 0 && (
                <div className="col-start-2">
                  <ul className="space-y-1.5">
                    {experience.highlights.map((highlight, idx) => (
                      <li key={`${experience.company}-highlight-${idx}`} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-2 shrink-0" />
                        <MarkdownText content={highlight} className="paper-body text-sm text-muted-foreground" inline />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
