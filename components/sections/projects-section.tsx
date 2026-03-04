"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { MarkdownText } from "@/components/ui/markdown-text";
import { formatToYearMonth } from "@/lib/date-format";
import type { ProjectItem } from "@/lib/types/cv";
import { SkillItemBadge } from "./skill-item-badge";

interface ProjectsSectionProps {
	data: ProjectItem[];
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
	const t = useTranslations();
	const projects = data ?? [];
	if (projects.length === 0) return null;

	return (
		<section className="cv-section">
			<h2 className="cv-section-title">
				<Icon
					icon="mingcute:light-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.selectedProjects")}
			</h2>

			<div className="cv-items-stack">
				{projects.map((project) => (
					<div
						key={project.name}
						className="cv-body text-foreground leading-relaxed"
					>
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2">
							<span className="order-2 col-start-2 row-start-1 justify-self-end whitespace-nowrap text-right font-bold font-sans text-base text-foreground/80">
								{formatToYearMonth(project.year)}
							</span>
							<div className="order-1 col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-2">
								<h3 className="font-sans font-semibold text-lg">
									{project.name}
								</h3>
								{project.status ? (
									<Badge
										variant="secondary"
										className="rounded-full border border-border/60 bg-muted/80 px-2 py-0 font-medium font-sans text-foreground/85 text-sm hover:bg-secondary/80"
									>
										{project.status}
									</Badge>
								) : null}
							</div>

							{project.description ? (
								<div className="col-span-2 font-serif text-base text-foreground/90">
									<MarkdownText content={project.description} />
								</div>
							) : null}

							{project.tech && project.tech.length > 0 ? (
								<div className="col-span-2 flex flex-wrap gap-2">
									{project.tech.map((item, index) => (
										<SkillItemBadge
											key={`${project.name}-tech-${item.text}-${index}`}
											item={item}
										/>
									))}
								</div>
							) : null}

							{project.previewImages && project.previewImages.length > 0 ? (
								<div className="col-span-2 mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
									{project.previewImages.map((image, index) => (
										<div
											key={`${project.name}-preview-${image.src}-${index}`}
											className="overflow-hidden rounded-lg border border-border/60 bg-card/80"
										>
											<img
												src={image.src}
												alt={
													image.alt || `${project.name} preview ${index + 1}`
												}
												className="h-36 w-full object-cover"
												loading="lazy"
											/>
										</div>
									))}
								</div>
							) : null}

							{project.urls && project.urls.length > 0 ? (
								<div className="col-span-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
									{project.urls.map((link, index) => (
										<a
											key={`${project.name}-url-${link.url}-${index}`}
											href={link.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 text-primary no-underline visited:no-underline hover:no-underline focus-visible:no-underline"
											title={t("tooltips.links.openLink", {
												label: link.label || t("actions.viewMore"),
											})}
										>
											<Icon
												icon={link.icon || "mingcute:arrow-right-up-fill"}
												className="h-4 w-4"
											/>
											<span className="font-sans text-base">
												{link.label || t("actions.viewMore")}
											</span>
										</a>
									))}
								</div>
							) : null}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
