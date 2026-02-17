'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'

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
    <section className="paper-section print:break-inside-avoid">
      <h2 className="paper-section-title print:text-black">
        <Icon icon="mingcute:light-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.selectedProjects')}
      </h2>

      <div className="space-y-1">
        {projects.map((project) => (
          <div key={project.name} className="paper-body leading-relaxed text-foreground print:text-black">
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(5ch,auto)_minmax(9ch,auto)_minmax(0,2fr)_minmax(0,1.5fr)_auto] gap-x-4 gap-y-1 items-baseline">
              <span className="font-medium min-w-0 truncate">{project.name}</span>
              <span className="font-mono whitespace-nowrap md:text-right">{project.year ?? ''}</span>
              <span className="min-w-0 truncate">{project.status ?? ''}</span>
              <span className="min-w-0 truncate">{project.description}</span>
              <span className="font-mono min-w-0 truncate text-muted-foreground">{project.tech.join(', ')}</span>
              <span className="hidden print:hidden md:flex items-center gap-2 whitespace-nowrap">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                    title={t('actions.viewProject')}
                  >
                    <Icon icon="mingcute:external-link-line" className="h-4 w-4" />
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
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
