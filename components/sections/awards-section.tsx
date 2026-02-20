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

      <div className="paper-card">
        <div className="flex flex-col gap-2 sm:gap-2">
          {data.map((award, index) => (
            <div
              key={`${award.name}-${award.institute}-${index}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-1 sm:gap-x-3 gap-y-1 leading-relaxed text-foreground md:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <span className="order-2 justify-self-end whitespace-nowrap text-right font-sans text-sm font-bold text-foreground/80 md:order-1 md:justify-self-start md:text-right">
                {formatToYearMonth(award.date)}
              </span>
              <div className="order-1 md:order-2 min-w-0 space-y-1">
                <p className="paper-body">
                  <span className="font-medium">{award.name}</span>
                  <span className="text-muted-foreground"> · {award.institute}</span>
                </p>
                {award.description ? (
                  <p className="paper-body text-sm text-muted-foreground">
                    <MarkdownText content={award.description} inline />
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
