'use client'

import { Award, Calendar, MapPin } from "lucide-react"
import { useTranslations } from 'next-intl'

interface AwardItem {
  name: string
  institute: string
  date: string
  description?: string
}

interface AwardsSectionProps {
  data: AwardItem[]
}

export function AwardsSection({ data }: AwardsSectionProps) {
  const t = useTranslations()
  
  if (!data || data.length === 0) return null

  return (
    <section className="paper-section print:break-inside-avoid-page">
      <h2 className="paper-section-title print:text-black">
        <Award className="h-5 w-5 mr-3 inline-block text-primary" />
        {t('sections.awards')}
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {data.map((award, index) => (
          <div key={`${award.name}-${award.institute}-${index}`} className="paper-card h-full print:break-inside-avoid hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                <Award className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <h3 className="paper-subtitle !text-base font-semibold text-foreground print:text-black break-words">{award.name}</h3>
                
                <div className="flex items-center gap-3 paper-meta">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">{award.institute}</span>
                </div>
                
                <div className="flex items-center gap-3 paper-meta">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium">{award.date}</span>
                </div>
                
                {award.description && (
                  <p className="paper-body !text-sm !mt-3 pt-3 border-t border-border/60 break-words">{award.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
