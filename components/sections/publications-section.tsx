'use client'

import { BookOpen, ExternalLink, Star, Award, FileText, Calendar } from "lucide-react"
import { useTranslations } from 'next-intl'

// Improved type definitions
type PublicationStatus = 'Published' | 'Under Review' | 'In Press' | 'Ongoing' | 'Under Review, R2' | '査読中' | '進行中' | '実質審査'

type PublicationType = 'Journal Article' | 'Conference Paper' | 'Preprint' | 'Patent' | 'Workshop Paper' | 'Book Chapter' | '学术论文' | 'プレプリント' | '特許'

type IndexingType = 'SCI TOP' | 'SCI I' | 'SCI II' | 'SCI III' | 'SCI' | 'JCR-Q1' | 'JCR-Q2' | 'JCR-Q3' | 'JCR-Q4' | 'JCR' | 'CCF-A' | 'CCF-B' | 'CCF-C' | 'EI' | 'ESCI'

interface Publication {
  title: string
  authors: string[]
  type: PublicationType
  status: PublicationStatus
  highlight?: boolean
  involved?: boolean
  journal?: string
  publishedIn?: string
  doi?: string
  url?: string
  indexing?: IndexingType[]
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

// Helper function for badge styling
const getBadgeStyle = (type: 'type' | 'status' | 'indexing' | 'impact') => {
  const styles = {
    type: "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-900 border border-rose-100 print:bg-gray-100 print:text-black print:border-gray-300",
    status: "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-900 border border-blue-100 print:bg-gray-50 print:text-black print:border-gray-300", 
    indexing: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-900 border border-emerald-100 print:bg-gray-100 print:text-black print:border-gray-300",
    impact: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 border border-amber-100 print:bg-gray-100 print:text-black print:border-gray-300"
  }
  return styles[type]
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
        <span key={author} className={isOwner ? "font-bold text-foreground print:text-black" : "text-muted-foreground print:text-gray-600"}>
          {author}
          {index < authors.length - 1 && ", "}
        </span>
      )
    })
  }

  const formatPublicationMeta = (publication: Publication) => {
    const parts = []
    if (publication.year) parts.push(publication.year)
    if (publication.volume) parts.push(`Vol. ${publication.volume}`)
    if (publication.issue) parts.push(`No. ${publication.issue}`)
    if (publication.pages) parts.push(`pp. ${publication.pages}`)
    return parts.join(', ')
  }

  return (
    <section className="paper-section print:break-inside-avoid-page">
      <h2 className="paper-section-title print:text-black">
        <BookOpen className="h-5 w-5 mr-3 inline-block text-primary" />
        {t('sections.publications')}
      </h2>

      <div className="space-y-8">
        {data.map((publication, index) => (
          <div key={`${publication.title}-${index}`} className="paper-card print:bg-white print:border-gray-300 print:break-inside-avoid hover:shadow-lg transition-shadow duration-300">
            <div className="space-y-4">
              {/* Header with title and featured badge */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="paper-subtitle !text-lg font-semibold text-foreground print:text-black leading-tight break-words">
                    {publication.url ? (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline transition-all inline-flex items-start gap-2 group"
                      >
                        <span>{publication.title}</span>
                        <ExternalLink className="h-4 w-4 mt-1 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </a>
                    ) : (
                      publication.title
                    )}
                  </h3>
                </div>
                
                {publication.highlight && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary print:bg-gray-100 print:text-black rounded-full whitespace-nowrap">
                    <Star className="h-4 w-4" />
                    <span className="text-sm font-medium">Featured</span>
                  </div>
                )}
              </div>
              
              {/* Authors */}
              <div className="paper-body leading-relaxed break-words">
                {formatAuthors(publication.authors)}
              </div>
              
              {/* Publication venue and meta information */}
              <div className="space-y-2 !mt-5">
                {(publication.journal || publication.publishedIn) && (
                  <div className="flex items-start gap-3 paper-meta">
                    <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
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
                    <Award className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div className="break-all">
                      <a
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline transition-colors font-medium"
                      >
                        {publication.doi}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Badges for type, status, indexing, and impact factor */}
              <div className="flex flex-wrap items-center gap-2 !mt-5">
                <span className="paper-badge !bg-primary/10 !text-primary !text-xs">
                  {publication.type}
                </span>
                
                <span className="paper-badge !bg-blue-500/10 !text-blue-600 !text-xs">
                  {publication.status}
                </span>
                
                {publication.indexing?.map((idx) => (
                  <span key={idx} className="paper-badge !bg-green-500/10 !text-green-600 !text-xs">
                    {idx}
                  </span>
                ))}
                
                {publication.impactFactor && (
                  <span className="paper-badge !bg-amber-500/10 !text-amber-600 !text-xs">
                    IF: {publication.impactFactor}
                  </span>
                )}
              </div>

              {/* Abstract */}
              {publication.abstract && (
                <div className="!mt-5 pt-4 border-t border-border/60">
                  <p className="paper-body !text-sm break-words">{publication.abstract}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
