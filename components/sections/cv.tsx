import { HeroSection } from "./hero-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { SkillsSection } from "./skills-section";
import { ProjectsSection } from "./projects-section";
import { PublicationsSection } from "./publications-section";
import { AwardsSection } from "./awards-section";
import { PatentsSection } from "./patents-section";
import { CopyrightsSection } from "./copyrights-section";
import { NewsSection } from "./news-section";
import { MiscSection } from "./misc-section";
import { BioSection } from "./bio-section";
import type { SkillItemBadgeData } from "./skill-item-badge";
import { CVFooter } from "@/components/layout/cv-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { CVData } from "@/lib/types/cv";

interface CVProps {
	data: CVData | null;
	locale?: string;
	lastUpdated?: string;
}

export function CV({ data, locale, lastUpdated }: CVProps) {
	if (!data) return null;

	const mappedSkills: Record<string, SkillItemBadgeData[]> = {};

	for (const category of data.skills?.categories ?? []) {
		mappedSkills[category] = [];
	}

	for (const skill of data.skills?.skills ?? []) {
		const text = skill.text || skill.name;
		if (!text) continue;
		if (!mappedSkills[skill.category]) {
			mappedSkills[skill.category] = [];
		}
		mappedSkills[skill.category].push({
			text,
			icon: skill.icon,
			url: skill.url,
			code: skill.code,
			description: skill.description,
		});
	}

	const miscCategory = "Misc";
	const miscSkills = mappedSkills[miscCategory] ?? [];
	const skillsOnly = Object.fromEntries(
		Object.entries(mappedSkills).filter(
			([category, items]) => category !== miscCategory && items.length > 0,
		),
	);

	const projectsData = data.projects || [];
	const publicationsData = (data.publications ?? []).map((pub) => ({
		...pub,
		publishedIn: pub.journal || pub.publishedIn || "Unknown Venue",
	}));

	return (
		<TooltipProvider delayDuration={120}>
			<div className="cv-container pt-4 pb-6 sm:pt-0 sm:pb-0 lg:pt-4 lg:pb-6">
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-10">
					<div className="pt-4 lg:sticky lg:top-4 lg:bottom-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col">
						<section
							id="hero"
							className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
						>
							<HeroSection data={data.hero} locale={locale} />
						</section>

						<div className="hidden lg:block">
							<CVFooter
								compact
								showLocaleThemeControls
								className="block max-w-none border-t-0"
								lastUpdated={lastUpdated}
							/>
						</div>
					</div>

					<div className="cv-sections-stack py-4">
						{data.hero.bio && (
							<section id="about">
								<BioSection bio={data.hero.bio} />
							</section>
						)}

						{data.news && data.news.length > 0 && (
							<section id="news">
								<NewsSection data={data.news} />
							</section>
						)}

						{projectsData.length > 0 && (
							<section id="projects">
								<ProjectsSection data={projectsData} />
							</section>
						)}

						{data.publications.length > 0 && (
							<section id="publications">
								<PublicationsSection
									data={publicationsData}
									ownerName={data.hero.name}
									ownerEnName={data.hero.enName}
									ownerAliases={data.hero.aliases}
								/>
							</section>
						)}

						{data.experience.length > 0 && (
							<section id="experience">
								<ExperienceSection data={data.experience} />
							</section>
						)}

						{data.education.length > 0 && (
							<section id="education">
								<EducationSection
									data={data.education}
									config={data.sectionConfig?.education}
								/>
							</section>
						)}

						{Object.keys(skillsOnly).length > 0 && (
							<section id="skills">
								<SkillsSection data={{ skills: skillsOnly }} />
							</section>
						)}

						{data.awards.length > 0 && (
							<section id="awards">
								<AwardsSection data={data.awards} />
							</section>
						)}

						{(data.patents ?? []).length > 0 && (
							<section id="patents">
								<PatentsSection
									data={data.patents ?? []}
									ownerName={data.hero.name}
									ownerEnName={data.hero.enName}
									ownerAliases={data.hero.aliases}
								/>
							</section>
						)}

						{(data.copyrights ?? []).length > 0 && (
							<section id="copyrights">
								<CopyrightsSection
									data={data.copyrights ?? []}
									ownerName={data.hero.name}
									ownerEnName={data.hero.enName}
									ownerAliases={data.hero.aliases}
								/>
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
		</TooltipProvider>
	);
}
