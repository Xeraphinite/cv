'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { MarkdownText } from '@/components/ui/markdown-text'
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

  const renderYearMonthWithSup = (value: string) => {
    const formatted = formatToYearMonth(value)
    const match = formatted.match(/^(\d{4})(\d{2})$/)
    if (!match) return <>{formatted}</>
    return (
      <>
        <span>{match[1]}</span>
        <sup className="relative top-[0.04em] ml-0.5 align-super font-semibold text-[0.72em]">{match[2]}</sup>
      </>
    )
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:news-fill" className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary" />
        {t('sections.news')}
      </h2>

      <div className="space-y-1.5">
        {sortedItems.map((item, index) => (
          <div key={`${item.title}-${index}`} className="paper-body text-foreground leading-relaxed">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-0.5 md:grid-cols-[minmax(6ch,auto)_minmax(0,1fr)] md:gap-y-0">
              <span className="order-2 justify-self-end whitespace-nowrap text-right font-bold font-sans text-foreground/80 text-sm md:order-1 md:justify-self-start md:text-left">
                {renderYearMonthWithSup(item.date)}
              </span>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="order-1 no-underline hover:no-underline md:order-2 md:col-start-2"
                >
                  <MarkdownText content={item.summary || item.title || item.outlet} className="text-foreground/90 text-sm" inline />
                </a>
              ) : (
                <MarkdownText content={item.summary || item.title || item.outlet} className="order-1 text-foreground/90 text-sm md:order-2 md:col-start-2" inline />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
