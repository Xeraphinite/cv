"use client";

import { PaperTexture } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const webGlContextAttributes = {
	alpha: false,
	antialias: false,
	powerPreference: "low-power" as const,
};

const themeColors = {
	light: {
		back: "#f4f2ec",
		front: "#d9d5ca",
	},
	dark: {
		back: "#191817",
		front: "#312e2a",
	},
} as const;

export function PaperBackground() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const colors =
		resolvedTheme === "dark" ? themeColors.dark : themeColors.light;

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<div aria-hidden="true" className="cv-paper-background">
			{mounted ? (
				<PaperTexture
					className="h-full w-full"
					colorBack={colors.back}
					colorFront={colors.front}
					contrast={0.18}
					roughness={0.34}
					fiber={0.14}
					fiberSize={0.24}
					crumples={0.1}
					crumpleSize={0.32}
					folds={0.08}
					foldCount={4}
					drops={0.06}
					fade={0.28}
					seed={4.8}
					scale={0.7}
					fit="cover"
					minPixelRatio={1}
					maxPixelCount={1_500_000}
					webGlContextAttributes={webGlContextAttributes}
				/>
			) : null}
		</div>
	);
}
