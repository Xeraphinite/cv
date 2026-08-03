"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { MarkdownText } from "@/components/ui/markdown-text";
import { PaperTextureImage } from "@/components/ui/paper-texture-image";
import { formatToYearMonth } from "@/lib/date-format";
import { createOwnerNameMatcher } from "./author-name-utils";

// Improved type definitions
interface Publication {
	title: string;
	authors: string[];
	year?: string;
	type: string;
	status: string;
	highlight?: boolean;
	involved?: boolean;
	journal?: string;
	publishedIn?: string;
	doi?: string;
	url?: string;
	indexing?: string[];
	metadata?: string[];
	impactFactor?: number;
	abstract?: string;
	pages?: string;
	volume?: string;
	issue?: string;
	image?: string;
	imageAlt?: string;
}

interface PublicationsSectionProps {
	data: Publication[];
	ownerName?: string;
	ownerEnName?: string;
	ownerAliases?: string[];
}

const publicationIcons: Record<string, string> = {
	"SPADA: A Verifiable Test-Driven Agent for Controllable Parametric CAD Assembly Generation":
		"mingcute:cube-3d-fill",
	"Towards Agentic Smart Design: An Industrial Large Model-driven Human-in-the-loop Agentic Workflow for Geometric Modelling":
		"mingcute:git-branch-fill",
	"AIGC-empowered Smart Manufacturing: Prospects and Challenges":
		"mingcute:factory-fill",
};

function getPublicationIcon(title: string): string {
	return publicationIcons[title] ?? "mingcute:document-2-fill";
}

function containsMarkdownLink(content: string): boolean {
	return (
		/\[[^\]]+\]\((?:https?:\/\/|\/)[^)]+\)/.test(content) ||
		/<a\s/i.test(content)
	);
}

export function PublicationsSection({
	data,
	ownerName,
	ownerEnName,
	ownerAliases = [],
}: PublicationsSectionProps) {
	const t = useTranslations();

	if (!data || data.length === 0) {
		return null;
	}

	const parsePublicationYear = (value?: string): number => {
		if (!value) {
			return Number.NEGATIVE_INFINITY;
		}
		const year = Number.parseInt(value, 10);
		return Number.isFinite(year) ? year : Number.NEGATIVE_INFINITY;
	};

	const sortedItems = [...data]
		.map((item, index) => ({ item, index }))
		.sort((a, b) => {
			const rankDiff =
				parsePublicationYear(b.item.year) - parsePublicationYear(a.item.year);
			if (rankDiff !== 0) {
				return rankDiff;
			}
			return a.index - b.index;
		})
		.map(({ item }) => item);

	const isOwnerAuthor = createOwnerNameMatcher({
		ownerName,
		ownerEnName,
		ownerAliases,
	});

	const formatAuthors = (authors: string[]) => {
		return authors.map((author, index) => {
			const isOwner = isOwnerAuthor(author);

			return (
				<span
					key={author}
					className={
						isOwner ? "font-bold text-foreground" : "text-foreground/80"
					}
				>
					{author}
					{index < authors.length - 1 && ", "}
				</span>
			);
		});
	};

	const getPublicationMeta = (publication: Publication) => {
		const venue = publication.journal || publication.publishedIn || "";
		const details: string[] = [];
		if (publication.volume) {
			details.push(`Vol. ${publication.volume}`);
		}
		if (publication.issue) {
			details.push(`No. ${publication.issue}`);
		}
		if (publication.pages) {
			details.push(`pp. ${publication.pages}`);
		}
		return { venue, details };
	};

	return (
		<section className="cv-section">
			<h2 className="cv-section-title">
				<Icon
					icon="mingcute:book-6-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.publications")}
			</h2>

			<div className="cv-items-stack">
				{sortedItems.map((publication, index) => (
					<div
						key={`${publication.title}-${index}`}
						className="cv-body text-foreground leading-relaxed"
					>
						<div
							className={
								publication.image
									? "grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-stretch sm:gap-4"
									: ""
							}
						>
							{publication.image ? (
								<>
									<div
										className="flex size-10 items-center justify-center rounded-lg border border-border/70 text-primary sm:hidden"
										aria-hidden="true"
									>
										<Icon
											icon={getPublicationIcon(publication.title)}
											className="size-6"
										/>
									</div>
									<PaperTextureImage
										src={publication.image}
										alt={publication.imageAlt || publication.title}
										sizes="192px"
										className="relative hidden h-[calc(100%-0.5rem)] self-center rounded-lg border border-border/70 sm:block"
									/>
								</>
							) : null}

							<div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-3 md:gap-y-1">
								<span className="cv-locale-sans order-2 justify-self-end whitespace-nowrap text-right font-bold text-base text-foreground/80">
									{formatToYearMonth(publication.year)}
								</span>

								<div className="order-1 min-w-0 [&>*:not(:last-child)]:mb-0.5">
									<h3 className="text-lg leading-tight">
										{publication.url &&
										!containsMarkdownLink(publication.title) ? (
											<a
												href={publication.url}
												target="_blank"
												rel="noopener noreferrer"
												className="group no-underline hover:no-underline"
											>
												<MarkdownText
													content={publication.title}
													className="cv-locale-sans inline font-semibold"
													inline
												/>
												<Icon
													icon="mingcute:arrow-right-up-fill"
													className="ml-1 inline h-3.5 w-3.5 align-[-0.08em] text-foreground/70 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground"
												/>
											</a>
										) : (
											<MarkdownText content={publication.title} inline />
										)}
									</h3>

									{publication.authors?.length ? (
										<p className="text-base text-foreground/80">
											{formatAuthors(publication.authors)}
										</p>
									) : null}

									{(() => {
										const { venue, details } = getPublicationMeta(publication);

										if (!venue && details.length === 0) {
											return null;
										}

										return (
											<p className="text-base text-foreground/80">
												{venue ? (
													<span className="font-bold text-foreground italic">
														{venue}
													</span>
												) : null}
												{details.map((detail, detailIndex) => (
													<span key={detail}>
														{venue || detailIndex > 0 ? " · " : ""}
														{detail}
													</span>
												))}
											</p>
										);
									})()}

									<div className="flex flex-wrap items-center gap-x-2 text-base text-foreground/80">
										<span>{publication.type}</span>
										{publication.indexing?.map((indexing) => (
											<span key={indexing} className="contents">
												<span>·</span>
												<span className="font-mono">
													{indexing.replace("-", " ")}
												</span>
											</span>
										))}
										{publication.metadata?.map((metadata) => (
											<span key={metadata} className="contents">
												<span>·</span>
												<span className="font-mono">{metadata}</span>
											</span>
										))}
										{publication.impactFactor ? (
											<>
												<span>·</span>
												<span className="font-mono">
													IF {publication.impactFactor}
												</span>
											</>
										) : null}
										{publication.doi ? (
											<>
												<span>·</span>
												<a
													href={`https://doi.org/${publication.doi}`}
													target="_blank"
													rel="noopener noreferrer"
													className="font-mono no-underline hover:no-underline"
												>
													DOI
												</a>
											</>
										) : null}
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
