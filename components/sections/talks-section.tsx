import { Icon } from '@iconify/react'

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
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <section className="paper-section print:break-inside-avoid">
      <h2 className="paper-section-title print:text-black">
        <Icon icon="mingcute:mic-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        Talks & Presentations
      </h2>

      <div className="space-y-6">
        {talks.map((talk, index) => (
          <div key={`${talk.title}-${index}`} className="paper-card print:bg-white print:break-inside-avoid transition-shadow duration-300">
            <div className="space-y-2.5">
              {/* Talk Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="paper-subtitle font-semibold text-foreground print:text-black leading-tight">
                    {talk.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="paper-badge !bg-primary/10 !text-primary text-xs">
                      {talk.type ?? 'Talk'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 print:hidden">
                  {talk.url && (
                    <a
                      href={talk.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="View Event"
                    >
                      <Icon icon="mingcute:external-link-line" className="h-4 w-4" />
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
                      <Icon icon="mingcute:external-link-line" className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Event Information */}
              <div className="space-y-2 !mt-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground print:text-gray-600">
                  <div className="font-medium text-foreground print:text-black">
                    {talk.event}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 paper-meta">
                  <div className="flex items-center gap-2">
                    <Icon icon="mingcute:calendar-line" className="h-4 w-4" />
                    <span>{formatDate(talk.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="mingcute:map-pin-line" className="h-4 w-4" />
                    <span>{talk.location ?? 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Talk Description */}
              {talk.description && (
                <p className="paper-body text-sm mt-3 pt-3">
                  {talk.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 
