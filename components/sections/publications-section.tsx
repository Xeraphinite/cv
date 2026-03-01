"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { MarkdownText } from "@/components/ui/markdown-text";
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
	impactFactor?: number;
	abstract?: string;
	pages?: string;
	volume?: string;
	issue?: string;
}

interface PublicationsSectionProps {
	data: Publication[];
	ownerName?: string;
	ownerEnName?: string;
	ownerAliases?: string[];
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

	const formatPublicationMeta = (publication: Publication) => {
		const parts: string[] = [];
		if (publication.journal || publication.publishedIn) {
			parts.push(publication.journal || publication.publishedIn || "");
		}
		if (publication.volume) {
			parts.push(`Vol. ${publication.volume}`);
		}
		if (publication.issue) {
			parts.push(`No. ${publication.issue}`);
		}
		if (publication.pages) {
			parts.push(`pp. ${publication.pages}`);
		}
		return parts.filter(Boolean).join(" · ");
	};

	return (
		<section className="paper-section">
			<h2 className="paper-section-title">
				<Icon
					icon="mingcute:book-6-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.publications")}
			</h2>

			<div className="flex flex-col gap-y-2">
				{sortedItems.map((publication, index) => (
					<div
						key={`${publication.title}-${index}`}
						className="paper-body text-foreground leading-relaxed"
					>
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-3 md:gap-y-1">
							<span className="order-2 justify-self-end whitespace-nowrap text-right font-bold font-sans text-base text-foreground/80">
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
												className="inline font-sans font-semibold"
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

								{formatPublicationMeta(publication) ? (
									<p className="text-base text-foreground/80 italic">
										{formatPublicationMeta(publication)}
									</p>
								) : null}

								<div className="flex flex-wrap items-center gap-x-2 text-base text-foreground/80">
									<span>{publication.type}</span>
									<span>·</span>
									<span>{publication.status}</span>
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
				))}
			</div>
		</section>
	);
}
