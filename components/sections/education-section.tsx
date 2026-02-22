"use client";

import { Icon } from "@iconify/react";
import {
	useSectionTranslations,
	useLabelTranslations,
} from "@/hooks/use-translations";
import { formatToYearMonth } from "@/lib/date-format";
import type { EducationItem, EducationSectionConfig } from "@/lib/types/cv";

interface EducationSectionProps {
	data: EducationItem[];
	config?: EducationSectionConfig;
}

const EXPECTED_FALLBACK_TOKENS = [
	"expected",
	"预计",
	"預計",
	"予定",
	"예정",
] as const;

export function EducationSection({ data, config }: EducationSectionProps) {
	const tSection = useSectionTranslations();
	const tLabel = useLabelTranslations();
	const splitExpectedLine = config?.splitExpectedLine ?? true;

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

	if (!data || data.length === 0) return null;

	const normalizeExpectedToken = (value: string) => value.trim().toLowerCase();

	const splitExpectedLabel = (
		value: string,
	): { main: string; expected?: string } => {
		if (!splitExpectedLine) {
			return { main: value.trim() };
		}

		const trimmed = value.trim();
		const match = trimmed.match(
			/^(.*?)[\s\u3000]*([\(（])\s*(.+?)\s*([\)）])$/,
		);
		if (!match) return { main: trimmed };

		const rawExpectedToken = normalizeExpectedToken(match[3]);
		const localizedExpectedToken = normalizeExpectedToken(tLabel("expected"));
		const expectedTokens = new Set<string>([
			localizedExpectedToken,
			...EXPECTED_FALLBACK_TOKENS,
		]);

		if (!expectedTokens.has(rawExpectedToken)) {
			return { main: trimmed };
		}

		return { main: match[1].trim(), expected: `(${tLabel("expected")})` };
	};

	return (
		<section className="paper-section">
			<h2 className="paper-section-title">
				<Icon
					icon="mingcute:mortarboard-fill"
					className="mr-3 inline-block size-[1em] align-[-0.12em] text-primary"
				/>
				{tSection("education")}
			</h2>

			<div className="[&>*:not(:last-child)]:mb-2.5">
				{data.map((education, index) => {
					const endDateParts = splitExpectedLabel(education.endDate);
					return (
						<div
							key={`${education.institution}-${education.degree}-${index}`}
							className="paper-card transition-all duration-300"
						>
							<div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1.5 md:grid-cols-[minmax(12ch,auto)_minmax(0,1fr)] md:gap-y-1">
								<p className="paper-meta !text-sm !font-bold order-2 justify-self-end text-right font-sans text-foreground/80 leading-tight md:order-1 md:justify-self-start md:text-left">
									<span className="block whitespace-nowrap">
										{renderYearMonthWithSup(education.startDate)}
										<span className="mx-1">-</span>
										{renderYearMonthWithSup(endDateParts.main)}
									</span>
									{endDateParts.expected ? (
										<span className="block whitespace-nowrap">
											{endDateParts.expected}
										</span>
									) : null}
								</p>
								<div className="order-1 min-w-0 md:order-2 [&>*:not(:last-child)]:mb-1.5 md:[&>*:not(:last-child)]:mb-1">
									{/* Institution and Degree */}
									<div>
										<h3 className="paper-subtitle mb-1">
											{education.institution}
										</h3>
										<p className="paper-body font-medium">
											{education.degree} {tLabel("in")} {education.area}
										</p>
									</div>

									{/* Duration and Supervisor */}
									<div className="paper-meta flex flex-wrap gap-x-4 gap-y-1">
										{education.supervisor && (
											<div className="flex items-center gap-2">
												<Icon icon="mingcute:user-3-line" className="h-4 w-4" />
												<span>
													{tLabel("supervisor")}: {education.supervisor}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
