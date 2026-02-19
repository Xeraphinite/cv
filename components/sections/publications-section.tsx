'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { MarkdownText } from '@/components/ui/markdown-text'
import { formatToYearMonth } from '@/lib/date-format'

// Improved type definitions
interface Publication {
  title: string
  authors: string[]
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
  year?: string
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
    const parts = []
    if (publication.year) parts.push(formatToYearMonth(publication.year))
    if (publication.volume) parts.push(`Vol. ${publication.volume}`)
    if (publication.issue) parts.push(`No. ${publication.issue}`)
    if (publication.pages) parts.push(`pp. ${publication.pages}`)
    return parts.join(', ')
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:book-6-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.publications')}
      </h2>

      <div className="space-y-6">
        {data.map((publication, index) => (
          <div key={`${publication.title}-${index}`} className="paper-card transition-shadow duration-300">
            <div className="space-y-3">
              {/* Header with title and featured badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="paper-subtitle font-semibold text-foreground leading-tight break-words">
                    {publication.url ? (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:no-underline transition-all inline-flex items-start gap-2 group"
                      >
                        <MarkdownText content={publication.title} inline />
                        <Icon icon="mingcute:arrow-right-up-fill" className="h-4 w-4 mt-1 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    ) : (
                      <MarkdownText content={publication.title} inline />
                    )}
                  </h3>
                </div>
                
                {publication.highlight && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap">
                    <Icon icon="mingcute:star-fill" className="h-4 w-4" />
                    <span className="text-sm font-medium">Featured</span>
                  </div>
                )}
              </div>
              
              {/* Authors */}
              <div className="paper-body leading-relaxed break-words">
                {formatAuthors(publication.authors)}
              </div>
              
              {/* Publication venue and meta information */}
              <div className="space-y-2 !mt-4">
                {(publication.journal || publication.publishedIn) && (
                  <div className="flex items-start gap-3 paper-meta">
                    <Icon icon="mingcute:file-line" className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div className="break-words">
                      <span className="italic">{publication.journal || publication.publishedIn}</span>
                      {formatPublicationMeta(publication) && (
                        <span className="ml-2">({formatPublicationMeta(publication)})</span>
                      )}
                    </div>
                  </div>
                )}
                
                {publication.doi && (
                  <div className="flex items-start gap-3 paper-meta">
                    <Icon icon="mingcute:award-line" className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div className="break-all">
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline hover:no-underline transition-colors font-medium font-mono"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Badges for type, status, indexing, and impact factor */}
              <div className="flex flex-wrap items-center gap-2 !mt-4">
                <span className="paper-badge !bg-primary/10 !text-primary text-xs">
                  {publication.type}
                </span>
                
                <span className="paper-badge !bg-blue-500/10 !text-blue-600 text-xs">
                  {publication.status}
                </span>
                
                {publication.indexing?.map((idx) => (
                  <span key={idx} className="paper-badge !bg-green-500/10 !text-green-600 text-xs">
                    {idx}
                  </span>
                ))}
                
                {publication.impactFactor && (
                  <span className="paper-badge !bg-amber-500/10 !text-amber-600 text-xs font-mono">
                    IF: {publication.impactFactor}
                  </span>
                )}
              </div>

              {/* Abstract */}
              {publication.abstract && (
                <div className="!mt-4 pt-3">
                  <MarkdownText content={publication.abstract} className="paper-body text-sm break-words" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
