'use client'

import { Icon } from '@iconify/react'
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
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:medal-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.awards')}
      </h2>

      <div className="space-y-2">
        {data.map((award, index) => (
          <div
            key={`${award.name}-${award.institute}-${index}`}
            className="paper-body leading-relaxed text-foreground"
          >
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)_minmax(6ch,auto)_minmax(0,1.8fr)] gap-x-4 gap-y-1 items-baseline">
              <span className="font-medium min-w-0 truncate">{award.name}</span>
              <span className="min-w-0 truncate">{award.institute}</span>
              <span className="font-mono whitespace-nowrap md:text-right">{award.date}</span>
              <span className="min-w-0 truncate text-muted-foreground">{award.description ?? ''}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
