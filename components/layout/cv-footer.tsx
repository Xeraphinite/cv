"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { createLocalizedPath, getLocaleFromPathname } from "@/lib/i18n-utils";
import { PreferencesControl } from "./preferences-control";

interface CVFooterProps {
	className?: string;
	compact?: boolean;
	showPreferences?: boolean;
	lastUpdated?: string;
}

export function CVFooter({
	className,
	compact = false,
	showPreferences = false,
	lastUpdated,
}: CVFooterProps) {
	const t = useTranslations();
	const pathname = usePathname();
	const currentLocale = getLocaleFromPathname(pathname);
	const [now, setNow] = useState(() => Date.now());

	const { relativeUpdated, updateToneClass } = useMemo(() => {
		const locale = currentLocale || "en";
		const parsedUpdatedAt = lastUpdated ? new Date(lastUpdated) : null;
		const safeDate =
			parsedUpdatedAt && !Number.isNaN(parsedUpdatedAt.getTime())
				? parsedUpdatedAt
				: new Date(now);
		const diffMs = safeDate.getTime() - now;
		const elapsedMs = Math.max(0, now - safeDate.getTime());

		const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
			["year", 1000 * 60 * 60 * 24 * 365],
			["month", 1000 * 60 * 60 * 24 * 30],
			["week", 1000 * 60 * 60 * 24 * 7],
			["day", 1000 * 60 * 60 * 24],
			["hour", 1000 * 60 * 60],
			["minute", 1000 * 60],
		];

		const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
		let text = rtf.format(0, "minute");

		for (const [unit, ms] of ranges) {
			if (Math.abs(diffMs) >= ms || unit === "minute") {
				text = rtf.format(Math.round(diffMs / ms), unit);
				break;
			}
		}

		let toneClass = "text-foreground/80";
		if (elapsedMs < 1000 * 60 * 30) {
			toneClass = "text-foreground";
		} else if (elapsedMs < 1000 * 60 * 60 * 6) {
			toneClass = "text-foreground/85";
		} else if (elapsedMs < 1000 * 60 * 60 * 24) {
			toneClass = "text-foreground/80";
		} else if (elapsedMs < 1000 * 60 * 60 * 24 * 7) {
			toneClass = "text-foreground/80";
		} else if (elapsedMs < 1000 * 60 * 60 * 24 * 30) {
			toneClass = "text-foreground/80";
		}

		return { relativeUpdated: text, updateToneClass: toneClass };
	}, [currentLocale, lastUpdated, now]);
	const aboutWebsiteHref = createLocalizedPath("/about", currentLocale || "en");
	const forRobotsHref = createLocalizedPath("/llms.txt", currentLocale || "en");
	const copyrightYear = useMemo(() => {
		const currentDate = new Date(now);
		if (!Number.isNaN(currentDate.getTime())) {
			return currentDate.getFullYear();
		}
		const parsedUpdatedAt = lastUpdated ? new Date(lastUpdated) : null;
		if (parsedUpdatedAt && !Number.isNaN(parsedUpdatedAt.getTime())) {
			return parsedUpdatedAt.getFullYear();
		}
		return 2026;
	}, [lastUpdated, now]);
	const copyrightText = `© ${copyrightYear} Xeraphinite. All rights reserved.`;
	useEffect(() => {
		setNow(Date.now());
		const interval = window.setInterval(() => {
			setNow(Date.now());
		}, 60_000);

		return () => {
			window.clearInterval(interval);
		};
	}, []);

	return (
		<footer
			className={clsx(
				"mx-auto mt-14 max-w-2xl border-border/30 border-t bg-transparent sm:mt-12",
				className,
			)}
		>
			<TooltipProvider delayDuration={120}>
				<div
					className={clsx(
						"px-4 text-foreground/80 text-sm",
						compact ? "pt-0 pb-2" : "pt-7 pb-5 sm:pt-6 sm:pb-3",
					)}
				>
					<div className="flex flex-nowrap items-center justify-center gap-x-1 whitespace-nowrap">
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center gap-1.5">
									<Icon icon="mingcute:calendar-line" className="h-3 w-3" />
									<span className={clsx("transition-colors", updateToneClass)}>
										{relativeUpdated}
									</span>
								</div>
							</TooltipTrigger>
							<TooltipContent side="top">
								<span>{t("tooltips.footer.lastUpdated")}</span>
							</TooltipContent>
						</Tooltip>

						{showPreferences ? <PreferencesControl /> : null}
					</div>

					<div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-foreground/75">
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={forRobotsHref}
									className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
								>
									<Icon icon="mingcute:robot-line" className="h-3 w-3" />
									<span>{t("footer.forRobots")}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="top">
								<span>{t("tooltips.footer.forRobots")}</span>
							</TooltipContent>
						</Tooltip>
						<span>·</span>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={aboutWebsiteHref}
									className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
								>
									<Icon icon="mingcute:information-line" className="h-3 w-3" />
									{t("footer.aboutWebsite")}
								</Link>
							</TooltipTrigger>
							<TooltipContent side="top">
								<span>{t("tooltips.footer.aboutWebsite")}</span>
							</TooltipContent>
						</Tooltip>
					</div>

					<div className="mt-2 text-center">
						<span className="whitespace-nowrap text-foreground/80">
							{copyrightText}
						</span>
					</div>
				</div>
			</TooltipProvider>
		</footer>
	);
}
