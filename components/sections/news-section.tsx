'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { formatToYearMonth } from '@/lib/date-format'

interface NewsItem {
  title: string
  outlet: string
  date: string
  summary?: string
  url?: string
}

interface NewsSectionProps {
  data: NewsItem[]
}

export function NewsSection({ data }: NewsSectionProps) {
  const t = useTranslations()

  if (!data || data.length === 0) return null

  const parseNewsDate = (value: string): number => {
    const match = value.trim().match(/^(\d{4})(?:[.\-/](\d{1,2}))?/)
    if (!match) return Number.NEGATIVE_INFINITY
    const year = Number.parseInt(match[1], 10)
    const month = match[2] ? Number.parseInt(match[2], 10) : 0
    return year * 100 + month
  }

  const sortedItems = [...data]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const rankDiff = parseNewsDate(b.item.date) - parseNewsDate(a.item.date)
      if (rankDiff !== 0) return rankDiff
      return a.index - b.index
    })
    .map(({ item }) => item)

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:news-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.news')}
      </h2>

      <div className="space-y-2">
        {sortedItems.map((item, index) => (
          <div key={`${item.title}-${index}`} className="paper-body leading-relaxed text-foreground">
            <div className="grid grid-cols-[minmax(6ch,auto)_minmax(0,1fr)] items-start gap-x-3">
              <span className="font-sans text-base font-bold whitespace-nowrap text-muted-foreground">{formatToYearMonth(item.date)}</span>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:no-underline">
                  {item.summary || item.title || item.outlet}
                </a>
              ) : (
                <span>{item.summary || item.title || item.outlet}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
