import Link from "next/link";
import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { MarkdownText } from "@/components/ui/markdown-text";
import { appConfig } from "@/lib/config/app-config";
import { type Locale, localeLabels, locales } from "@/i18n";
import { createLocalizedPath } from "@/lib/i18n-utils";

const statementTitles: Record<Locale, string> = {
	en: "Accessibility Statement",
	zh: "无障碍声明",
	ja: "アクセシビリティ声明",
};

const ACCESSIBILITY_MARKDOWN_DIR = path.join(
	process.cwd(),
	"data",
	"accessibility",
);
const DEFAULT_STATEMENT_FILE = "statement.md";

async function loadAccessibilityStatement(locale: Locale): Promise<string> {
	const candidates =
		locale === appConfig.intl.defaultLocale
			? [DEFAULT_STATEMENT_FILE]
			: [`statement.${locale}.md`, DEFAULT_STATEMENT_FILE];

	for (const fileName of candidates) {
		try {
			return await readFile(
				path.join(ACCESSIBILITY_MARKDOWN_DIR, fileName),
				"utf-8",
			);
		} catch {
			// Try next fallback file.
		}
	}

	throw new Error(
		`Accessibility statement markdown not found for locale "${locale}"`,
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const title = statementTitles[localeTyped] || statementTitles.en;

	return {
		title: `${title} | ${appConfig.site.namesByLocale[localeTyped]}`,
		description: "Accessibility statement for this CV website.",
	};
}

export default async function AccessibilityStatementPage({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const localeTyped = locale as Locale;
	const title = statementTitles[localeTyped] || statementTitles.en;
	const homePath =
		localeTyped === appConfig.intl.defaultLocale ? "/" : `/${localeTyped}`;
	const accessibilityPath =
		localeTyped === appConfig.intl.defaultLocale
			? "/accessibility"
			: `/${localeTyped}/accessibility`;
	const statementMarkdown = await loadAccessibilityStatement(localeTyped);

	return (
		<main className="min-h-screen bg-background">
			<div className="paper-container py-4 sm:py-6 lg:py-8">
				<article className="paper-card px-0">
					<section
						id="accessibility-statement"
						className="mb-5 sm:mb-6 lg:mb-8"
					>
						<div className="mb-3 sm:mb-4">
							<h1 className="paper-section-title">{title}</h1>
							<nav
								aria-label="Language"
								className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-foreground/80 text-sm"
							>
								{locales.map((supportedLocale, index) => {
									const href = createLocalizedPath(
										accessibilityPath,
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
