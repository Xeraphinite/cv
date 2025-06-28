import { HeroSection } from './hero-section'
import { ProfileSection, BioSection, ResearchInterestsSection } from './profile-section'
import { EducationSection } from './education-section'
import { ExperienceSection } from './experience-section'
import { SkillsSection } from './skills-section'
import { PublicationsSection } from './publications-section'
import { AwardsSection } from './awards-section'
import { TalksSection } from './talks-section'

type PublicationStatus = 'Published' | 'Under Review' | 'In Press' | 'Ongoing' | 'Under Review, R2' | '査読中' | '進行中' | '実質審査'

interface Publication {
  title: string
  authors: string[]
  journal?: string
  conference?: string
  year: number
  volume?: string
  pages?: string
  doi?: string
  url?: string
  abstract?: string
  status: PublicationStatus
  venue: string
  type: string
}

interface Hero {
  name: string
  enName: string
  bio?: string
  description?: string
  avatar: string
  location: string
  age: number
  social: {
    email?: string
    github?: string
    wechat?: string
    website?: string
    googleScholar?: string
    orcid?: string
    bluesky?: string
    // Legacy fields for backward compatibility
    phone?: string
    linkedin?: string
    twitter?: string
    researchGate?: string
  }
}

interface Education {
  institution: string
  area: string
  degree: string
  startDate: string
  endDate: string
  summary?: string
  highlights: string[]
  supervisor?: string
}

interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  summary?: string
  highlights: string[]
  location?: string
}

interface Skills {
  categories: string[]
  skills: Array<{
    name: string
    category: string
    description: string
  }>
}

interface Award {
  title: string
  date: string
  description?: string
  issuer?: string
  url?: string
}

interface Talk {
  title: string
  date: string
  venue: string
  location?: string
  url?: string
  type: string
}



interface CVProps {
  data: any // eslint-disable-line @typescript-eslint/no-explicit-any
  locale?: string
}

export function CV({ data, locale }: CVProps) {
  if (!data) return null

  // Map CVData to the expected Hero format
  const heroData = {
    ...data.hero,
    social: {
      ...data.hero.social
    }
  }

  // Map skills to the expected format
  const skillsData = {
    skills: data.skills ? data.skills.categories.reduce((acc: { [category: string]: string[] }, category: string) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const categorySkills = data.skills.skills
        .filter((skill: any) => skill.category === category) // eslint-disable-line @typescript-eslint/no-explicit-any
        .map((skill: any) => skill.name) // eslint-disable-line @typescript-eslint/no-explicit-any
      if (categorySkills.length > 0) {
        acc[category] = categorySkills
      }
      return acc
    }, {} as { [category: string]: string[] }) : {},
    projects: [] // Will use default placeholder projects
  }

  // Map publications to the expected format
  const publicationsData = data.publications?.map((pub: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    ...pub,
    venue: pub.journal || pub.conference || pub.venue || 'Unknown Venue'
  })) || []

  return (
    <main className="min-h-screen bg-background print:bg-white">
      {/* Hero Section */}
      <section id="hero">
        <HeroSection data={heroData} locale={locale} />
      </section>

      {/* Content Sections */}
      <div className="paper-container py-10 space-y-12">
        {/* Profile Highlights */}
        <section id="profile">
          <ProfileSection data={{
            education: data.education?.map((edu: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
              institution: edu.institution,
              degree: edu.degree,
              major: edu.area,
              period: `${edu.startDate} - ${edu.endDate}`,
              gpa: edu.summary?.includes('GPA') ? edu.summary.split('GPA')[1]?.trim() : undefined
            })),
            publications: publicationsData,
            awards: data.awards,
            projects: []
          }} />
        </section>

        {/* Research Interests */}
        <section id="research">
          <ResearchInterestsSection data={{ 
            researchInterests: [
              "Large Language Models",
              "3D Reconstruction", 
              "Human-Computer Interaction",
              "Smart Manufacturing",
              "AI-Powered Systems"
            ]
          }} />
        </section>

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section id="education">
            <EducationSection data={data.education} />
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section id="experience">
            <ExperienceSection data={data.experience} />
          </section>
        )}

        {/* Skills & Projects */}
        {(data.skills || skillsData.skills) && (
          <section id="skills">
            <SkillsSection data={skillsData} />
          </section>
        )}

        {/* Publications */}
        {data.publications && data.publications.length > 0 && (
          <section id="publications">
            <PublicationsSection data={publicationsData} ownerName={data.hero.name} ownerEnName={data.hero.enName} />
          </section>
        )}

        {/* Awards */}
        {data.awards && data.awards.length > 0 && (
          <section id="awards">
            <AwardsSection data={data.awards} />
          </section>
        )}

        {/* Talks */}
        {data.talks && data.talks.length > 0 && (
          <section id="talks">
            <TalksSection data={data.talks} />
          </section>
        )}
      </div>
    </main>
  )
}
