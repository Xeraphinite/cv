import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Typography utilities for multilingual content
export function getTypographyClasses(locale?: string) {
	switch (locale) {
		case "zh":
		case "zh-CN":
			return {
				title: "cv-title lang-zh font-zh-sans leading-tight tracking-zh",
				subtitle: "cv-subtitle lang-zh font-zh-sans tracking-zh",
				body: "cv-body lang-zh font-zh-serif leading-zh tracking-zh text-justify-zh cjk-text",
				meta: "cv-meta lang-zh font-zh-sans tracking-zh",
				emphasis: "emphasis-zh",
			};
		case "yue":
		case "zh-HK":
		case "zh-TW":
			return {
				title: "cv-title lang-zh font-zh-hant-sans leading-tight tracking-zh",
				subtitle: "cv-subtitle lang-zh font-zh-hant-sans tracking-zh",
				body: "cv-body lang-zh font-zh-hant-serif leading-zh tracking-zh text-justify-zh cjk-text",
				meta: "cv-meta lang-zh font-zh-hant-sans tracking-zh",
				emphasis: "emphasis-zh",
			};
		case "ja":
			return {
				title: "cv-title lang-ja font-ja-sans leading-tight tracking-ja",
				subtitle: "cv-subtitle lang-ja font-ja-sans tracking-ja",
				body: "cv-body lang-ja font-ja-serif leading-ja tracking-ja text-justify-ja cjk-text",
				meta: "cv-meta lang-ja font-ja-sans tracking-ja",
				emphasis: "emphasis-ja",
			};
		case "ko":
			return {
				title: "cv-title lang-ko font-ko-sans leading-tight tracking-ko",
				subtitle: "cv-subtitle lang-ko font-ko-sans tracking-ko",
				body: "cv-body lang-ko font-ko-serif leading-ko tracking-ko text-justify-ko",
				meta: "cv-meta lang-ko font-ko-sans tracking-ko",
				emphasis: "emphasis-ko",
			};
		case "en":
		default:
			return {
				title: "cv-title font-en-sans leading-tight tracking-en",
				subtitle: "cv-subtitle font-en-sans tracking-en",
				body: "cv-body font-en-sans leading-en tracking-en",
				meta: "cv-meta font-en-sans tracking-en",
				emphasis: "font-semibold",
			};
	}
}

export function getLanguageClass(locale?: string): string {
	switch (locale) {
		case "zh":
		case "zh-CN":
			return "text-zh";
		case "yue":
		case "zh-HK":
		case "zh-TW":
			return "text-zh-hant";
		case "ja":
			return "text-ja";
		case "ko":
			return "text-ko";
		case "en":
		default:
			return "text-en";
	}
}

export function getFontClass(
	locale?: string,
	variant: "sans" | "serif" = "sans",
): string {
	const fontMap = {
		zh: variant === "serif" ? "font-zh-serif" : "font-zh-sans",
		"zh-CN": variant === "serif" ? "font-zh-serif" : "font-zh-sans",
		yue: variant === "serif" ? "font-zh-hant-serif" : "font-zh-hant-sans",
		"zh-HK": variant === "serif" ? "font-zh-hant-serif" : "font-zh-hant-sans",
		"zh-TW": variant === "serif" ? "font-zh-hant-serif" : "font-zh-hant-sans",
		ja: variant === "serif" ? "font-ja-serif" : "font-ja-sans",
		ko: variant === "serif" ? "font-ko-serif" : "font-ko-sans",
		en: variant === "serif" ? "font-en-serif" : "font-en-sans",
	};

	return (
		fontMap[locale as keyof typeof fontMap] ||
		(variant === "serif" ? "font-en-serif" : "font-en-sans")
	);
}

// Check if locale uses CJK characters
export function isCJKLocale(locale?: string): boolean {
	return ["zh", "zh-CN", "yue", "zh-HK", "zh-TW", "ja", "ko"].includes(
		locale || "",
	);
}

// Check if locale uses vertical writing modes
export function supportsVerticalWriting(locale?: string): boolean {
	return ["zh", "zh-CN", "yue", "zh-HK", "zh-TW", "ja"].includes(locale || "");
}

// Get appropriate line height for locale
export function getLineHeight(locale?: string): string {
	switch (locale) {
		case "zh":
		case "zh-CN":
		case "yue":
		case "zh-HK":
		case "zh-TW":
			return "leading-zh";
		case "ja":
			return "leading-ja";
		case "ko":
			return "leading-ko";
		case "en":
		default:
			return "leading-en";
	}
}

// Get appropriate letter spacing for locale
export function getLetterSpacing(locale?: string): string {
	switch (locale) {
		case "zh":
		case "zh-CN":
		case "yue":
		case "zh-HK":
		case "zh-TW":
			return "tracking-zh";
		case "ja":
			return "tracking-ja";
		case "ko":
			return "tracking-ko";
		case "en":
		default:
			return "tracking-en";
	}
}
