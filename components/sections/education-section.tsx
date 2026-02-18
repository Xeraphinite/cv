'use client'

import { Icon } from '@iconify/react'
import { useSectionTranslations, useLabelTranslations } from '@/hooks/use-translations'
import { formatToYearMonth } from '@/lib/date-format'

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

  const renderYearMonthWithSup = (value: string) => {
    const formatted = formatToYearMonth(value)
    const match = formatted.match(/^(\d{4})\.?(\d{2})$/)
    if (!match) return <>{formatted}</>
    return (
      <>
        <span>{match[1]}</span>
        <sup className="relative top-[0.04em] ml-0.5 align-super text-[0.7em] font-semibold">{match[2]}</sup>
      </>
    )
  }
  
  if (!data || data.length === 0) return null

  const splitExpectedLabel = (value: string): { main: string; expected?: string } => {
    const trimmed = value.trim()
    const match = trimmed.match(/^(.*)\s+\((Expected)\)$/i)
    if (!match) return { main: trimmed }
    return { main: match[1].trim(), expected: `(${match[2]})` }
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:mortarboard-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {tSection('education')}
      </h2>

      <div className="space-y-6">
        {data.map((education, index) => {
          const endDateParts = splitExpectedLabel(education.endDate)
          return (
            <div key={`${education.institution}-${education.degree}-${index}`} className="paper-card transition-all duration-300">
              <div className="grid grid-cols-[minmax(12ch,auto)_minmax(0,1fr)] items-start gap-x-4 gap-y-2">
                <p className="paper-meta font-sans !text-base !font-bold leading-tight text-muted-foreground">
                  <span className="block whitespace-nowrap">
                    {renderYearMonthWithSup(education.startDate)} - {renderYearMonthWithSup(endDateParts.main)}
                  </span>
                  {endDateParts.expected ? (
                    <span className="block whitespace-nowrap">{endDateParts.expected}</span>
                  ) : null}
                </p>
                <div className="min-w-0 space-y-3">
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
                    {education.supervisor && (
                      <div className="flex items-center gap-2">
                        <Icon icon="mingcute:user-3-line" className="h-4 w-4" />
                        <span>{tLabel('supervisor')}: {education.supervisor}</span>
                      </div>
                    )}
                  </div>
                </div>
                {education.highlights && education.highlights.length > 0 && (
                  <div className="col-start-2 mt-2">
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
            </div>
          )
        })}
      </div>
    </section>
  )
}
