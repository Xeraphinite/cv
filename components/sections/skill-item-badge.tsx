"use client";

import { Icon } from "@iconify/react";
import { Badge } from "@/components/ui/badge";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MarkdownText } from "@/components/ui/markdown-text";
import { cn } from "@/lib/utils";

export interface SkillItemBadgeData {
	text: string;
	icon?: string;
	url?: string;
	code?: boolean;
	description?: string;
	fontFamily?: "sans" | "serif";
}

interface SkillItemBadgeProps {
	item: SkillItemBadgeData;
}

function getFaviconUrl(url: string): string | undefined {
	try {
		const parsed = new URL(url);
		return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
	} catch {
		return undefined;
	}
}

function SkillBadgeContent({ item }: SkillItemBadgeProps) {
	const resolvedFavicon = item.url ? getFaviconUrl(item.url) : undefined;

	return (
		<Badge
			variant="secondary"
			className={cn(
				"h-auto shrink-0 gap-2 whitespace-nowrap rounded-full border border-transparent bg-muted/80 px-3 py-1.5 font-medium text-base text-foreground/90 transition-all duration-200 hover:-translate-y-0.5 hover:border-border/60 hover:bg-muted hover:text-foreground hover:shadow-sm",
				item.code
					? "font-mono"
					: item.fontFamily === "serif"
						? "font-serif"
						: "font-sans",
			)}
		>
			{item.icon ? (
				<Icon icon={item.icon} className="h-3.5 w-3.5 shrink-0" />
			) : (
				resolvedFavicon && (
					<img
						src={resolvedFavicon}
						alt=""
						aria-hidden="true"
						className="h-3.5 w-3.5 shrink-0 rounded-sm"
						loading="lazy"
					/>
				)
			)}
			<span>{item.text}</span>
		</Badge>
	);
}

export function SkillItemBadge({ item }: SkillItemBadgeProps) {
	const trigger = item.url ? (
		<a
			href={item.url}
			target="_blank"
			rel="noreferrer"
			className="inline-flex shrink-0 whitespace-nowrap no-underline visited:no-underline hover:no-underline focus-visible:no-underline"
		>
			<SkillBadgeContent item={item} />
		</a>
	) : (
		<span className="inline-flex shrink-0 whitespace-nowrap">
			<SkillBadgeContent item={item} />
		</span>
	);

	if (!item.description) {
		return trigger;
	}

	return (
		<HoverCard openDelay={120} closeDelay={80}>
			<HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
			<HoverCardContent
				side="top"
				className="w-72 p-3 font-sans text-base leading-relaxed"
			>
				<MarkdownText content={item.description} />
			</HoverCardContent>
		</HoverCard>
	);
}
