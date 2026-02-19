import { HeroSection } from './hero-section'
import { EducationSection } from './education-section'
import { ExperienceSection } from './experience-section'
import { SkillsSection } from './skills-section'
import { ProjectsSection } from './projects-section'
import { PublicationsSection } from './publications-section'
import { AwardsSection } from './awards-section'
import { TalksSection } from './talks-section'
import { NewsSection } from './news-section'
import { MiscSection } from './misc-section'
import type { SkillItemBadgeData } from './skill-item-badge'
import { CVFooter } from '@/components/layout/cv-footer'
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
  lastUpdated?: string
}

export function CV({ data, locale, lastUpdated }: CVProps) {
  if (!data) return null

  const mappedSkills: Record<string, SkillItemBadgeData[]> = {}

  for (const category of data.skills?.categories ?? []) {
    mappedSkills[category] = []
  }

  for (const skill of data.skills?.skills ?? []) {
    const text = skill.text || skill.name
    if (!text) continue
    if (!mappedSkills[skill.category]) {
      mappedSkills[skill.category] = []
    }
    mappedSkills[skill.category].push({
      text,
      icon: skill.icon,
      url: skill.url,
      code: skill.code,
      description: skill.description,
    })
  }

  const miscCategory = 'Misc'
  const miscSkills = mappedSkills[miscCategory] ?? []
  const skillsOnly = Object.fromEntries(
    Object.entries(mappedSkills).filter(([category, items]) => category !== miscCategory && items.length > 0)
  )

  const projectsData = data.projects || []
  const publicationsData = (data.publications ?? []).map((pub) => ({
    ...pub,
    publishedIn: pub.journal || pub.publishedIn || 'Unknown Venue',
  }))

  return (
    <div className="paper-container">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10">
        <div className="lg:sticky lg:top-4 lg:bottom-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col">
          <section id="hero" className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            <HeroSection data={data.hero} locale={locale} />
          </section>

          <div className="hidden lg:block">
            <CVFooter compact showLocaleThemeControls className="mt-0 block max-w-none border-t-0" lastUpdated={lastUpdated} />
          </div>
        </div>

        <div className="py-2 sm:py-4 lg:py-6">
          {data.news && data.news.length > 0 && (
            <section id="news">
              <NewsSection data={data.news} />
            </section>
          )}

          {data.education.length > 0 && (
            <section id="education">
              <EducationSection data={data.education} config={data.sectionConfig?.education} />
            </section>
          )}

          {data.experience.length > 0 && (
            <section id="experience">
              <ExperienceSection data={data.experience} />
            </section>
          )}

          {Object.keys(skillsOnly).length > 0 && (
            <section id="skills">
              <SkillsSection data={{ skills: skillsOnly }} />
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

          {miscSkills.length > 0 && (
            <section id="misc">
              <MiscSection items={miscSkills} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
