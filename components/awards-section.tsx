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
    <section className="print:break-inside-avoid-page">
      <div className="flex items-center gap-3 mb-5 pb-2 border-b border-border print:border-gray-300">
        <div className="flex items-center justify-center w-8 h-8 bg-foreground print:bg-black rounded-xl">
          <Award className="h-4 w-4 text-background print:text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground print:text-black">
          {t('section.awards')}
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
        {data.map((award, index) => (
          <div key={`${award.name}-${award.institute}-${index}`} className="print:break-inside-avoid">
            <div className="bg-card print:bg-white border border-border print:border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 h-full">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-muted print:bg-gray-100 rounded-2xl flex-shrink-0">
                  <Award className="h-6 w-6 text-foreground print:text-black" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground print:text-black mb-3 break-words">{award.name}</h3>
                  
                  <div className="flex items-center gap-2 text-muted-foreground print:text-gray-600 mb-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium break-words">{award.institute}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground print:text-gray-600 mb-3">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{award.date}</span>
                  </div>
                  
                  {award.description && (
                    <div className="p-3 bg-muted print:bg-gray-50 rounded-xl border-l-4 border-border print:border-gray-300">
                      <p className="text-sm text-foreground print:text-black leading-relaxed break-words">{award.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
