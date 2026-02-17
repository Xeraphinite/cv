'use client'

import { Icon } from '@iconify/react'
import { useSectionTranslations, useLabelTranslations } from '@/hooks/use-translations'

interface EducationItem {
  institution: string
  area: string
  degree: string
  startDate: string
  endDate: string
  summary?: string
  highlights: string[]
  supervisor?: string
}

interface EducationSectionProps {
  data: EducationItem[]
}

export function EducationSection({ data }: EducationSectionProps) {
  const tSection = useSectionTranslations()
  const tLabel = useLabelTranslations()
  
  if (!data || data.length === 0) return null

  const formatDate = (dateString: string) => {
    return dateString // Keep as is for now
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:mortarboard-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {tSection('education')}
      </h2>

      <div className="space-y-6">
        {data.map((education, index) => (
          <div key={`${education.institution}-${education.degree}-${index}`} className="paper-card transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex-1 space-y-3">
                {/* Institution and Degree */}
                <div>
                  <h3 className="paper-subtitle mb-1">
                    {education.institution}
                  </h3>
                  <p className="paper-body font-medium">
                    {education.degree} {tLabel('in')} {education.area}
                  </p>
                </div>

                {/* Duration and Supervisor */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 paper-meta">
                  <div className="flex items-center gap-2">
                    <Icon icon="mingcute:calendar-line" className="h-4 w-4" />
                    <span>{formatDate(education.startDate)} - {formatDate(education.endDate)}</span>
                  </div>
                  
                  {education.supervisor && (
                    <div className="flex items-center gap-2">
                      <Icon icon="mingcute:user-3-line" className="h-4 w-4" />
                      <span>{tLabel('supervisor')}: {education.supervisor}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Highlights */}
            {education.highlights && education.highlights.length > 0 && (
              <div className="mt-4">
                <ul className="space-y-1.5">
                  {education.highlights.map((highlight, i) => (
                    <li key={`${education.institution}-highlight-${i}`} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-2 shrink-0" />
                      <span className="paper-body">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
