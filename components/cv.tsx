import { HeroSection } from "./hero-section"
import { EducationSection } from "./education-section"
import { PublicationsSection } from "./publications-section"
import { SkillsSection } from "./skills-section"
import { AwardsSection } from "./awards-section"
import { ExperienceSection } from "./experience-section"

interface CVProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
}

export function CV({ data }: CVProps) {
  return (
    <div className="bg-background print:bg-white shadow-sm print:shadow-none w-full max-w-[210mm] min-h-[297mm] print:min-h-0 print:w-[210mm] print:h-auto flex flex-col relative border border-border print:border-none">
      {/* Content with minimal styling */}
      <div className="relative">
        <HeroSection data={data.hero} />
        <div className="px-8 py-6 print:px-6 print:py-4">
          <div className="space-y-6">
            <EducationSection data={data.education} />
            <ExperienceSection data={data.experience} />
            <SkillsSection data={data.skills} />
            <AwardsSection data={data.awards} />
            <PublicationsSection data={data.publications} ownerName={data.hero.name} ownerEnName={data.hero.enName} />
          </div>
        </div>
      </div>
    </div>
  )
}
