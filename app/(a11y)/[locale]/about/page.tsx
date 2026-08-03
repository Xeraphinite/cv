import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, localeLabels, locales } from "@/i18n";
import { appConfig } from "@/lib/config/app-config";
import { createLocalizedPath } from "@/lib/i18n-utils";
import { getSiteStatementSections } from "@/lib/site-statement";
import { getFontClass } from "@/lib/utils";
import { AboutMarkdown } from "./about-markdown";

const pageCopy: Record<
	Locale,
	{
		title: string;
		description: string;
		backToCv: string;
	}
> = {
	en: {
		title: "About This Website",
		description:
			"Accessibility, privacy, and analytics information for this CV website.",
		backToCv: "Back to CV",
	},
	zh: {
		title: "关于本网站",
		description: "本简历网站的无障碍、隐私与访问统计说明。",
		backToCv: "返回简历",
	},
	ja: {
		title: "このウェブサイトについて",
		description:
			"この履歴書サイトのアクセシビリティ、プライバシー、アクセス解析に関する情報です。",
		backToCv: "履歴書に戻る",
	},
};

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
	const statementSections = getSiteStatementSections(localeTyped);
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
						{statementSections.map((section, index) => (
							<section
								id={index === 0 ? "accessibility" : "privacy"}
								key={section.title}
							>
								<h2 className="cv-section-title mb-3 sm:mb-4">
									{section.title}
								</h2>
								<div
									className={`space-y-4 text-base text-foreground/85 leading-relaxed ${serifFontClass}`}
								>
									<AboutMarkdown
										content={section.content}
										className={markdownClassName}
									/>
								</div>
							</section>
						))}
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
