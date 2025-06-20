'use client'

import { CalendarRange, Briefcase, Building2 } from "lucide-react"
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
  
  if (!data || data.length === 0) return null

  return (
    <section className="print:break-inside-avoid-page">
      <div className="flex items-center gap-3 mb-5 pb-2 border-b border-border print:border-gray-300">
        <div className="flex items-center justify-center w-8 h-8 bg-foreground print:bg-black rounded-xl">
          <Briefcase className="h-4 w-4 text-background print:text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground print:text-black">
          {t('section.experience')}
        </h2>
      </div>

      <div className="space-y-6">
        {data.map((experience, index) => (
          <div key={`${experience.company}-${experience.position}-${index}`} className="print:break-inside-avoid">
            <div className="bg-card print:bg-white border border-border print:border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                {/* Header section */}
                <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-foreground print:text-black mb-3 break-words">{experience.position}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground print:text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="font-medium break-words">{experience.company}</span>
                      </div>
                      {experience.location && (
                        <>
                          <span className="text-muted-foreground print:text-gray-400">•</span>
                          <span className="break-words">{experience.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground print:text-gray-600 bg-muted print:bg-gray-50 px-4 py-2 rounded-full text-sm whitespace-nowrap">
                    <CalendarRange className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">
                      {experience.startDate} - {experience.endDate || t('label.present')}
                    </span>
                  </div>
                </div>

                {experience.summary && (
                  <div className="p-4 bg-muted print:bg-gray-50 rounded-2xl border-l-4 border-border print:border-gray-300">
                    <p className="text-foreground print:text-black leading-relaxed text-sm break-words">{experience.summary}</p>
                  </div>
                )}

                {experience.highlights && experience.highlights.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-medium text-muted-foreground print:text-gray-600 uppercase tracking-wide">Key Achievements</h4>
                    <ul className="space-y-3">
                      {experience.highlights.map((highlight, idx) => (
                        <li key={`${experience.company}-highlight-${idx}`} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-foreground print:bg-black rounded-full mt-2 flex-shrink-0" />
                          <span className="text-foreground print:text-black leading-relaxed text-sm break-words flex-1">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
