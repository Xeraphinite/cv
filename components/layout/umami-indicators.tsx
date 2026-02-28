"use client";

import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface UmamiIndicatorsProps {
	locale: string;
	shareUrl?: string;
}

type UmamiVisitorPayload = {
	visitors?: number | null;
	activeVisitors?: number | null;
};

export function UmamiIndicators({ locale, shareUrl }: UmamiIndicatorsProps) {
	const t = useTranslations();
	const [visitorCount, setVisitorCount] = useState<number | null>(null);
	const [activeVisitorCount, setActiveVisitorCount] = useState<number | null>(
		null,
	);
	const [visitorCountLoaded, setVisitorCountLoaded] = useState(false);
	const visitorCountDisplay = useMemo(() => {
		if (!visitorCountLoaded) return "...";
		if (visitorCount === null) return "--";

		return new Intl.NumberFormat(locale).format(visitorCount);
	}, [locale, visitorCount, visitorCountLoaded]);
	const activeVisitorCountDisplay = useMemo(() => {
		if (!visitorCountLoaded) return "...";
		if (activeVisitorCount === null) return "--";

		return new Intl.NumberFormat(locale).format(activeVisitorCount);
	}, [activeVisitorCount, locale, visitorCountLoaded]);
	const visitorIndicatorUnavailable =
		visitorCountLoaded && visitorCount === null;
	const onlineUserCountUnavailable =
		visitorCountLoaded && activeVisitorCount === null;

	useEffect(() => {
		let cancelled = false;

		async function loadVisitorCount() {
			try {
				const response = await fetch("/api/umami/visitors", {
					cache: "no-store",
				});
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}

				const payload = (await response.json()) as UmamiVisitorPayload;
				if (cancelled) return;

				setVisitorCount(
					typeof payload.visitors === "number" ? payload.visitors : null,
				);
				setActiveVisitorCount(
					typeof payload.activeVisitors === "number"
						? payload.activeVisitors
						: null,
				);
			} catch {
				if (cancelled) return;
				setVisitorCount(null);
				setActiveVisitorCount(null);
			} finally {
				if (!cancelled) {
					setVisitorCountLoaded(true);
				}
			}
		}

		loadVisitorCount();

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<>
			<Tooltip>
				<TooltipTrigger asChild>
					{shareUrl ? (
						<a
							href={shareUrl}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
						>
							<Icon icon="mingcute:user-3-line" className="h-3 w-3" />
							<span className="font-sans tabular-nums">
								{visitorCountDisplay}
							</span>
							<Icon icon="mingcute:arrow-right-up-fill" className="h-3 w-3" />
						</a>
					) : (
						<span className="inline-flex items-center gap-1 text-foreground/70">
							<Icon icon="mingcute:user-3-line" className="h-3 w-3" />
							<span className="font-sans tabular-nums">
								{visitorCountDisplay}
							</span>
						</span>
					)}
				</TooltipTrigger>
				<TooltipContent side="top">
					<span>
						{visitorIndicatorUnavailable
							? t("footer.visitorNumbersUnavailable")
							: t("footer.visitorNumbers")}
					</span>
				</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					{shareUrl ? (
						<a
							href={shareUrl}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
						>
							<Icon
								icon="mingcute:world-line"
								className={clsx(
									"h-3 w-3",
									onlineUserCountUnavailable
										? "text-foreground/60"
										: "text-emerald-600 dark:text-emerald-400",
								)}
							/>
							<span className="font-sans tabular-nums">
								{activeVisitorCountDisplay}
							</span>
							<Icon icon="mingcute:arrow-right-up-fill" className="h-3 w-3" />
						</a>
					) : (
						<span className="inline-flex items-center gap-1 text-foreground/70">
							<Icon
								icon="mingcute:world-line"
								className={clsx(
									"h-3 w-3",
									onlineUserCountUnavailable
										? "text-foreground/60"
										: "text-emerald-600 dark:text-emerald-400",
								)}
							/>
							<span className="font-sans tabular-nums">
								{activeVisitorCountDisplay}
							</span>
						</span>
					)}
				</TooltipTrigger>
				<TooltipContent side="top">
					<span>
						{onlineUserCountUnavailable
							? t("footer.onlineNowUnavailable")
							: t("footer.onlineNow")}
					</span>
				</TooltipContent>
			</Tooltip>
		</>
	);
}
