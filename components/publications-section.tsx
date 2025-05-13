import type React from "react"
import { BookOpen } from "lucide-react"

interface Publication {
  title: string
  authors: string[]
  type: string
  status: string
  highlight: boolean
  tags?: string[]
  publishedIn: string  // Renamed from 'journal' to 'publishedIn' to be more generic
  impactFactor?: number
  indexing?: string[]
  abstract?: string
  doi?: string
  url?: string
}

interface PublicationsSectionProps {
  data: Publication[]
  ownerName: string
  ownerEnName?: string
}

// Badge component to reduce repetition
const Badge = ({ 
  text, 
  colorSet = { bg: "bg-gray-50", text: "text-gray-700" } 
}: { 
  text: string | number; 
  colorSet?: { bg: string; text: string } 
}) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${colorSet.bg} ${colorSet.text}`}>
    {text}
  </span>
)

export function PublicationsSection({ data, ownerName, ownerEnName }: PublicationsSectionProps) {
  if (!data?.length) return null

  // Function to highlight the owner's name in the author list
  const formatAuthors = (authors: string[]) => {
    return authors.map((author, i) => {
      const isOwner = author.includes(ownerName) || (ownerEnName && author.includes(ownerEnName))
      const authorElement = isOwner ? <strong key={author}>{author}</strong> : author
      return (
        <span key={author} className="text-gray-700">
          {i > 0 && <span>, </span>} {authorElement}
        </span>
      )
    })
  }

  // Consolidated badge color mapping system
  const badgeColors: Record<string, { bg: string; text: string }> = {
    // Publication types
    "Conference Paper": { bg: "bg-blue-50", text: "text-blue-700" },
    "Journal Article": { bg: "bg-green-50", text: "text-green-700" },
    "Patent": { bg: "bg-purple-50", text: "text-purple-700" },
    "Workshop Paper": { bg: "bg-orange-50", text: "text-orange-700" },
    "Book Chapter": { bg: "bg-indigo-50", text: "text-indigo-700" },
    "Preprint": { bg: "bg-gray-50", text: "text-gray-700" },
    
    // SCI categories
    "SCI TOP": { bg: "bg-red-50", text: "text-red-700" },
    "SCI I": { bg: "bg-red-50", text: "text-red-700" },
    "SCI II": { bg: "bg-orange-50", text: "text-orange-700" },
    "SCI III": { bg: "bg-yellow-50", text: "text-yellow-700" },
    "SCI": { bg: "bg-amber-50", text: "text-amber-700" },

    // JCR quartiles
    "JCR-Q1": { bg: "bg-red-50", text: "text-red-700" },
    "JCR-Q2": { bg: "bg-orange-50", text: "text-orange-700" },
    "JCR-Q3": { bg: "bg-yellow-50", text: "text-yellow-700" },
    "JCR-Q4": { bg: "bg-lime-50", text: "text-lime-700" },
    "JCR": { bg: "bg-green-50", text: "text-green-700" },

    // CCF categories
    "CCF-A": { bg: "bg-purple-50", text: "text-purple-700" },
    "CCF-B": { bg: "bg-indigo-50", text: "text-indigo-700" },
    "CCF-C": { bg: "bg-blue-50", text: "text-blue-700" },

    // Other indexing
    "EI": { bg: "bg-green-50", text: "text-green-700" },
    "ESCI": { bg: "bg-teal-50", text: "text-teal-700" },
    
    // Special types
    "highlight": { bg: "bg-yellow-50", text: "text-yellow-700" },
  }

  // Function to get impact factor badge with appropriate coloring
  const getIFBadge = (impactFactor?: number) => {
    if (!impactFactor) return null
    
    const colorSet = impactFactor >= 10 ? { bg: "bg-red-50", text: "text-red-700" } :
                     impactFactor >= 5 ? { bg: "bg-orange-50", text: "text-orange-700" } :
                     impactFactor >= 3 ? { bg: "bg-yellow-50", text: "text-yellow-700" } :
                                        { bg: "bg-gray-50", text: "text-gray-700" }
    
    return <Badge text={`IF: ${impactFactor.toFixed(1)}`} colorSet={colorSet} />
  }

  return (
    <section className="print:break-inside-avoid-page">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        学术成果
      </h2>

      <div className="space-y-4">
        {data.map((pub) => (
          <div key={`${pub.title}-${pub.publishedIn}`} className="print:break-inside-avoid space-y-1">
            {/* Line 1: Type badge, Title, Highlight badge, Indexing */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                text={pub.type} 
                colorSet={badgeColors[pub.type]} 
              />
              
              <h3 className="font-semibold text-gray-900 inline">{pub.title}</h3>
              
              {pub.highlight && (
                <Badge text="Highlight" colorSet={badgeColors.highlight} />
              )}

              {Array.isArray(pub.indexing) && pub.indexing.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {pub.indexing.map((idx) => (
                    <Badge key={`${pub.title}-${idx}`} text={idx} colorSet={badgeColors[idx]} />
                  ))}
                  {getIFBadge(pub.impactFactor)}
                </div>
              )}
            </div>

            {/* Line 2: Authors, Journal, Status */}
            <div className="text-sm text-gray-700 flex flex-wrap items-center">
              {formatAuthors(pub.authors)}
              {pub.publishedIn && (
                <><span className="mx-1">•</span><span className="italic">{pub.publishedIn}</span></>
              )}
              <span className="mx-1">•</span>
              <span className="font-medium">{pub.status}</span>
            </div>

            {/* Abstract (if available) */}
            {pub.abstract && (
              <p className="text-sm text-gray-600 mt-1 py-1">{pub.abstract}</p>
            )}

            {/* Line 3: DOI, URL */}
            {(pub.doi || pub.url) && (
              <div className="flex gap-3">
                {pub.doi && (
                  <a
                    href={`https://doi.org/${pub.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    DOI: {pub.doi}
                  </a>
                )}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Publication
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
