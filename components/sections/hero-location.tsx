"use client";

import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn, getFontClass } from "@/lib/utils";

interface HeroLocationProps {
	location: string;
	locale?: string;
}

const WORKPLACE_LABEL_TEXT =
	"State Key Lab of Manufacturing Technology & Equipment";
const HeroLocationMap = dynamic(
	() =>
		import("@/components/sections/hero-location-map").then(
			(module) => module.HeroLocationMap,
		),
	{ ssr: false },
);

export function HeroLocation({ location, locale }: HeroLocationProps) {
	const serifFontClass = getFontClass(locale, "serif");
	const displayLocation = location;
	const displayWorkplaceLabelText = WORKPLACE_LABEL_TEXT;
	const normalizedLocation = location.trim().toLowerCase();
	const shouldShowMap = normalizedLocation === "guangzhou, guangdong";
	const [canRenderMap, setCanRenderMap] = useState(false);
	const [hoverOpen, setHoverOpen] = useState(false);

	useEffect(() => {
		const canvas = document.createElement("canvas");
		const webglContext =
			canvas.getContext("webgl2") || canvas.getContext("webgl");
		setCanRenderMap(Boolean(webglContext));
	}, []);

	const trigger = (
		<div className="paper-contact-link group">
			<div className="relative h-4 w-4">
				<Icon
					icon="mingcute:canton-tower-line"
					className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
				/>
				<Icon
					icon="mingcute:canton-tower-fill"
					className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
				/>
			</div>
			<span className={cn(serifFontClass, "break-words")}>
				{displayLocation}
			</span>
		</div>
	);

	if (!shouldShowMap) return trigger;

	return (
		<HoverCard
			openDelay={120}
			closeDelay={120}
			open={hoverOpen}
			onOpenChange={setHoverOpen}
		>
			<HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
			<HoverCardContent
				align="start"
				side="top"
				className="w-[22rem] overflow-hidden rounded-2xl p-0"
			>
				{canRenderMap && hoverOpen ? (
					<HeroLocationMap workplaceLabel={displayWorkplaceLabelText} />
				) : (
					<div className="rounded-md border border-border/60 bg-popover p-3">
						<div className="flex items-center gap-4">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9f7a63]">
								<Icon
									icon="mingcute:mortarboard-fill"
									className="h-6 w-6 text-white"
								/>
							</div>
							<div>
								<p className="mb-1 text-foreground text-lg leading-none">
									学校
								</p>
								<p className="text-muted-foreground text-sm leading-none">
									Guangdong
								</p>
							</div>
						</div>
					</div>
				)}
			</HoverCardContent>
		</HoverCard>
	);
}
