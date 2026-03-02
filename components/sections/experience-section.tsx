"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { MarkdownText } from "@/components/ui/markdown-text";
import { formatToYearMonth } from "@/lib/date-format";

interface Experience {
	company: string;
	position: string;
	location?: string;
	startDate: string;
	endDate?: string;
	summary?: string;
	highlights: string[];
}

interface ExperienceSectionProps {
	data: Experience[];
}

export function ExperienceSection({ data }: ExperienceSectionProps) {
	const t = useTranslations();

	const renderYearMonthWithSup = (value: string) => {
		const formatted = formatToYearMonth(value);
		const match = formatted.match(/^(\d{4})\.?(\d{2})$/);
		if (!match) return <>{formatted}</>;
		return (
			<>
				<span>{match[1]}</span>
				<sup className="relative top-[0.04em] ml-0.5 align-super font-semibold text-[0.72em]">
					{match[2]}
				</sup>
			</>
		);
	};

	if (!data || data.length === 0) {
		return null;
	}

	return (
		<section className="cv-section">
			<h2 className="cv-section-title">
				<Icon
					icon="mingcute:telescope-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.experience")}
			</h2>

			<div className="flex flex-col gap-y-2">
				{data.map((experience, index) => (
					<div
						key={`${experience.company}-${experience.position}-${index}`}
						className="cv-card transition-all duration-300"
					>
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2">
							<p className="cv-meta cv-meta-strong order-2 col-start-2 row-start-1 justify-self-end whitespace-nowrap text-right font-sans text-foreground/80 leading-tight">
								{renderYearMonthWithSup(experience.startDate)} -{" "}
								{renderYearMonthWithSup(experience.endDate || "Present")}
							</p>
							<div className="order-1 col-start-1 row-start-1 min-w-0">
								<h3 className="cv-subtitle mb-1">{experience.position}</h3>
								<div className="cv-body flex items-center gap-2">
									<Icon
										icon="mingcute:at-fill"
										className="h-3 w-3 text-muted-foreground"
									/>
									<span>{experience.company}</span>
								</div>
							</div>

							{experience.summary && (
								<MarkdownText
									content={experience.summary}
									className="cv-body col-span-2 text-base text-muted-foreground"
								/>
							)}

							{experience.highlights && experience.highlights.length > 0 && (
								<div className="col-span-2">
									<ul className="[&>*:not(:last-child)]:mb-1.5">
										{experience.highlights.map((highlight, idx) => (
											<li
												key={`${experience.company}-highlight-${idx}`}
												className="flex items-start gap-3"
											>
												<div className="relative top-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
												<MarkdownText
													content={highlight}
													className="cv-body text-base text-muted-foreground"
													inline
												/>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
