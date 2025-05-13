import { HeroSection } from "./hero-section"
import { EducationSection } from "./education-section"
import { PublicationsSection } from "./publications-section"
import { SkillsSection } from "./skills-section"
import { AwardsSection } from "./awards-section"
import { ExperienceSection } from "./experience-section"

interface CVProps {
  data: any
}

export function CV({ data }: CVProps) {
  return (
    <div className="bg-white shadow-lg print:shadow-none w-full max-w-[210mm] min-h-[297mm] print:min-h-0 print:w-[210mm] print:h-auto flex flex-col">
      <HeroSection data={data.hero} />
      <div className="px-8 py-2 flex-1 space-y-6">
        <EducationSection data={data.education} />
        <AwardsSection data={data.awards} />
        <PublicationsSection data={data.publications} ownerName={data.hero.name} ownerEnName={data.hero.enName} />
        <ExperienceSection data={data.experience} />
        <SkillsSection data={data.skills} />
      </div>
    </div>
  )
}
