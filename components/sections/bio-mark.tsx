"use client";

import { Icon } from "@iconify/react";
import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BioMarkEffect =
	| "research"
	| "drift"
	| "craft"
	| "beat"
	| "graduate";

interface BioMarkProps extends HTMLAttributes<HTMLSpanElement> {
	icon: string;
	effect?: BioMarkEffect;
}

const TAP_ANIMATION_DURATION_MS = 720;

/**
 * A data-driven inline phrase with a decorative icon and a small hover/tap motion.
 * Use it from About MDX as `<BioMark icon="mingcute:..." effect="craft">…</BioMark>`.
 */
export function BioMark({
	children,
	className,
	effect = "craft",
	icon,
	...props
}: BioMarkProps) {
	const [isTapped, setIsTapped] = useState(false);
	const animationFrameRef = useRef<number | null>(null);
	const timeoutRef = useRef<number | null>(null);

	useEffect(
		() => () => {
			if (animationFrameRef.current !== null) {
				window.cancelAnimationFrame(animationFrameRef.current);
			}
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
			}
		},
		[],
	);

	const replayTapAnimation = () => {
		if (animationFrameRef.current !== null) {
			window.cancelAnimationFrame(animationFrameRef.current);
		}
		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
		}

		setIsTapped(false);
		animationFrameRef.current = window.requestAnimationFrame(() => {
			setIsTapped(true);
			timeoutRef.current = window.setTimeout(
				() => setIsTapped(false),
				TAP_ANIMATION_DURATION_MS,
			);
		});
	};

	return (
		<span
			{...props}
			className={cn("cv-bio-mark", `cv-bio-mark--${effect}`, className)}
			data-active={isTapped ? "true" : undefined}
			onPointerDown={replayTapAnimation}
		>
			<span className="cv-bio-mark-text">{children}</span>
			{"\u2060"}
			<Icon aria-hidden="true" className="cv-bio-mark-icon" icon={icon} />
		</span>
	);
}
