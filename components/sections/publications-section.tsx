'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { MarkdownText } from '@/components/ui/markdown-text'
import { formatToYearMonth } from '@/lib/date-format'

// Improved type definitions
interface Publication {
  title: string
  authors: string[]
  year?: string
  type: string
  status: string
  highlight?: boolean
  involved?: boolean
  journal?: string
  publishedIn?: string
  doi?: string
  url?: string
  indexing?: string[]
  impactFactor?: number
  abstract?: string
  pages?: string
  volume?: string
  issue?: string
}

interface PublicationsSectionProps {
  data: Publication[]
  ownerName?: string
  ownerEnName?: string
}

export function PublicationsSection({ data, ownerName, ownerEnName }: PublicationsSectionProps) {
  const t = useTranslations()
  
  if (!data || data.length === 0) return null

  const parsePublicationYear = (value?: string): number => {
    if (!value) return Number.NEGATIVE_INFINITY
    const year = Number.parseInt(value, 10)
    return Number.isFinite(year) ? year : Number.NEGATIVE_INFINITY
  }

  const sortedItems = [...data]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const rankDiff = parsePublicationYear(b.item.year) - parsePublicationYear(a.item.year)
      if (rankDiff !== 0) return rankDiff
      return a.index - b.index
    })
    .map(({ item }) => item)

  const formatAuthors = (authors: string[]) => {
    return authors.map((author, index) => {
      // Check if this author is the owner (either Chinese or English name)
      const isOwner = author === ownerName || author === ownerEnName || 
                     (ownerName && author.includes?.(ownerName)) || (ownerEnName && author.includes?.(ownerEnName))
      
      return (
        <span key={author} className={isOwner ? "font-bold text-foreground " : "text-muted-foreground "}>
          {author}
          {index < authors.length - 1 && ", "}
        </span>
      )
    })
  }

  const formatPublicationMeta = (publication: Publication) => {
    const parts: string[] = []
    if (publication.journal || publication.publishedIn) parts.push(publication.journal || publication.publishedIn || '')
    if (publication.volume) parts.push(`Vol. ${publication.volume}`)
    if (publication.issue) parts.push(`No. ${publication.issue}`)
    if (publication.pages) parts.push(`pp. ${publication.pages}`)
    return parts.filter(Boolean).join(' · ')
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:book-6-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.publications')}
      </h2>

      <div className="space-y-1.5">
        {sortedItems.map((publication, index) => (
          <div key={`${publication.title}-${index}`} className="paper-body leading-relaxed text-foreground">
            <div className="grid grid-cols-[minmax(6ch,auto)_minmax(0,1fr)] items-start gap-x-3 gap-y-1">
              <span className="font-sans text-sm font-bold whitespace-nowrap text-muted-foreground">
                {formatToYearMonth(publication.year)}
              </span>

              <div className="col-start-2 min-w-0">
                <h3 className="font-sans text-sm font-semibold leading-tight">
                  {publication.url ? (
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 no-underline hover:no-underline"
                    >
                      <MarkdownText content={publication.title} inline />
                      <Icon icon="mingcute:arrow-right-up-fill" className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                    </a>
                  ) : (
                    <MarkdownText content={publication.title} inline />
                  )}
                </h3>

                {publication.authors?.length ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">{formatAuthors(publication.authors)}</p>
                ) : null}

                {formatPublicationMeta(publication) ? (
                  <p className="mt-0.5 text-sm text-muted-foreground italic">{formatPublicationMeta(publication)}</p>
                ) : null}

                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                  <span>{publication.type}</span>
                  <span>·</span>
                  <span>{publication.status}</span>
                  {publication.impactFactor ? (
                    <>
                      <span>·</span>
                      <span className="font-mono">IF {publication.impactFactor}</span>
                    </>
                  ) : null}
                  {publication.doi ? (
                    <>
                      <span>·</span>
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono no-underline hover:no-underline"
                      >
                        DOI
                      </a>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
