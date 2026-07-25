"use client";

import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
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

const MAP_ENABLED_LOCATIONS = new Set([
	"guangzhou, guangdong",
	"広州・広東",
	"광둥성 광저우",
	"广东广州",
	"廣州，廣東",
]);
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
	const normalizedLocation = location.trim().toLowerCase();
	const shouldShowMap = MAP_ENABLED_LOCATIONS.has(normalizedLocation);
	const [canRenderMap, setCanRenderMap] = useState(false);
	const [hoverOpen, setHoverOpen] = useState(false);

	useEffect(() => {
		const canvas = document.createElement("canvas");
		const webglContext =
			canvas.getContext("webgl2") || canvas.getContext("webgl");
		setCanRenderMap(Boolean(webglContext));
	}, []);

	const trigger = (
		<div className="cv-contact-link group">
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

	if (!shouldShowMap) {
		return trigger;
	}

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
				sideOffset={10}
				collisionPadding={16}
				className="w-72 overflow-hidden rounded-[2px] p-0"
			>
				{canRenderMap && hoverOpen ? (
					<HeroLocationMap locationLabel={displayLocation} />
				) : (
					<div className="flex h-20 items-center gap-3 bg-popover px-3 py-2">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9f7a63]">
							<Icon
								icon="mingcute:canton-tower-fill"
								className="h-4 w-4 text-white"
							/>
						</div>
						<p
							className={cn(
								serifFontClass,
								"min-w-0 break-words text-foreground text-sm leading-snug",
							)}
						>
							{displayLocation}
						</p>
					</div>
				)}
			</HoverCardContent>
		</HoverCard>
	);
}
