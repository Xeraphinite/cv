import { parse as parseToml } from "smol-toml";
import cvJaSource from "@/data/cv.ja.toml";
import cvZhSource from "@/data/cv.zh.toml";
import cvSource from "@/data/cv.toml";
import { appConfig } from "@/lib/config/app-config";
import type { CVData, Locale } from "@/lib/types/cv";

type DefaultTomlProfile = {
	original_name?: string;
	en_name?: string;
	aliases?: string[];
	location_label?: string;
	position?: string;
	summary?: string;
	contacts?: Array<{
		icon?: string;
		label?: string;
		url?: string;
	}>;
};

type DefaultTomlCVData = {
	profile?: DefaultTomlProfile;
	education?: Record<
		string,
		{
			institution?: string;
			degree?: string;
			date?: string;
			details?: string[];
		}
	>;
	experience?: Record<
		string,
		{
			project?: string;
			role?: string;
			org?: string;
			location?: string;
			start?: string;
			end?: string;
			summary?: string;
			details?: string[];
		}
	>;
	publications?: Record<
		string,
		{
			type?: string;
			title?: string;
			venue?: string;
			published?: string;
			metadata?: string;
			DOI?: string;
			pdf?: string;
			authors?: string[];
			tldr?: string;
		}
	>;
};

type LlmsRelevantCVData = Pick<
	CVData,
	"hero" | "education" | "experience" | "publications"
>;

type LlmsRelevantOverride = Partial<LlmsRelevantCVData>;

const localizedTomlSources: Partial<Record<Locale, string>> = {
	ja: cvJaSource,
	zh: cvZhSource,
};

