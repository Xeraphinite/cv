import "server-only";

import type {
	BlueskyProfileData,
	GitHubProfileData,
	GoogleScholarProfileData,
	SocialProfileData,
} from "@/lib/types/cv";

const PROFILE_REQUEST_TIMEOUT_MS = 4_000;
const VERIFIED_AT = "2026-07-25";

const VERIFIED_GITHUB_SNAPSHOT: GitHubProfileData = {
	login: "Xeraphinite",
	name: "Xeraphinite",
	bio: "꿈에서 깨워주지 마",
	avatarUrl: "https://avatars.githubusercontent.com/u/54465460?s=64&v=4",
	followers: 2,
	following: 2,
	publicRepos: 11,
	contributions: 386,
	contributionStart: "2026-02-01",
	contributionEnd: "2026-07-25",
	contributionLevels: [
		0, 1, 1, 2, 3, 0, 0, 3, 2, 0, 0, 0, 1, 1, 1, 0, 4, 2, 3, 1, 3, 2, 0, 0, 1,
		0, 2, 4, 4, 3, 4, 3, 4, 2, 2, 2, 1, 1, 2, 0, 0, 0, 1, 1, 0, 0, 4, 0, 0, 0,
		1, 2, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 2, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 1, 0, 0,
	],
	verifiedAt: VERIFIED_AT,
};

const VERIFIED_SCHOLAR_SNAPSHOT: GoogleScholarProfileData = {
	name: "Keyou Zheng",
	affiliation: "Guangdong University of Technology",
	interests: [
		"Large Language Model",
		"Human-Computer Interaction",
		"LLM Agent",
	],
	citations: 75,
	hIndex: 2,
	i10Index: 2,
	citationsByYear: [
		{ year: 2025, citations: 16 },
		{ year: 2026, citations: 58 },
	],
	verifiedAt: VERIFIED_AT,
};

const VERIFIED_BLUESKY_SNAPSHOT: BlueskyProfileData = {
	handle: "lonelylight.bsky.social",
	displayName: "llm-kirby",
	description: "大语言模型塞满嘴",
	avatarUrl:
		"https://cdn.bsky.app/img/avatar/plain/did:plc:7ikgqgoiezgrvaowfphhjldi/bafkreidt44p4thlcgi4ewdeaoz2xpoy6xt3b6b2mthwmbsedmrkdhu3s2m",
	followersCount: 0,
	followsCount: 2,
	postsCount: 12,
	verifiedAt: VERIFIED_AT,
};

function requestOptions(userAgent = "minimal-cv/1.0") {
	return {
		headers: {
			Accept: "text/html,application/json",
			"User-Agent": userAgent,
		},
		cache: "no-store" as const,
		signal: AbortSignal.timeout(PROFILE_REQUEST_TIMEOUT_MS),
	};
}

