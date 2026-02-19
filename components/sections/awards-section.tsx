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
      <h2 className="paper-section-title !mb-1.5 sm:!mb-2 !pb-0.5 sm:!pb-1">
        <Icon icon="mingcute:medal-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.awards')}
      </h2>

      <div className="paper-card">
        <div className="flex flex-col gap-2">
          {data.map((award, index) => (
            <div
              key={`${award.name}-${award.institute}-${index}`}
              className="grid grid-cols-1 items-start gap-x-4 gap-y-1 leading-relaxed text-foreground md:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <span className="font-sans text-sm font-bold whitespace-nowrap text-muted-foreground md:text-right">
                {formatToYearMonth(award.date)}
              </span>
              <div className="min-w-0">
                <p className="paper-body">
                  <span className="font-medium">{award.name}</span>
                  <span className="text-muted-foreground"> · {award.institute}</span>
                </p>
                {award.description ? (
                  <p className="paper-body mt-1 text-sm text-muted-foreground">
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
