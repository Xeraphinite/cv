'use client'

import { Zap, Code, Lightbulb, MessageSquare, Wrench, ExternalLink, Github } from "lucide-react"
import { useTranslations } from 'next-intl'

interface Skill {
  name: string
  category: string
  description: string
}

interface Skills {
  categories: string[]
  skills: Skill[]
}

interface SkillsSectionProps {
  data: {
    skills?: {
      [category: string]: string[]
    }
    projects?: Array<{
      name: string
      description: string
      tech: string[]
      url?: string
      github?: string
      status?: string
      year?: number
    }>
  }
}

export function SkillsSection({ data }: SkillsSectionProps) {
  const t = useTranslations()
  
  if (!data || !data.skills || Object.keys(data.skills).length === 0) return null

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Programming': Code,
      'Research': Lightbulb,
      'Communication': MessageSquare,
      'プログラミング': Code,
      '研究': Lightbulb,
      'コミュニケーション': MessageSquare
    }
    return icons[category as keyof typeof icons] || Code
  }

  const getCategoryGradient = (category: string) => {
    const gradients = {
      'Programming': 'from-purple-500 to-pink-600',
      'Research': 'from-amber-500 to-orange-600',
      'Communication': 'from-green-500 to-emerald-600',
      'プログラミング': 'from-purple-500 to-pink-600',
      '研究': 'from-amber-500 to-orange-600',
      'コミュニケーション': 'from-green-500 to-emerald-600'
    }
    return gradients[category as keyof typeof gradients] || 'from-gray-500 to-gray-600'
  }

  // Default placeholder projects if none provided
  const defaultProjects = [
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

  const projects = data.projects && data.projects.length > 0 ? data.projects : defaultProjects

  return (
    <section className="paper-section print:break-inside-avoid">
      <h2 className="paper-section-title print:text-black">
        <Zap className="h-5 w-5 mr-3 inline-block text-primary" />
        {t('sections.skills')}
      </h2>

      <div className="space-y-8">
        {/* Skills Section */}
        {data.skills && Object.keys(data.skills).length > 0 && (
          <div className="paper-card">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              {Object.entries(data.skills).map(([category, skills]) => (
                <div key={category} className="space-y-3">
                  <h4 className="flex items-center text-md font-semibold text-foreground print:text-black">
                    <div className={`w-2 h-2 rounded-full mr-3 bg-gradient-to-r ${getCategoryGradient(category)}`} />
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="paper-badge text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        <div className="mt-6">
          <h3 className="paper-section-title !text-lg !border-none !mb-4">
            <Lightbulb className="h-5 w-5 mr-3 inline-block text-primary" />
            Selected Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.name} className="paper-card h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
                <div className="space-y-3">
                  {/* Project Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-foreground print:text-black">
                        {project.name}
                      </h4>
                      <div className="flex items-center gap-4 mt-1">
                        {project.status && (
                          <span className={`paper-badge ${project.status === 'Active' ? 'bg-primary/20 text-primary' : ''}`}>
                            {project.status}
                          </span>
                        )}
                        {project.year && (
                          <span className="text-sm text-muted-foreground">
                            {project.year}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 print:hidden">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="View Project"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          title="View Source"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="paper-body !text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/60">
                  {project.tech.map((tech) => (
                    <span key={tech} className="paper-badge !text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