function decodeHtml(value: string): string {
	return value
		.replace(/<[^>]+>/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function getAttribute(tag: string, name: string): string | undefined {
	return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function getClassTextValues(html: string, className: string): string[] {
	const values: string[] = [];
	const pattern = new RegExp(
		`<[^>]+class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/[^>]+>`,
		"g",
	);

	for (const match of html.matchAll(pattern)) {
		const value = decodeHtml(match[1]);
		if (value) values.push(value);
	}

	return values;
}

function getElementTextById(html: string, id: string): string | undefined {
	const match = html.match(
		new RegExp(`<[^>]+id="${id}"[^>]*>([\\s\\S]*?)<\\/[^>]+>`),
	);
	const value = match ? decodeHtml(match[1]) : "";
	return value || undefined;
}

function toCount(value: unknown, fallback: number): number {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function parseGitHubContributions(
	html: string,
): Pick<
	GitHubProfileData,
	| "contributions"
	| "contributionLevels"
	| "contributionStart"
	| "contributionEnd"
> | null {
	const days: Array<{ date: string; level: number }> = [];
	const cellPattern =
		/<td\b[^>]*\bclass="[^"]*\bContributionCalendar-day\b[^"]*"[^>]*>/g;

	for (const match of html.matchAll(cellPattern)) {
		const date = getAttribute(match[0], "data-date");
		const level = Number(getAttribute(match[0], "data-level"));
		if (date && Number.isInteger(level) && level >= 0 && level <= 4) {
			days.push({ date, level });
		}
	}

	if (days.length < 175) return null;

	const recentDays = days
		.toSorted((a, b) => a.date.localeCompare(b.date))
		.slice(-175);
	const contributions = Number(
		html
			.match(/([\d,]+)\s+contributions?\s+in the last year/i)?.[1]
			?.replace(/,/g, ""),
	);

	return {
		contributions: Number.isFinite(contributions)
			? contributions
			: VERIFIED_GITHUB_SNAPSHOT.contributions,
		contributionLevels: recentDays.map(({ level }) => level),
		contributionStart: recentDays[0]?.date,
		contributionEnd: recentDays.at(-1)?.date,
	};
}

async function getGitHubProfile(): Promise<GitHubProfileData> {
	const [profileResult, contributionsResult] = await Promise.allSettled([
		fetch(
			"https://api.github.com/users/Xeraphinite",
			requestOptions("minimal-cv/1.0"),
		),
		fetch(
			"https://github.com/users/Xeraphinite/contributions",
			requestOptions("Mozilla/5.0 (compatible; minimal-cv/1.0)"),
		),
	]);

	let profile = { ...VERIFIED_GITHUB_SNAPSHOT };

	if (profileResult.status === "fulfilled" && profileResult.value.ok) {
		try {
			const data = (await profileResult.value.json()) as Record<
				string,
				unknown
			>;
			profile = {
				...profile,
				login: typeof data.login === "string" ? data.login : profile.login,
				name: typeof data.name === "string" ? data.name : profile.name,
				bio: typeof data.bio === "string" ? data.bio : profile.bio,
				avatarUrl:
					typeof data.avatar_url === "string"
						? data.avatar_url
						: profile.avatarUrl,
				followers: toCount(data.followers, profile.followers),
				following: toCount(data.following, profile.following),
				publicRepos: toCount(data.public_repos, profile.publicRepos),
			};
		} catch {
			// Keep the last verified public snapshot when GitHub returns bad JSON.
		}
	}

	if (
		contributionsResult.status === "fulfilled" &&
		contributionsResult.value.ok
	) {
		try {
			const contributionData = parseGitHubContributions(
				await contributionsResult.value.text(),
			);
			if (contributionData) profile = { ...profile, ...contributionData };
		} catch {
			// Keep the last verified public snapshot when the calendar changes shape.
		}
	}

	return profile;
}

function parseScholarProfile(html: string): GoogleScholarProfileData | null {
	const name = getElementTextById(html, "gsc_prf_in");
	const affiliation = getClassTextValues(html, "gsc_prf_il")[0];
	const interests = getClassTextValues(html, "gsc_prf_inta");
	const metrics = getClassTextValues(html, "gsc_rsb_std").map(Number);
	const years = getClassTextValues(html, "gsc_g_t").map(Number);
	const citationValues = getClassTextValues(html, "gsc_g_a").map(Number);

	if (!name || !affiliation || metrics.length < 6) return null;

	const citationsByYear = years.flatMap((year, index) => {
		const citations = citationValues[index];
		return Number.isFinite(year) && Number.isFinite(citations)
			? [{ year, citations }]
			: [];
	});

	return {
		name,
		affiliation,
		interests:
			interests.length > 0 ? interests : VERIFIED_SCHOLAR_SNAPSHOT.interests,
		citations: metrics[0],
		hIndex: metrics[2],
		i10Index: metrics[4],
		citationsByYear:
			citationsByYear.length > 0
				? citationsByYear
				: VERIFIED_SCHOLAR_SNAPSHOT.citationsByYear,
		verifiedAt: new Date().toISOString().slice(0, 10),
	};
}

async function getGoogleScholarProfile(): Promise<GoogleScholarProfileData> {
	try {
		const response = await fetch(
			"https://scholar.google.com/citations?user=agkWz8MAAAAJ&hl=en",
			requestOptions("Mozilla/5.0 (compatible; minimal-cv/1.0)"),
		);
		if (!response.ok) return VERIFIED_SCHOLAR_SNAPSHOT;
		return (
			parseScholarProfile(await response.text()) ?? VERIFIED_SCHOLAR_SNAPSHOT
		);
	} catch {
		return VERIFIED_SCHOLAR_SNAPSHOT;
	}
}

async function getBlueskyProfile(): Promise<BlueskyProfileData> {
	try {
		const response = await fetch(
			"https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=lonelylight.bsky.social",
			requestOptions(),
		);
		if (!response.ok) return VERIFIED_BLUESKY_SNAPSHOT;

		const data = (await response.json()) as Record<string, unknown>;
		return {
			handle:
				typeof data.handle === "string"
					? data.handle
					: VERIFIED_BLUESKY_SNAPSHOT.handle,
			displayName:
				typeof data.displayName === "string"
					? data.displayName
					: VERIFIED_BLUESKY_SNAPSHOT.displayName,
			description:
				typeof data.description === "string" ? data.description : undefined,
			avatarUrl: typeof data.avatar === "string" ? data.avatar : undefined,
			followersCount:
				typeof data.followersCount === "number"
					? data.followersCount
					: undefined,
			followsCount:
				typeof data.followsCount === "number" ? data.followsCount : undefined,
			postsCount:
				typeof data.postsCount === "number" ? data.postsCount : undefined,
			verifiedAt: new Date().toISOString().slice(0, 10),
		};
	} catch {
		return VERIFIED_BLUESKY_SNAPSHOT;
	}
}

export async function getSocialProfileData(): Promise<SocialProfileData> {
	const [github, googleScholar, bluesky] = await Promise.all([
		getGitHubProfile(),
		getGoogleScholarProfile(),
		getBlueskyProfile(),
	]);

	return { github, googleScholar, bluesky };
}

export function getVerifiedSocialProfileData(): SocialProfileData {
	return {
		github: {
			...VERIFIED_GITHUB_SNAPSHOT,
			contributionLevels: [...VERIFIED_GITHUB_SNAPSHOT.contributionLevels],
		},
		googleScholar: {
			...VERIFIED_SCHOLAR_SNAPSHOT,
			interests: [...VERIFIED_SCHOLAR_SNAPSHOT.interests],
			citationsByYear: VERIFIED_SCHOLAR_SNAPSHOT.citationsByYear.map(
				(entry) => ({ ...entry }),
			),
		},
		bluesky: { ...VERIFIED_BLUESKY_SNAPSHOT },
	};
}