function cleanText(value?: string): string {
	return (
		value
			?.replace(/#smallcaps\("([^"]+)"\)/g, "$1")
			.replace(/\r\n?/g, "\n")
			.trim() ?? ""
	);
}

function splitDateRange(input?: string): {
	startDate: string;
	endDate: string;
} {
	if (!input) return { startDate: "", endDate: "Present" };

	const parts = input.split(/\s+-\s+/).map((part) => cleanText(part));
	if (parts.length >= 2) {
		return { startDate: parts[0], endDate: parts.slice(1).join(" - ") };
	}

	return { startDate: cleanText(input), endDate: "Present" };
}

function splitAreaAndDegree(input: string): { area: string; degree: string } {
	const normalized = cleanText(input);
	const [areaPart, degreePart] = normalized
		.split(",")
		.map((part) => part.trim());

	return {
		area: areaPart || normalized,
		degree: degreePart || normalized,
	};
}

function mapContactsToSocial(contacts: DefaultTomlProfile["contacts"] = []) {
	const social: CVData["hero"]["social"] = {};

	for (const contact of contacts) {
		const icon = cleanText(contact.icon).toLowerCase();
		const label = cleanText(contact.label);
		const url = cleanText(contact.url);

		if (icon === "email") {
			social.email = url.startsWith("mailto:")
				? url.replace(/^mailto:/, "")
				: label;
		}
		if (icon === "website" && url) {
			social.website = url;
		}
		if (icon === "github" && url) {
			social.github = url;
		}
		if (icon === "wechat" && label) {
			social.wechat = label;
		}
	}

	return social;
}

function mapPublicationType(type?: string): string {
	const normalized = cleanText(type).toLowerCase();
	if (normalized === "journal") return "Journal Article";
	if (normalized === "conference") return "Conference Paper";
	if (normalized === "preprint") return "Preprint";
	return "Journal Article";
}

function mapPublicationStatus(published?: string, doi?: string): string {
	if (cleanText(doi)) return "Published";

	const year = Number.parseInt(cleanText(published), 10);
	if (Number.isFinite(year)) {
		return year > new Date().getFullYear() ? "Under Review" : "Published";
	}

	return "Published";
}

function parseIndexing(metadata?: string): string[] | undefined {
	const values: string[] = [];
	const normalized = cleanText(metadata);

	if (/JCR\s*Q1/i.test(normalized)) values.push("JCR-Q1");
	if (/JCR\s*Q2/i.test(normalized)) values.push("JCR-Q2");
	if (/JCR\s*Q3/i.test(normalized)) values.push("JCR-Q3");
	if (/JCR\s*Q4/i.test(normalized)) values.push("JCR-Q4");

	return values.length > 0 ? values : undefined;
}

function parseImpactFactor(metadata?: string): number | undefined {
	const match = cleanText(metadata).match(/\bIF:\s*([0-9]+(?:\.[0-9]+)?)\b/i);
	return match ? Number.parseFloat(match[1]) : undefined;
}

function parseDefaultTomlCVData(source: string): LlmsRelevantCVData {
	const parsed = parseToml(source) as DefaultTomlCVData;
	const profile = parsed.profile ?? {};

	return {
		hero: {
			name: cleanText(profile.original_name ?? profile.en_name ?? "Unknown"),
			enName: cleanText(profile.en_name ?? profile.original_name ?? "Unknown"),
			aliases: (profile.aliases ?? []).map(cleanText).filter(Boolean),
			avatar: "/avatar-256.png",
			location: cleanText(profile.location_label),
			age: "",
			position: cleanText(profile.position),
			bio: cleanText(profile.summary),
			social: mapContactsToSocial(profile.contacts),
		},
		education: Object.values(parsed.education ?? {}).map((item) => {
			const { area, degree } = splitAreaAndDegree(item.degree ?? "");
			const { startDate, endDate } = splitDateRange(item.date);
			const highlights = (item.details ?? []).map(cleanText).filter(Boolean);

			return {
				institution: cleanText(item.institution),
				area,
				degree,
				startDate,
				endDate,
				summary: highlights.join(" "),
				highlights,
			};
		}),
		experience: Object.values(parsed.experience ?? {}).map((item) => ({
			position: cleanText(item.project ?? item.role),
			company: cleanText(item.org),
			location: cleanText(item.location),
			startDate: cleanText(item.start),
			endDate: cleanText(item.end ?? "Present"),
			summary: cleanText(item.summary),
			highlights: (item.details ?? []).map(cleanText).filter(Boolean),
		})),
		publications: Object.values(parsed.publications ?? {}).map((item) => {
			const metadata = cleanText(item.metadata);
			return {
				title: cleanText(item.title),
				authors: (item.authors ?? []).map(cleanText).filter(Boolean),
				year: cleanText(item.published),
				type: mapPublicationType(item.type),
				status: mapPublicationStatus(item.published, item.DOI),
				indexing: parseIndexing(metadata),
				impactFactor: parseImpactFactor(metadata),
				publishedIn: cleanText(item.venue),
				abstract: cleanText(item.tldr),
				doi: cleanText(item.DOI),
				url: cleanText(item.pdf),
			};
		}),
	};
}

function mergeArrayByIndex<T>(base: T[], override?: Array<Partial<T>>): T[] {
	if (!override?.length) {
		return base;
	}

	return base.map((item, index) => ({
		...item,
		...override[index],
	}));
}

function mergeLlmsRelevantData(
	base: LlmsRelevantCVData,
	override?: LlmsRelevantOverride,
): LlmsRelevantCVData {
	if (!override) {
		return base;
	}

	return {
		hero: override.hero ? { ...base.hero, ...override.hero } : base.hero,
		education: mergeArrayByIndex(base.education, override.education),
		experience: mergeArrayByIndex(base.experience, override.experience),
		publications: mergeArrayByIndex(base.publications, override.publications),
	};
}

export async function getBundledCVData(
	locale: Locale = appConfig.cvData.fallbackLocale,
): Promise<LlmsRelevantCVData> {
	const baseData = parseDefaultTomlCVData(cvSource);
	const localizedSource = localizedTomlSources[locale];

	if (!localizedSource) {
		return baseData;
	}

	const override = parseToml(localizedSource) as LlmsRelevantOverride;
	return mergeLlmsRelevantData(baseData, override);
}
