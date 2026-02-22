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
		<section className="paper-section">
			<h2 className="paper-section-title">
				<Icon
					icon="mingcute:medal-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{t("sections.awards")}
			</h2>

			<div className="flex flex-col gap-y-2">
				{data.map((award, index) => (
					<div
						key={`${award.name}-${award.institute}-${index}`}
						className="paper-card transition-all duration-300"
					>
						<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1.5 md:grid-cols-[minmax(12ch,auto)_minmax(0,1fr)] md:gap-y-1">
							<p className="paper-meta !text-sm !font-bold order-2 justify-self-end text-right font-sans text-foreground/80 leading-tight md:order-1 md:justify-self-start md:text-left">
								{renderAwardDate(award.date)}
							</p>
							<div className="order-1 min-w-0 md:order-2 [&>*:not(:last-child)]:mb-1.5 md:[&>*:not(:last-child)]:mb-1">
								<p className="paper-subtitle">
									<span className="font-medium text-base">{award.name}</span>
								</p>
								<p className="font-serif text-foreground/80 text-sm leading-[1.45]">
									{award.institute}
								</p>
								{award.description ? (
									<p className="paper-body text-foreground/80 text-sm">
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
