"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
	const [isExpanded, setIsExpanded] = useState(false);
	const [isOverflowing, setIsOverflowing] = useState(false);
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const skillTrackRef = useRef<HTMLDivElement | null>(null);
	const useSerifBadges = skills.some((skill) => skill.fontFamily === "serif");

	useEffect(() => {
		const viewport = viewportRef.current;
		const track = skillTrackRef.current;
		if (!viewport || !track) return;

		const checkOverflow = () => {
			setIsOverflowing(track.scrollWidth > viewport.clientWidth + 1);
		};

		checkOverflow();
		const observer = new ResizeObserver(checkOverflow);
		observer.observe(viewport);
		observer.observe(track);
		return () => observer.disconnect();
	}, [skills]);

	const canExpand = isOverflowing && !isExpanded;

	return (
		<div
			key={category}
			className="grid grid-cols-1 items-start gap-x-4 gap-y-1.5 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-y-1"
		>
			<h3 className="shrink-0 whitespace-nowrap font-sans font-semibold text-foreground text-lg md:text-right">
				{category}
			</h3>
			<div ref={viewportRef} className="relative min-w-0">
				<div
					ref={skillTrackRef}
					className={cn(
						"flex items-center gap-2",
						isExpanded
							? "flex-wrap"
							: "min-w-max flex-nowrap overflow-hidden whitespace-nowrap",
						useSerifBadges ? "items-baseline" : undefined,
					)}
				>
					{skills.map((skill, index) => (
						<SkillItemBadge
							key={`${category}-${skill.text}-${index}`}
							item={skill}
						/>
					))}
				</div>

				{canExpand && (
					<button
						type="button"
						onClick={() => setIsExpanded(true)}
						className="absolute top-0 right-0 inline-flex h-full items-center bg-gradient-to-l from-background via-background/95 to-transparent pl-6"
						aria-label={`Show more ${category} skills`}
					>
						<Badge
							variant="secondary"
							className="h-auto rounded-full border border-border/50 bg-muted px-2.5 py-1.5 font-medium text-foreground/90 text-sm"
						>
							...
						</Badge>
					</button>
				)}
			</div>
		</div>
	);
}

export function SkillsSection({ data }: SkillsSectionProps) {
	const t = useTranslations();

	if (!data || !data.skills || Object.keys(data.skills).length === 0)
		return null;

	const [languageCategory] = Object.keys(data.skills);

	return (
		<section className="paper-section">
			<h2 className="paper-section-title">
				<Icon
					icon="mingcute:flashlight-fill"
					className="mr-3 inline-block align-[-0.12em] text-primary"
				/>
				{t("sections.skills")}
			</h2>

			<div className="paper-card">
				<div className="flex flex-col gap-y-2">
					{Object.entries(data.skills).map(([category, skills]) => (
						<SkillsCategoryRow
							key={category}
							category={category}
							skills={skills.map((skill, index) => ({
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
