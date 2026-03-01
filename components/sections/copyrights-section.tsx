"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { formatToYearMonth } from "@/lib/date-format";
import { createOwnerNameMatcher } from "./author-name-utils";

interface CopyrightItem {
	title: string;
	year: string;
	status: string;
	country: string;
	holders: string[];
}

interface CopyrightsSectionProps {
	data: CopyrightItem[];
	ownerName?: string;
	ownerEnName?: string;
	ownerAliases?: string[];
}

export function CopyrightsSection({
	data,
	ownerName,
	ownerEnName,
	ownerAliases = [],
}: CopyrightsSectionProps) {
	const t = useTranslations();
	if (!data || data.length === 0) return null;

	const parseDateRank = (value: string) => {
		const normalized = formatToYearMonth(value);
		const match = normalized.match(/^(\d{4})(\d{2})?$/);
		if (!match) return Number.NEGATIVE_INFINITY;
		const year = Number.parseInt(match[1], 10);
		const month = Number.parseInt(match[2] ?? "0", 10);
		return year * 100 + month;
	};

	const sortedItems = [...data]
		.map((item, index) => ({ item, index }))
		.sort((a, b) => {
			const rankDiff = parseDateRank(b.item.year) - parseDateRank(a.item.year);
			if (rankDiff !== 0) return rankDiff;
			return a.index - b.index;
		})
		.map(({ item }) => item);

	const isOwnerAuthor = createOwnerNameMatcher({
		ownerName,
		ownerEnName,
		ownerAliases,
	});

	const formatAuthors = (authors: string[]) =>
		authors.map((author, index) => {
			const isOwner = isOwnerAuthor(author);
			return (
				<span
					key={`${author}-${index}`}
					className={
						isOwner ? "font-bold text-foreground" : "text-foreground/80"
					}
				>
					{author}
					{index < authors.length - 1 && ", "}
				</span>
			);
		});

	const renderYearMonthWithSup = (value: string) => {
		const formatted = formatToYearMonth(value);
		const match = formatted.match(/^(\d{4})\.?(\d{2})$/);
		if (!match) return <>{formatted}</>;
		return (
			<>
				<span>{match[1]}</span>
				<sup className="relative top-[0.04em] ml-0.5 align-super font-semibold text-[0.7em]">
					{match[2]}
				</sup>
			</>
		);
	};

	return (
		<section className="paper-section">
			<h2 className="paper-section-title">
				<Icon
					icon="mingcute:book-6-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.copyrights")}
			</h2>

			<div className="flex flex-col gap-y-2">
				{sortedItems.map((copyright, index) => (
					<div
						key={`${copyright.title}-${copyright.year}-${index}`}
						className="paper-body text-foreground leading-relaxed"
					>
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5">
							<span className="order-2 justify-self-end whitespace-nowrap text-right font-bold font-sans text-base text-foreground/80">
								{renderYearMonthWithSup(copyright.year)}
							</span>
							<div className="order-1 min-w-0 [&>*:not(:last-child)]:mb-0.5">
								<h3 className="font-sans font-semibold text-lg">
									{copyright.title}
								</h3>
								{copyright.holders?.length ? (
									<p className="font-serif text-base text-foreground/80">
										{formatAuthors(copyright.holders)}
									</p>
								) : null}
								<p className="font-serif text-base text-foreground/80">
									{copyright.status} · {copyright.country}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
