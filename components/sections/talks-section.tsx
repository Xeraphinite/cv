import { Icon } from '@iconify/react'
import { MarkdownText } from '@/components/ui/markdown-text'
import { formatToYearMonth } from '@/lib/date-format'

interface Talk {
  title: string
  event: string
  location?: string
  date: string
  type?: string
  description?: string
  url?: string
  slides?: string
}

interface TalksSectionProps {
  data: Talk[]
}

export function TalksSection({ data }: TalksSectionProps) {
  // Default placeholder talks if none provided
  const defaultTalks = [
    {
      title: "Advances in Machine Learning for Academic Research",
      event: "International Conference on AI Research",
      location: "Virtual Conference",
      date: "2024-03-15",
      type: "Keynote",
      description: "Presented recent developments in machine learning applications for academic research, focusing on automated literature review and research trend analysis.",
      url: "https://example.com/conference-2024",
      slides: "https://example.com/slides/ml-research-2024.pdf"
    },
    {
      title: "Data-Driven Approaches to Research Methodology",
      event: "Graduate Research Symposium",
      location: "University Campus",
      date: "2023-11-20",
      type: "Invited Talk",
      description: "Discussed the integration of big data analytics in traditional research methodologies and its impact on research outcomes.",
      slides: "https://example.com/slides/data-driven-research-2023.pdf"
    },
    {
      title: "Future Trends in Academic Publishing",
      event: "Academic Publishing Workshop",
      location: "Online Webinar",
      date: "2023-09-10",
      type: "Panel Discussion",
      description: "Participated in a panel discussion about the future of academic publishing, focusing on open access and digital transformation.",
      url: "https://example.com/webinar-2023"
    }
  ]

  const talks = data && data.length > 0 ? data : defaultTalks

  if (!talks || talks.length === 0) return null

  const formatDate = (dateString: string) => {
    return formatToYearMonth(dateString)
  }

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:mic-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        Talks & Presentations
      </h2>

      <div className="space-y-6">
        {talks.map((talk, index) => (
          <div key={`${talk.title}-${index}`} className="paper-card transition-shadow duration-300">
            <div className="space-y-2.5">
              {/* Talk Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="paper-subtitle font-semibold text-foreground leading-tight">
                    <MarkdownText content={talk.title} inline />
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="paper-badge !bg-primary/10 !text-primary text-xs">
                      {talk.type ?? 'Talk'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {talk.url && (
                    <a
                      href={talk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="View Event"
                    >
                      <Icon icon="mingcute:arrow-right-up-fill" className="h-4 w-4" />
                    </a>
                  )}
                  {talk.slides && (
                    <a
                      href={talk.slides}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="View Slides"
                    >
                      <Icon icon="mingcute:arrow-right-up-fill" className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-2 !mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="font-medium text-foreground">
                    {talk.event}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 paper-meta">
                  <div className="flex items-center gap-2">
                    <Icon icon="mingcute:calendar-line" className="h-4 w-4" />
                    <span className="font-sans text-base font-bold text-muted-foreground">{formatDate(talk.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="mingcute:map-pin-line" className="h-4 w-4" />
                    <span>{talk.location ?? 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Talk Description */}
              {talk.description && (
                <MarkdownText content={talk.description} className="paper-body text-sm mt-3 pt-3" />
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 
