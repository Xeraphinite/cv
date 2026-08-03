import type { Metadata } from "next";
import Link from "next/link";
import accessibilityDefault from "@/data/accessibility/statement.md";
import accessibilityJa from "@/data/accessibility/statement.ja.md";
import accessibilityZh from "@/data/accessibility/statement.zh.md";
import privacyDefault from "@/data/privacy/statement.md";
import privacyJa from "@/data/privacy/statement.ja.md";
import privacyZh from "@/data/privacy/statement.zh.md";
import { type Locale, localeLabels, locales } from "@/i18n";
import { appConfig } from "@/lib/config/app-config";
import { createLocalizedPath } from "@/lib/i18n-utils";
import { getFontClass } from "@/lib/utils";
import { AboutMarkdown } from "./about-markdown";

const pageCopy: Record<
	Locale,
	{
		title: string;
		description: string;
		accessibilityTitle: string;
		privacyTitle: string;
		backToCv: string;
	}
> = {
	en: {
		title: "About This Website",
		description:
			"Accessibility, privacy, and analytics information for this CV website.",
		accessibilityTitle: "Accessibility",
		privacyTitle: "Privacy",
		backToCv: "Back to CV",
	},
	zh: {
		title: "关于本网站",
		description: "本简历网站的无障碍、隐私与访问统计说明。",
		accessibilityTitle: "无障碍",
		privacyTitle: "隐私",
		backToCv: "返回简历",
	},
	ja: {
		title: "このウェブサイトについて",
		description:
			"この履歴書サイトのアクセシビリティ、プライバシー、アクセス解析に関する情報です。",
		accessibilityTitle: "アクセシビリティ",
		privacyTitle: "プライバシー",
		backToCv: "履歴書に戻る",
	},
};

const accessibilityStatements: Record<Locale, string> = {
	en: accessibilityDefault,
	zh: accessibilityZh,
	ja: accessibilityJa,
};

const privacyStatements: Record<Locale, string> = {
	en: privacyDefault,
	zh: privacyZh,
	ja: privacyJa,
};

function demoteSectionHeadings(markdown: string): string {
	return markdown.replace(/^## /gm, "### ");
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const copy = pageCopy[localeTyped] ?? pageCopy.en;

	return {
		title: `${copy.title} | ${appConfig.site.namesByLocale[localeTyped]}`,
		description: copy.description,
	};
}

export default async function AboutWebsitePage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const copy = pageCopy[localeTyped] ?? pageCopy.en;
	const homePath = createLocalizedPath("/", localeTyped);
	const serifFontClass = getFontClass(localeTyped, "serif");
	const markdownClassName =
		"[&_h3]:cv-locale-sans [&_h3:first-child]:mt-0 [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:text-lg [&_li+li]:mt-1 [&_ul]:mt-2";

	return (
		<main className="min-h-screen bg-transparent">
			<div className="cv-container py-4 sm:py-6 lg:py-8">
				<article className="cv-card px-0">
					<header className="mb-5 sm:mb-6 lg:mb-8">
						<h1 className="cv-section-title">{copy.title}</h1>
						<nav
							aria-label="Language"
							className="cv-locale-sans mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-base text-foreground/80"
						>
							{locales.map((supportedLocale, index) => {
								const href = createLocalizedPath("/about", supportedLocale);
								const isActive = supportedLocale === localeTyped;

								return (
									<div key={supportedLocale} className="flex items-center">
										<Link
											href={href}
											lang={supportedLocale}
											hrefLang={supportedLocale}
											aria-current={isActive ? "page" : undefined}
											className={
												isActive
													? "font-medium text-foreground"
													: "transition-colors hover:text-foreground"
											}
										>
											{localeLabels[supportedLocale]}
										</Link>
										{index < locales.length - 1 && (
											<span className="mx-2 text-foreground/35">/</span>
										)}
									</div>
								);
							})}
						</nav>
					</header>

					<div className="cv-sections-stack">
						<section id="accessibility">
							<h2 className="cv-section-title mb-3 sm:mb-4">
								{copy.accessibilityTitle}
							</h2>
							<div
								className={`space-y-4 text-base text-foreground/85 leading-relaxed ${serifFontClass}`}
							>
								<AboutMarkdown
									content={demoteSectionHeadings(
										accessibilityStatements[localeTyped] ??
											accessibilityDefault,
									)}
									className={markdownClassName}
								/>
							</div>
						</section>

						<section id="privacy">
							<h2 className="cv-section-title mb-3 sm:mb-4">
								{copy.privacyTitle}
							</h2>
							<div
								className={`space-y-4 text-base text-foreground/85 leading-relaxed ${serifFontClass}`}
							>
								<AboutMarkdown
									content={demoteSectionHeadings(
										privacyStatements[localeTyped] ?? privacyDefault,
									)}
									className={markdownClassName}
								/>
							</div>
						</section>
					</div>
				</article>

				<div className="mb-3 sm:mb-4">
					<Link
						href={homePath}
						className="cv-locale-sans text-base text-foreground/80 underline decoration-dashed underline-offset-2 hover:text-foreground hover:decoration-solid"
					>
						{copy.backToCv}
					</Link>
				</div>
			</div>
		</main>
	);
}
