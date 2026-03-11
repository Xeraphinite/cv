"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { locales, localeLabels } from "@/i18n";
import { createLocalizedPath, getLocaleFromPathname } from "@/lib/i18n-utils";
import { UmamiIndicators } from "./umami-indicators";

interface CVFooterProps {
	className?: string;
	compact?: boolean;
	showLocaleThemeControls?: boolean;
	lastUpdated?: string;
}

const languageFlags: Record<string, string> = {
	en: "twemoji:flag-united-states",
	zh: "twemoji:flag-china",
	yue: "twemoji:flag-hong-kong-sar-china",
	ja: "twemoji:flag-japan",
	ko: "twemoji:flag-south-korea",
};

export function CVFooter({
	className,
	compact = false,
	showLocaleThemeControls = false,
	lastUpdated,
}: CVFooterProps) {
	const t = useTranslations();
	const pathname = usePathname();
	const currentLocale = getLocaleFromPathname(pathname);
	const umamiShareUrl = process.env.NEXT_PUBLIC_UMAMI_SHARE_URL;
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
	const accessibilityHref = createLocalizedPath(
		"/accessibility",
		currentLocale || "en",
	);
	const llmsHref = createLocalizedPath("/llms.txt", currentLocale || "en");
	const privacyHref = createLocalizedPath("/privacy", currentLocale || "en");
	const copyrightYear = useMemo(() => {
		const currentDate = new Date(now);
		if (!Number.isNaN(currentDate.getTime())) return currentDate.getFullYear();
		const parsedUpdatedAt = lastUpdated ? new Date(lastUpdated) : null;
		if (parsedUpdatedAt && !Number.isNaN(parsedUpdatedAt.getTime())) {
			return parsedUpdatedAt.getFullYear();
		}
		return 2026;
	}, [lastUpdated, now]);
	const copyrightText = `© ${copyrightYear} Xeraphinite. All rights reserved.`;
	const currentLocaleLabel = localeLabels[currentLocale || "en"];

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
				"mx-auto mt-14 max-w-2xl border-border/30 border-t bg-background/60 backdrop-blur-sm sm:mt-12",
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
					<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
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

						<UmamiIndicators
							locale={currentLocale || "en"}
							shareUrl={umamiShareUrl}
						/>

						{showLocaleThemeControls && (
							<>
								<DropdownMenu modal={false}>
									<Tooltip>
										<TooltipTrigger asChild>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-7 flex-row gap-1.5 px-2 hover:bg-muted/50"
													aria-label={t("common.language")}
												>
													<Icon
														icon={languageFlags[currentLocale || "en"]}
														className="h-3.5 w-3.5"
													/>
													<span className="cv-locale-sans text-sm">
														{currentLocale?.toUpperCase() || "EN"}
													</span>
												</Button>
											</DropdownMenuTrigger>
										</TooltipTrigger>
										<TooltipContent side="top">
											<span>
												{t("tooltips.footer.language", {
													language: currentLocaleLabel,
												})}
											</span>
										</TooltipContent>
									</Tooltip>
									<DropdownMenuContent
										align="end"
										className="w-40"
										sideOffset={8}
									>
										{locales.map((locale) => {
											const href = createLocalizedPath(pathname, locale);
											const isActive = currentLocale === locale;

											return (
												<DropdownMenuItem key={locale} asChild>
													<Link
														href={href}
														className={clsx(
															"flex w-full cursor-pointer items-center gap-2",
															isActive
																? "bg-primary/10 font-medium text-primary"
																: "hover:bg-muted/50",
														)}
													>
														<Icon
															icon={languageFlags[locale]}
															className="h-4 w-4"
														/>
														{localeLabels[locale]}
													</Link>
												</DropdownMenuItem>
											);
										})}
									</DropdownMenuContent>
								</DropdownMenu>
							</>
						)}
					</div>

					<div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-foreground/75">
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={llmsHref}
									className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
								>
									<Icon icon="mingcute:ai-line" className="h-3 w-3" />
									<span>{t("footer.llmsTxt")}</span>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="top">
								<span>{t("tooltips.footer.llmsTxt")}</span>
							</TooltipContent>
						</Tooltip>
						<span>·</span>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={accessibilityHref}
									className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
								>
									<Icon icon="mingcute:wheelchair-line" className="h-3 w-3" />
									{t("footer.accessibilityStatement")}
								</Link>
							</TooltipTrigger>
							<TooltipContent side="top">
								<span>{t("tooltips.footer.accessibility")}</span>
							</TooltipContent>
						</Tooltip>
						<span>·</span>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={privacyHref}
									className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
								>
									<Icon icon="mingcute:safe-alert-line" className="h-3 w-3" />
									{t("footer.privacyStatement")}
								</Link>
							</TooltipTrigger>
							<TooltipContent side="top">
								<span>{t("tooltips.footer.privacy")}</span>
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
