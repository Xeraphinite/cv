'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { formatToYearMonth } from '@/lib/date-format'

interface Project {
  name: string
  description: string
  tech: string[]
  url?: string
  github?: string
  status?: string
  year?: number
}

interface ProjectsSectionProps {
  data: Project[]
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const t = useTranslations()

  const defaultProjects: Project[] = [
    {
      name: "AI Research Platform",
      description: "A comprehensive platform for managing AI research projects with data visualization and model comparison features.",
      tech: ["Python", "TensorFlow", "React", "PostgreSQL"],
      url: "https://example.com/ai-platform",
      github: "https://github.com/username/ai-platform",
      status: "Active",
      year: 2024
    },
    {
      name: "Academic Paper Analyzer",
      description: "Natural language processing tool for analyzing academic papers and extracting key insights and citations.",
      tech: ["Python", "NLP", "Flask", "MongoDB"],
      github: "https://github.com/username/paper-analyzer",
      status: "Completed",
      year: 2023
    },
    {
      name: "Research Data Visualization",
      description: "Interactive dashboard for visualizing complex research data with real-time updates and collaborative features.",
      tech: ["JavaScript", "D3.js", "Node.js", "MySQL"],
      url: "https://example.com/data-viz",
      status: "In Progress",
      year: 2024
    }
  ]

  const projects = data && data.length > 0 ? data : defaultProjects

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:light-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.selectedProjects')}
      </h2>

      <div className="space-y-1">
        {projects.map((project) => (
          <div key={project.name} className="paper-body leading-relaxed text-foreground">
            <div className="grid grid-cols-[minmax(5ch,auto)_minmax(0,1fr)] items-start gap-x-3 gap-y-1">
              <span className="font-sans text-base font-bold whitespace-nowrap text-muted-foreground">{formatToYearMonth(project.year)}</span>
              <div className="flex flex-wrap items-baseline gap-x-2 min-w-0">
                <span className="font-medium">{project.name}</span>
                {project.status ? <span className="text-muted-foreground">{project.status}</span> : null}
              </div>

              <p className="col-start-2">{project.description}</p>
              <p className="col-start-2 font-mono text-muted-foreground">{project.tech.join(', ')}</p>
              {(project.url || project.github) ? (
                <div className="col-start-2 mt-1 flex items-center gap-3">
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      title={t('actions.viewProject')}
                    >
                      <Icon icon="mingcute:arrow-right-up-fill" className="h-4 w-4" />
                      <span className="text-sm">{t('actions.viewProject')}</span>
                    </a>
                  ) : null}
                  {project.github ? (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      title={t('actions.viewSource')}
                    >
                      <Icon icon="mingcute:github-line" className="h-4 w-4" />
                      <span className="text-sm">{t('actions.viewSource')}</span>
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
