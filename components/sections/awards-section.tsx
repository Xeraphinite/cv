"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import { MarkdownText } from "@/components/ui/markdown-text";
import { formatToYearMonth } from "@/lib/date-format";

interface AwardItem {
	name: string;
	institute: string;
	date: string;
	description?: string;
}

interface AwardsSectionProps {
	data: AwardItem[];
}

export function AwardsSection({ data }: AwardsSectionProps) {
	const t = useTranslations();

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

	const renderAwardDate = (value: string) => {
		const trimmed = value.trim();
		const rangeMatch = trimmed.match(
			/^(\d{4}(?:[./-]\d{1,2})?)\s*[-–—~〜]\s*(\d{4}(?:[./-]\d{1,2})?|present|current|至今|現在|현재)$/i,
		);
		if (!rangeMatch) {
			return renderYearMonthWithSup(trimmed);
		}
		return (
			<>
				{renderYearMonthWithSup(rangeMatch[1])} -{" "}
				{renderYearMonthWithSup(rangeMatch[2])}
			</>
		);
	};

	if (!data || data.length === 0) return null;

	return (
		<section className="cv-section">
			<h2 className="cv-section-title">
				<Icon
					icon="mingcute:medal-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.awards")}
			</h2>

			<div className="cv-items-stack">
				{data.map((award, index) => (
					<div
						key={`${award.name}-${award.institute}-${index}`}
						className="cv-card transition-all duration-300"
					>
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1.5 md:gap-y-1">
							<p className="cv-meta cv-meta-strong order-2 justify-self-end text-right font-sans text-foreground/80 leading-tight">
								{renderAwardDate(award.date)}
							</p>
							<div className="order-1 min-w-0 [&>*:not(:last-child)]:mb-1.5 md:[&>*:not(:last-child)]:mb-1">
								<p className="cv-subtitle">
									<span className="font-medium text-lg">{award.name}</span>
								</p>
								<p className="font-serif text-base text-foreground/80 leading-[1.45]">
									{award.institute}
								</p>
								{award.description ? (
									<p className="cv-body text-base text-foreground/80">
										<MarkdownText content={award.description} inline />
									</p>
								) : null}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
