import statementDefault from "@/data/statement.md";
import statementJa from "@/data/statement.ja.md";
import statementZh from "@/data/statement.zh.md";
import { defaultLocale, type Locale, locales } from "@/i18n";

const statements: Record<Locale, string> = {
	en: statementDefault,
	zh: statementZh,
	ja: statementJa,
};

export interface SiteStatementSection {
	title: string;
	content: string;
}

function normalizeLocale(locale?: string): Locale {
	if (locale && locales.includes(locale as Locale)) {
		return locale as Locale;
	}

	return defaultLocale;
}

export function getSiteStatement(locale?: string): string {
	return statements[normalizeLocale(locale)];
}

export function getSiteStatementSections(
	locale?: string,
): SiteStatementSection[] {
	return getSiteStatement(locale)
		.trim()
		.split(/^## /m)
		.filter(Boolean)
		.map((section) => {
			const [title, ...contentLines] = section.split("\n");

			return {
				title: title.trim(),
				content: contentLines.join("\n").trim(),
			};
		});
}

export function createMarkdownResponse(body: string) {
	return new Response(body, {
		headers: {
			"content-type": "text/markdown; charset=utf-8",
		},
	});
}
