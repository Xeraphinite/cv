'use client'

import { Calendar, Briefcase, Building2 } from "lucide-react"
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
    <section className="paper-section print:break-inside-avoid">
      <h2 className="paper-section-title print:text-black">
        <Briefcase className="h-5 w-5 mr-3 inline-block text-primary" />
        {t('sections.experience')}
      </h2>

      <div className="space-y-8">
        {data.map((experience, index) => (
          <div key={`${experience.company}-${experience.position}-${index}`} className="paper-card print:bg-white print:border-gray-300 print:break-inside-avoid transition-all duration-300 hover:shadow-lg hover:border-primary/20">
            <div className="space-y-4">
              {/* Header section */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <h3 className="paper-subtitle print:text-black">{experience.position}</h3>
                  <div className="flex items-center gap-2 paper-body mt-1">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
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
                  <Calendar className="h-4 w-4" />
                  <span>
                    {experience.startDate} - {experience.endDate || 'Present'}
                  </span>
                </div>
              </div>

              {experience.summary && (
                <p className="paper-body print:text-gray-700 !mt-5">
                  {experience.summary}
                </p>
              )}

              {experience.highlights && experience.highlights.length > 0 && (
                <div className="!mt-5">
                  <ul className="space-y-2">
                    {experience.highlights.map((highlight, idx) => (
                      <li key={`${experience.company}-highlight-${idx}`} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-2 shrink-0" />
                        <span className="paper-body print:text-gray-700">{highlight}</span>
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
