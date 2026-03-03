"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { SkillItemBadge, type SkillItemBadgeData } from "./skill-item-badge";

interface SkillsSectionProps {
	data: {
		skills?: {
			[category: string]: SkillItemBadgeData[];
		};
	};
}

interface SkillsCategoryRowProps {
	category: string;
	skills: SkillItemBadgeData[];
}

function SkillsCategoryRow({ category, skills }: SkillsCategoryRowProps) {
	return (
		<div
			key={category}
			className="grid grid-cols-[10rem_minmax(0,1fr)] items-start gap-x-4 gap-y-1"
		>
			<h3 className="shrink-0 whitespace-nowrap text-left font-sans font-semibold text-foreground text-lg">
				{category}
			</h3>
			<div className="flex min-w-0 flex-wrap items-center gap-2">
				{skills.map((skill, index) => (
					<SkillItemBadge
						key={`${category}-${skill.text}-${index}`}
						item={skill}
					/>
				))}
			</div>
		</div>
	);
}

export function SkillsSection({ data }: SkillsSectionProps) {
	const t = useTranslations();

	if (!data || !data.skills || Object.keys(data.skills).length === 0) {
		return null;
	}

	const [languageCategory] = Object.keys(data.skills);

	return (
		<section className="cv-section">
			<h2 className="cv-section-title">
				<Icon
					icon="mingcute:flashlight-fill"
					className="mr-3 inline-block align-[-0.12em] text-primary"
				/>
				{t("sections.skills")}
			</h2>

			<div className="cv-card">
				<div className="cv-items-stack">
					{Object.entries(data.skills).map(([category, skills]) => (
						<SkillsCategoryRow
							key={category}
							category={category}
							skills={skills.map((skill) => ({
								...skill,
								fontFamily:
									category === languageCategory ? "serif" : skill.fontFamily,
							}))}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
