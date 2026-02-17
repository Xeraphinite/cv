'use client'

import { Icon } from '@iconify/react'

interface ProfileSectionProps {
  data: {
    profileHighlights?: {
      totalPublications?: number
      citations?: number
      totalProjects?: number
      yearsExperience?: number
      awardsCount?: number
      gpa?: string
      researchInterests?: string[]
    }
    education?: Array<{
      institution: string
      degree: string
      major: string
      period: string
      gpa?: string
    }>
    publications?: Array<{
      title: string
      authors: string[]
      venue: string
      year: number
      type: string
    }>
    awards?: Array<{
      title: string
      date: string
      description?: string
    }>
    projects?: Array<{
      name: string
      description: string
      tech: string[]
      url?: string
    }>
  }
}

interface BioSectionProps {
  data: {
    bio?: string
    summary?: string
  }
}

interface ResearchInterestsSectionProps {
  data: {
    researchInterests?: string[]
  }
}

// Helper function to calculate dynamic values from existing data
function calculateProfileMetrics(data: ProfileSectionProps['data']) {
  const publications = data.publications?.length || 0
  const awards = data.awards?.length || 0
  const gpa = data.education?.[0]?.gpa || "N/A"
  const projects = data.projects?.length || 0
  
  return {
    totalPublications: publications,
    citations: 0, // This would need to be tracked separately
    totalProjects: projects,
    yearsExperience: 3, // This would need to be calculated from experience data
    awardsCount: awards,
    gpa: gpa,
  }
}

export function ProfileSection({ data }: ProfileSectionProps) {
  const metrics = calculateProfileMetrics(data)
  const highlights = data.profileHighlights || metrics

  const highlightItems = [
    {
      label: "Publications",
      value: highlights.totalPublications || 0,
      icon: "mingcute:book-6-line",
    },
    {
      label: "Awards",
      value: highlights.awardsCount || 0,
      icon: "mingcute:medal-line",
    },
    {
      label: "Projects",
      value: highlights.totalProjects || 0,
      icon: "mingcute:target-line",
    },
    {
      label: "GPA",
      value: highlights.gpa || "N/A",
      icon: "mingcute:mortarboard-line",
    },
  ]

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:star-fill" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        Profile Highlights
      </h2>

      <div className="paper-card">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlightItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center p-2 rounded-lg transition-all duration-200 hover:bg-muted/80">
              <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-primary/10 text-primary">
                <Icon icon={item.icon} className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {item.value}
                </div>
                <div className="paper-meta">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ResearchInterestsSection({ data }: ResearchInterestsSectionProps) {
  if (!data.researchInterests || data.researchInterests.length === 0) return null

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:brain-line" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        Research Interests
      </h2>

      <div className="paper-card">
        <div className="flex flex-wrap gap-3">
          {data.researchInterests.map((interest) => (
            <span key={interest} className="paper-badge">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
} 
