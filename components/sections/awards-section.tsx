'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { MarkdownText } from '@/components/ui/markdown-text'
import { formatToYearMonth } from '@/lib/date-format'

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
            <div className="grid grid-cols-[minmax(7ch,auto)_minmax(0,1fr)] items-start gap-x-3">
              <span className="font-sans text-base font-bold whitespace-nowrap text-muted-foreground">{formatToYearMonth(award.date)}</span>
              <span className="min-w-0">
                <span className="font-medium">{award.name}</span>
                <span className="text-muted-foreground"> · {award.institute}</span>
                {award.description ? (
                  <span className="text-muted-foreground">
                    {' '}
                    — <MarkdownText content={award.description} inline />
                  </span>
                ) : null}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
