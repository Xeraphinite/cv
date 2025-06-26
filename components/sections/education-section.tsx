'use client'

import { GraduationCap, Calendar, User } from "lucide-react"
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
    <section className="paper-section print:break-inside-avoid">
      <h2 className="paper-section-title print:text-black">
        <GraduationCap className="h-5 w-5 mr-3 inline-block text-primary" />
        {tSection('education')}
      </h2>

      <div className="space-y-8">
        {data.map((education, index) => (
          <div key={`${education.institution}-${education.degree}-${index}`} className="paper-card print:bg-white print:border-gray-300 transition-all duration-300 hover:shadow-lg hover:border-primary/20">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-4">
                {/* Institution and Degree */}
                <div>
                  <h3 className="paper-subtitle print:text-black mb-1">
                    {education.institution}
                  </h3>
                  <p className="paper-body font-medium">
                    {education.degree} {tLabel('in')} {education.area}
                  </p>
                </div>

                {/* Duration and Supervisor */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 paper-meta print:text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(education.startDate)} - {formatDate(education.endDate)}</span>
                  </div>
                  
                  {education.supervisor && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{tLabel('supervisor')}: {education.supervisor}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Highlights */}
            {education.highlights && education.highlights.length > 0 && (
              <div className="mt-6">
                <ul className="space-y-2">
                  {education.highlights.map((highlight, i) => (
                    <li key={`${education.institution}-highlight-${i}`} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full mt-2 shrink-0" />
                      <span className="paper-body print:text-gray-700">{highlight}</span>
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
