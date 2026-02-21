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
  ownerAliases?: string[]
}

export function PublicationsSection({ data, ownerName, ownerEnName, ownerAliases = [] }: PublicationsSectionProps) {
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

  const normalizeName = (value: string) => value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '')

  const buildNameVariants = (value?: string) => {
    if (!value) return []
    const trimmed = value.trim()
    if (!trimmed) return []

    const withoutParen = trimmed.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim()
    const tokens = withoutParen
      .replace(/[.*]/g, '')
      .split(/[\s,]+/)
      .map((token) => token.trim())
      .filter(Boolean)

    const variants = new Set<string>([trimmed, withoutParen])
    if (tokens.length >= 2) {
      const first = tokens[0]
      const last = tokens[tokens.length - 1]
      variants.add(`${first} ${last}`)
      variants.add(`${last} ${first}`)
      variants.add(`${last} ${first.charAt(0)}`)
      variants.add(`${first} ${last.charAt(0)}`)
    }

    return Array.from(variants).map(normalizeName).filter(Boolean)
  }

  const ownerNameVariants = new Set<string>([
    ...buildNameVariants(ownerName),
    ...buildNameVariants(ownerEnName),
    ...ownerAliases.flatMap((alias) => buildNameVariants(alias)),
  ])

  const isOwnerAuthor = (author: string) => {
    const variants = buildNameVariants(author)
    return variants.some((variant) => ownerNameVariants.has(variant))
  }

  const formatAuthors = (authors: string[]) => {
    return authors.map((author, index) => {
      const isOwner = isOwnerAuthor(author)
      
      return (
        <span key={author} className={isOwner ? "font-bold text-foreground " : "text-foreground/80 "}>
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
            <div className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(6ch,auto)_minmax(0,1fr)] items-start gap-x-3 gap-y-0.5 md:gap-y-1">
              <span className="order-2 justify-self-end whitespace-nowrap text-right font-sans text-sm font-bold text-foreground/80 md:order-1 md:justify-self-start md:text-left">
                {formatToYearMonth(publication.year)}
              </span>

              <div className="order-1 md:order-2 md:col-start-2 min-w-0 space-y-0.5">
                <h3 className="font-sans text-sm font-semibold leading-tight">
                  {publication.url ? (
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group no-underline hover:no-underline"
                    >
                      <MarkdownText content={publication.title} className="inline" inline />
                      <Icon
                        icon="mingcute:arrow-right-up-fill"
                        className="ml-1 inline h-3.5 w-3.5 align-[-0.08em] text-foreground/70 transition-transform transition-colors duration-150 group-hover:translate-x-0.5 group-hover:text-foreground"
                      />
                    </a>
                  ) : (
                    <MarkdownText content={publication.title} inline />
                  )}
                </h3>

                {publication.authors?.length ? (
                  <p className="text-sm text-foreground/80">{formatAuthors(publication.authors)}</p>
                ) : null}

                {formatPublicationMeta(publication) ? (
                  <p className="text-sm text-foreground/80 italic">{formatPublicationMeta(publication)}</p>
                ) : null}

                <div className="flex flex-wrap items-center gap-x-2 text-sm text-foreground/80">
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
