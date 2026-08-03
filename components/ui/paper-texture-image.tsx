"use client";

import { PaperTexture } from "@paper-design/shaders-react";
import Image, { type ImageProps } from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const webGlContextAttributes = {
	alpha: false,
	antialias: false,
	powerPreference: "low-power" as const,
};

const themeColors = {
	light: {
		back: "#f4f2ec",
		front: "#aaa59b",
	},
	dark: {
		back: "#191817",
		front: "#918b84",
	},
} as const;

const shaderRemoteHosts = new Set([
	"avatars.githubusercontent.com",
	"cdn.bsky.app",
]);

function getShaderImageSource(src: string): string | null {
	try {
		const url = new URL(src);
		if (shaderRemoteHosts.has(url.hostname)) {
			return `/api/image-proxy?url=${encodeURIComponent(src)}`;
		}
		if (url.protocol !== "data:") {
			return null;
		}
	} catch {
		return src;
	}

	return src;
}

interface PaperTextureImageProps {
	src: string;
	alt: string;
	sizes: string;
	className?: string;
	imageClassName?: string;
	priority?: boolean;
	quality?: number;
	blurDataURL?: string;
	unoptimized?: boolean;
	fallbackSrc?: string;
	onError?: ImageProps["onError"];
}

export function PaperTextureImage({
	src,
	alt,
	sizes,
	className,
	imageClassName,
	priority,
	quality = 85,
	blurDataURL,
	unoptimized,
	fallbackSrc,
	onError,
}: PaperTextureImageProps) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [imageSource, setImageSource] = useState(src);
	const colors =
		resolvedTheme === "dark" ? themeColors.dark : themeColors.light;
	const shaderImageSource = getShaderImageSource(imageSource);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		setImageSource(src);
	}, [src]);

	return (
		<span className={cn("relative block overflow-hidden", className)}>
			<Image
				src={imageSource}
				alt={alt}
				fill
				sizes={sizes}
				quality={quality}
				priority={priority}
				unoptimized={unoptimized}
				placeholder={blurDataURL ? "blur" : undefined}
				blurDataURL={blurDataURL}
				className={cn("object-cover", imageClassName)}
				onError={(event) => {
					if (fallbackSrc && imageSource !== fallbackSrc) {
						setImageSource(fallbackSrc);
					}
					onError?.(event);
				}}
			/>

			{mounted && shaderImageSource ? (
				<PaperTexture
					key={shaderImageSource}
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 z-10 h-full w-full"
					image={shaderImageSource}
					colorBack={colors.back}
					colorFront={colors.front}
					contrast={0.14}
					roughness={0.32}
					fiber={0.13}
					fiberSize={0.24}
					crumples={0.08}
					crumpleSize={0.3}
					folds={0.1}
					foldCount={4}
					drops={0.04}
					fade={0.22}
					seed={4.8}
					scale={1}
					fit="cover"
					minPixelRatio={1}
					maxPixelCount={400_000}
					webGlContextAttributes={webGlContextAttributes}
				/>
			) : null}
		</span>
	);
}
