import Link from "next/link";
import type { Metadata } from "next";
import { MarkdownText } from "@/components/ui/markdown-text";
import { appConfig } from "@/lib/config/app-config";
import { type Locale, localeLabels, locales } from "@/i18n";
import { createLocalizedPath } from "@/lib/i18n-utils";
import privacyDefault from "@/data/privacy/statement.md";
import privacyJa from "@/data/privacy/statement.ja.md";
import privacyZh from "@/data/privacy/statement.zh.md";

const privacyTitles: Record<Locale, string> = {
	en: "Privacy Statement",
	zh: "隐私说明",
	ja: "プライバシー声明",
};

const privacyStatements: Record<Locale, string> = {
	en: privacyDefault,
	zh: privacyZh,
	ja: privacyJa,
};

function loadPrivacyStatement(locale: Locale): string {
	return privacyStatements[locale] ?? privacyDefault;
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const title = privacyTitles[localeTyped] || privacyTitles.en;

	return {
		title: `${title} | ${appConfig.site.namesByLocale[localeTyped]}`,
		description: "Privacy and analytics statement for this CV website.",
	};
}

export default async function PrivacyStatementPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const title = privacyTitles[localeTyped] || privacyTitles.en;
	const homePath =
		localeTyped === appConfig.intl.defaultLocale ? "/" : `/${localeTyped}`;
	const privacyPath =
		localeTyped === appConfig.intl.defaultLocale
			? "/privacy"
			: `/${localeTyped}/privacy`;
	const statementMarkdown = loadPrivacyStatement(localeTyped);

	return (
		<main className="min-h-screen bg-background">
			<div className="paper-container py-4 sm:py-6 lg:py-8">
				<article className="paper-card px-0">
					<section id="privacy-statement" className="mb-5 sm:mb-6 lg:mb-8">
						<div className="mb-3 sm:mb-4">
							<h1 className="paper-section-title">{title}</h1>
							<nav
								aria-label="Language"
								className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-foreground/80 text-sm"
							>
								{locales.map((supportedLocale, index) => {
									const href = createLocalizedPath(
										privacyPath,
										supportedLocale,
									);
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
						</div>

						<div className="space-y-4 text-foreground/85 text-sm leading-relaxed">
							<MarkdownText
								content={statementMarkdown}
								className="[&_h2:first-child]:mt-0 [&_h2]:mt-4 [&_h2]:font-sans [&_h2]:font-semibold [&_h2]:text-base [&_h2]:text-foreground [&_li+li]:mt-1 [&_ul]:mt-2"
							/>
						</div>
					</section>
				</article>

				<div className="mb-3 sm:mb-4">
					<Link
						href={homePath}
						className="font-sans text-foreground/80 text-sm underline decoration-dashed underline-offset-2 hover:text-foreground hover:decoration-solid"
					>
						Back to CV
					</Link>
				</div>
			</div>
		</main>
	);
}
