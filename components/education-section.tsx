'use client'

import { CalendarRange, GraduationCap } from "lucide-react"
import { useSectionTranslations, useLabelTranslations } from '@/hooks/use-translations'

interface Education {
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
  data: Education[]
}

export function EducationSection({ data }: EducationSectionProps) {
  const tSection = useSectionTranslations()
  const tLabel = useLabelTranslations()
  
  if (!data || data.length === 0) return null

  return (
    <section className="print:break-inside-avoid-page">
      <div className="flex items-center gap-3 mb-5 pb-2 border-b border-border print:border-gray-300">
        <div className="flex items-center justify-center w-8 h-8 bg-foreground print:bg-black rounded-xl">
          <GraduationCap className="h-4 w-4 text-background print:text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground print:text-black">
          {tSection('education')}
        </h2>
      </div>

      <div className="space-y-6">
        {data.map((education, index) => (
          <div key={`${education.institution}-${education.degree}-${index}`} className="print:break-inside-avoid">
            <div className="bg-card print:bg-white border border-border print:border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col space-y-4">
                {/* Header section */}
                <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-3">
                      <h3 className="text-xl font-bold text-foreground print:text-black break-words">
                        {education.institution}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <span className="inline-flex items-center px-3 py-1.5 bg-accent print:bg-gray-100 text-accent-foreground print:text-black text-sm font-medium rounded-full whitespace-nowrap">
                          {education.degree}
                        </span>
                        <span className="text-muted-foreground print:text-gray-600 font-medium text-sm self-start sm:self-center break-words">
                          {education.area}
                        </span>
                      </div>
                      
                      {education.supervisor && (
                        <div className="text-muted-foreground print:text-gray-600 text-sm">
                          <span className="font-medium">{tLabel('supervisor')}: </span>
                          <span className="text-foreground print:text-black">{education.supervisor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground print:text-gray-600 bg-muted print:bg-gray-50 px-4 py-2 rounded-full text-sm whitespace-nowrap">
                    <CalendarRange className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium">
                      {education.startDate} - {education.endDate || tLabel('present')}
                    </span>
                  </div>
                </div>

                {education.summary && (
                  <div className="mt-3">
                    <p className="text-foreground print:text-black leading-relaxed text-sm break-words">
                      {education.summary}
                    </p>
                  </div>
                )}

                {education.highlights && education.highlights.length > 0 && (
                  <div className="mt-4">
                    <ul className="space-y-3">
                      {education.highlights.map((highlight, idx) => (
                        <li key={`${education.institution}-highlight-${idx}`} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-foreground print:bg-black rounded-full mt-2 flex-shrink-0" />
                          <span className="text-foreground print:text-black leading-relaxed text-sm break-words flex-1">
                            {highlight}
                          </span>
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
