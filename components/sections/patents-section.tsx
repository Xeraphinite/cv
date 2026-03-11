"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { formatToYearMonth } from "@/lib/date-format";
import { createOwnerNameMatcher } from "./author-name-utils";

interface PatentItem {
	number: string;
	title: string;
	filed: string;
	status: string;
	country: string;
	inventors: string[];
}

interface PatentsSectionProps {
	data: PatentItem[];
	ownerName?: string;
	ownerEnName?: string;
	ownerAliases?: string[];
}

export function PatentsSection({
	data,
	ownerName,
	ownerEnName,
	ownerAliases = [],
}: PatentsSectionProps) {
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
			const rankDiff =
				parseDateRank(b.item.filed) - parseDateRank(a.item.filed);
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

	const formatPatentNumber = (country: string, number: string) => {
		const normalizedCountry = country.trim();
		const normalizedNumber = number.trim();
		if (normalizedCountry && normalizedNumber) {
			return `${normalizedCountry} ${normalizedNumber}`;
		}
		return normalizedCountry || normalizedNumber;
	};

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
		<section className="cv-section">
			<h2 className="cv-section-title">
				<Icon
					icon="mingcute:light-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.patents")}
			</h2>

			<div className="cv-items-stack">
				{sortedItems.map((patent, index) => (
					<div
						key={`${patent.number}-${patent.title}-${index}`}
						className="cv-body text-foreground leading-relaxed"
					>
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-1.5">
							<span className="cv-locale-sans order-2 justify-self-end whitespace-nowrap text-right font-bold text-base text-foreground/80">
								{renderYearMonthWithSup(patent.filed)}
							</span>
							<div className="order-1 min-w-0 [&>*:not(:last-child)]:mb-0.5">
								<h3 className="cv-locale-sans font-semibold text-lg">
									{patent.title}
								</h3>
								{patent.inventors?.length ? (
									<p className="cv-locale-serif text-base text-foreground/80">
										{formatAuthors(patent.inventors)}
									</p>
								) : null}
								<p className="cv-locale-serif text-base text-foreground/80">
									{patent.status}
									{formatPatentNumber(patent.country, patent.number)
										? ` · ${formatPatentNumber(patent.country, patent.number)}`
										: ""}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
