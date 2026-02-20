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
        <sup className="relative top-[0.04em] ml-0.5 align-super text-[0.72em] font-semibold">{match[2]}</sup>
      </>
    )
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:news-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.news')}
      </h2>

      <div className="space-y-1.5">
        {sortedItems.map((item, index) => (
          <div key={`${item.title}-${index}`} className="paper-body leading-relaxed text-foreground">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(6ch,auto)_minmax(0,1fr)] items-start gap-x-3 gap-y-0.5 md:gap-y-0">
              <span className="order-2 justify-self-end whitespace-nowrap text-right font-sans text-sm font-bold text-foreground/80 md:order-1 md:justify-self-start md:text-left">
                {renderYearMonthWithSup(item.date)}
              </span>
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="order-1 md:order-2 md:col-start-2 no-underline hover:no-underline"
                >
                  <MarkdownText content={item.summary || item.title || item.outlet} className="text-sm text-foreground/90" inline />
                </a>
              ) : (
                <MarkdownText content={item.summary || item.title || item.outlet} className="order-1 md:order-2 md:col-start-2 text-sm text-foreground/90" inline />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
