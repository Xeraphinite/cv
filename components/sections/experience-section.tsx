'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'

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
  
  if (!data || data.length === 0) {
    return null
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:briefcase-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.experience')}
      </h2>

      <div className="space-y-6">
        {data.map((experience, index) => (
          <div key={`${experience.company}-${experience.position}-${index}`} className="paper-card transition-all duration-300">
            <div className="space-y-3">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <h3 className="paper-subtitle">{experience.position}</h3>
                  <div className="flex items-center gap-2 paper-body mt-1">
                    <Icon icon="mingcute:building-2-line" className="h-4 w-4 text-muted-foreground" />
                    <span>{experience.company}</span>
                    {experience.location && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="paper-meta">{experience.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 paper-meta mt-2 sm:mt-0">
                  <Icon icon="mingcute:calendar-line" className="h-4 w-4" />
                  <span>
                    {experience.startDate} - {experience.endDate || 'Present'}
                  </span>
                </div>
              </div>

              {experience.summary && (
                <p className="paper-body !mt-4">
                  {experience.summary}
                </p>
              )}

              {experience.highlights && experience.highlights.length > 0 && (
                <div className="!mt-4">
                  <ul className="space-y-1.5">
                    {experience.highlights.map((highlight, idx) => (
                      <li key={`${experience.company}-highlight-${idx}`} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-2 shrink-0" />
                        <span className="paper-body">{highlight}</span>
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
