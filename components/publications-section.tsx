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
    type: "bg-primary/10 text-primary print:bg-gray-100 print:text-black",
    status: "bg-secondary/50 text-secondary-foreground print:bg-gray-50 print:text-black", 
    indexing: "bg-accent/50 text-accent-foreground print:bg-gray-100 print:text-black",
    impact: "bg-muted text-muted-foreground print:bg-gray-100 print:text-black"
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
        <span key={author} className={isOwner ? "font-semibold text-foreground print:text-black" : "text-muted-foreground print:text-gray-600"}>
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
    <section className="print:break-inside-avoid-page">
      <div className="flex items-center gap-3 mb-5 pb-2 border-b border-border print:border-gray-300">
        <div className="flex items-center justify-center w-8 h-8 bg-foreground print:bg-black rounded-xl">
          <BookOpen className="h-4 w-4 text-background print:text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground print:text-black">
          {t('section.publications')}
        </h2>
      </div>

      <div className="space-y-6">
        {data.map((publication, index) => (
          <div key={`${publication.title}-${index}`} className="print:break-inside-avoid">
            <div className="bg-card print:bg-white border border-border print:border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                {/* Header with title and featured badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground print:text-black leading-tight break-words">
                      {publication.url ? (
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline transition-all inline-flex items-start gap-2 group"
                        >
                          <span>{publication.title}</span>
                          <ExternalLink className="h-4 w-4 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </a>
                      ) : (
                        publication.title
                      )}
                    </h3>
                  </div>
                  
                  {publication.highlight && (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-accent print:bg-gray-100 text-accent-foreground print:text-black rounded-full whitespace-nowrap">
                      <Star className="h-3 w-3" />
                      <span className="text-xs font-medium">Featured</span>
                    </div>
                  )}
                </div>
                
                {/* Authors */}
                <div className="text-sm leading-relaxed break-words">
                  {formatAuthors(publication.authors)}
                </div>
                
                {/* Publication venue and meta information */}
                <div className="space-y-2">
                  {(publication.journal || publication.publishedIn) && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground print:text-gray-600" />
                      <div className="text-muted-foreground print:text-gray-600">
                        <span className="font-medium">Published in: </span>
                        <span className="italic break-words">{publication.journal || publication.publishedIn}</span>
                        {formatPublicationMeta(publication) && (
                          <span className="ml-2 text-xs">({formatPublicationMeta(publication)})</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {publication.doi && (
                    <div className="flex items-start gap-2 text-sm">
                      <Award className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground print:text-gray-600" />
                      <div className="text-muted-foreground print:text-gray-600">
                        <span className="font-medium">DOI: </span>
                        <a
                          href={`https://doi.org/${publication.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline transition-colors break-all"
                        >
                          {publication.doi}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Badges for type, status, indexing, and impact factor */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyle('type')}`}>
                    {publication.type}
                  </span>
                  
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyle('status')}`}>
                    {publication.status}
                  </span>
                  
                  {publication.indexing?.map((idx) => (
                    <span key={idx} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyle('indexing')}`}>
                      <Award className="h-3 w-3" />
                      {idx}
                    </span>
                  ))}
                  
                  {publication.impactFactor && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeStyle('impact')}`}>
                      IF: {publication.impactFactor}
                    </span>
                  )}
                </div>

                {/* Abstract */}
                {publication.abstract && (
                  <div className="mt-4 p-4 bg-muted print:bg-gray-50 rounded-2xl border-l-4 border-border print:border-gray-300">
                    <h4 className="text-xs font-medium text-muted-foreground print:text-gray-600 uppercase tracking-wide mb-2">Abstract</h4>
                    <p className="text-sm text-foreground print:text-black leading-relaxed break-words">{publication.abstract}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
