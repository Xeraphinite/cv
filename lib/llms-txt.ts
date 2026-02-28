import { defaultLocale, type Locale, locales } from "@/i18n";
import { appConfig } from "@/lib/config/app-config";
import { getBundledCVData } from "@/lib/load-cv-data-edge";

const llmsLabels = {
	en: {
		titleSuffix: "LLM Profile",
		summary: "This file provides a concise public profile for language models.",
		identity: "Identity",
		contact: "Contact",
		education: "Education",
		focusAreas: "Focus Areas",
		selectedPublications: "Selected Publications",
		notes: "Notes",
		canonicalSource:
			"Canonical profile data source for this site is `data/cv.toml` with locale overrides in `data/cv.{locale}.toml`.",
	},
	zh: {
		titleSuffix: "LLM 档案",
		summary: "该文件为语言模型提供简明的公开个人档案。",
		identity: "身份",
		contact: "联系方式",
		education: "教育经历",
		focusAreas: "关注方向",
		selectedPublications: "代表性论文",
		notes: "说明",
		canonicalSource:
			"本站档案主数据源为 `data/cv.toml`，并通过 `data/cv.{locale}.toml` 提供本地化覆盖。",
	},
	ja: {
		titleSuffix: "LLM プロフィール",
		summary: "このファイルは、言語モデル向けの簡潔な公開プロフィールです。",
		identity: "プロフィール",
		contact: "連絡先",
		education: "学歴",
		focusAreas: "注力分野",
		selectedPublications: "主要論文",
		notes: "備考",
		canonicalSource:
			"このサイトのプロフィールの正本データは `data/cv.toml` で、ローカライズ上書きは `data/cv.{locale}.toml` を使用します。",
	},
} as const satisfies Record<
	Locale,
	{
		titleSuffix: string;
		summary: string;
		identity: string;
		contact: string;
		education: string;
		focusAreas: string;
		selectedPublications: string;
		notes: string;
		canonicalSource: string;
	}
>;

function isLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

function normalizeLocale(locale?: string): Locale {
	if (locale && isLocale(locale)) {
		return locale;
	}

	return defaultLocale;
}

function compact(value?: string) {
	return value?.replace(/\s+/g, " ").trim() ?? "";
}

function formatEducationLine(item: {
	institution: string;
	area: string;
	degree: string;
	startDate: string;
	endDate: string;
}) {
	const degreeLabel = compact(
		[item.degree, item.area].filter(Boolean).join(", "),
	);
	const dateLabel = compact(
		[item.startDate, item.endDate].filter(Boolean).join(" - "),
	);

	return [degreeLabel, item.institution, dateLabel].filter(Boolean).join(", ");
}

function formatPublicationLine(item: {
	authors: string[];
	title: string;
	publishedIn: string;
	doi?: string;
	year?: string;
}) {
	const authors = item.authors.length > 0 ? `${item.authors.join(", ")}. ` : "";
	const venue = compact(item.publishedIn);
	const year = compact(item.year);
	const doi = compact(item.doi);
	const metadata = [venue, year ? `(${year})` : "", doi ? `DOI: ${doi}` : ""]
		.filter(Boolean)
		.join(". ");

	return `${authors}"${item.title}."${metadata ? ` ${metadata}` : ""}`.trim();
}

export async function buildLlmsText(inputLocale?: string) {
	const locale = normalizeLocale(inputLocale);
	const labels = llmsLabels[locale];
	const cv = await getBundledCVData(locale);
	const displayName = compact(cv.hero.enName || cv.hero.name) || "Unknown";
	const aliases = cv.hero.aliases?.map(compact).filter(Boolean) ?? [];
	const website = compact(
		cv.hero.social.website || appConfig.site.metadataBase,
	);
	const education = cv.education
		.map(formatEducationLine)
		.filter(Boolean)
		.map((line) => `- ${line}`);
	const focusAreas = cv.experience
		.slice(0, 3)
		.map((item) => compact(item.position || item.summary))
		.filter(Boolean)
		.map((line) => `- ${line}`);
	const publications = cv.publications
		.slice(0, 2)
		.map(formatPublicationLine)
		.filter(Boolean)
		.map((line) => `- ${line}`);

	const lines = [
		`# ${displayName} - ${labels.titleSuffix}`,
		"",
		labels.summary,
		"",
		`## ${labels.identity}`,
		`- Name: ${compact(cv.hero.name)}`,
		...(cv.hero.enName && cv.hero.enName !== cv.hero.name
			? [`- English Name: ${compact(cv.hero.enName)}`]
			: []),
		...(aliases.length > 0 ? [`- Alias: ${aliases.join(", ")}`] : []),
		...(cv.hero.location ? [`- Location: ${compact(cv.hero.location)}`] : []),
		...(cv.hero.position ? [`- Headline: ${compact(cv.hero.position)}`] : []),
		"",
		`## ${labels.contact}`,
		...(cv.hero.social.email
			? [`- Email: ${compact(cv.hero.social.email)}`]
			: []),
		...(website ? [`- Website: ${website}`] : []),
		...(cv.hero.social.github
			? [`- GitHub: ${compact(cv.hero.social.github)}`]
			: []),
		"",
		`## ${labels.education}`,
		...(education.length > 0 ? education : ["- N/A"]),
		"",
		`## ${labels.focusAreas}`,
		...(focusAreas.length > 0 ? focusAreas : ["- N/A"]),
		"",
		`## ${labels.selectedPublications}`,
		...(publications.length > 0 ? publications : ["- N/A"]),
		"",
		`## ${labels.notes}`,
		`- ${labels.canonicalSource}`,
	];

	return `${lines.join("\n")}\n`;
}

export function createLlmsTextResponse(body: string) {
	return new Response(body, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
		},
	});
}
