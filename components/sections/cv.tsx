import { HeroSection } from './hero-section'
import { EducationSection } from './education-section'
import { ExperienceSection } from './experience-section'
import { SkillsSection } from './skills-section'
import { ProjectsSection } from './projects-section'
import { PublicationsSection } from './publications-section'
import { AwardsSection } from './awards-section'
import { TalksSection } from './talks-section'
import type { CVData } from '@/lib/types/cv'

interface CVProject {
  name: string
  description: string
  tech: string[]
  url?: string
  github?: string
  status?: string
  year?: number
}

interface CVProps {
  data: (CVData & { projects?: CVProject[] }) | null
  locale?: string
}

export function CV({ data, locale }: CVProps) {
  if (!data) return null

  const mappedSkills: Record<string, string[]> = {}

  for (const category of data.skills?.categories ?? []) {
    mappedSkills[category] = []
  }

  for (const skill of data.skills?.skills ?? []) {
    if (!skill.name) continue
    if (!mappedSkills[skill.category]) {
      mappedSkills[skill.category] = []
    }
    mappedSkills[skill.category].push(skill.name)
  }

  const projectsData = data.projects || []
  const publicationsData = (data.publications ?? []).map((pub) => ({
    ...pub,
    publishedIn: pub.journal || pub.publishedIn || 'Unknown Venue',
  }))

  return (
    <div className="paper-container grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10">
      <section id="hero" className="lg:sticky lg:top-24 lg:self-start">
        <HeroSection data={data.hero} locale={locale} />
      </section>

      <div className="py-2 sm:py-4 lg:py-6">
        {data.education.length > 0 && (
          <section id="education">
            <EducationSection data={data.education} />
          </section>
        )}

        {data.experience.length > 0 && (
          <section id="experience">
            <ExperienceSection data={data.experience} />
          </section>
        )}

        {Object.keys(mappedSkills).length > 0 && (
          <section id="skills">
            <SkillsSection data={{ skills: mappedSkills }} />
          </section>
        )}

        <section id="projects">
          <ProjectsSection data={projectsData} />
        </section>

        {data.publications.length > 0 && (
          <section id="publications">
            <PublicationsSection data={publicationsData} ownerName={data.hero.name} ownerEnName={data.hero.enName} />
          </section>
        )}

        {data.awards.length > 0 && (
          <section id="awards">
            <AwardsSection data={data.awards} />
          </section>
        )}

        {data.talks && data.talks.length > 0 && (
          <section id="talks">
            <TalksSection data={data.talks} />
          </section>
        )}
      </div>
    </div>
  )
}
