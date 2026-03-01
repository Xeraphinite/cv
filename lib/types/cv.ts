import type { SupportedLocale } from "@/lib/config/app-config";

export interface SocialLinks {
	email?: string;
	github?: string;
	wechat?: string;
	website?: string;
	googleScholar?: string;
	orcid?: string;
	bluesky?: string;
	// Deprecated fields - keeping for backward compatibility but not using in UI
	phone?: string;
	linkedin?: string;
	researchGate?: string;
	twitter?: string;
}

export interface Hero {
	name: string;
	enName?: string;
	aliases?: string[];
	furiganaName?: string;
	furigana?: string;
	avatar: string;
	location: string;
	age: string;
	position?: string;
	bio?: string;
	description?: string;
	social: SocialLinks;
}

export interface EducationItem {
	institution: string;
	area: string;
	degree: string;
	supervisor?: string;
	startDate: string;
	endDate: string;
	summary?: string;
	highlights: string[];
}

export interface EducationSectionConfig {
	splitExpectedLine?: boolean;
}

export interface SectionConfig {
	education?: EducationSectionConfig;
}

export interface PublicationItem {
	title: string;
	authors: string[];
	year?: string;
	type: string;
	status: string;
	indexing?: string[];
	impactFactor?: number;
	publishedIn: string;
	abstract?: string;
	doi?: string;
	url?: string;
	highlight?: boolean;
	involved?: boolean;
	journal?: string;
}

export interface ExperienceItem {
	position: string;
	company: string;
	location?: string;
	startDate: string;
	endDate: string;
	summary?: string;
	highlights: string[];
}

export interface AwardItem {
	name: string;
	institute: string;
	date: string;
	description?: string;
}

export interface PatentItem {
	number: string;
	title: string;
	filed: string;
	status: string;
	country: string;
	inventors: string[];
}

export interface CopyrightItem {
	title: string;
	year: string;
	status: string;
	country: string;
	holders: string[];
}

export interface SkillItem {
	text: string;
	category: string;
	description?: string;
	icon?: string;
	url?: string;
	code?: boolean;
	// Backward compatibility for legacy localized payloads.
	name?: string;
}

export interface Skills {
	categories: string[];
	skills: SkillItem[];
}

export interface TalkItem {
	title: string;
	event: string;
	location?: string;
	date: string;
	type?: string;
	description?: string;
	url?: string;
}

export interface NewsItem {
	title: string;
	outlet: string;
	date: string;
	summary?: string;
	url?: string;
}

export interface ProjectUrl {
	label: string;
	url: string;
	icon?: string;
}

export interface ProjectPreviewImage {
	src: string;
	alt?: string;
}

export interface ProjectTechItem {
	text: string;
	icon?: string;
	url?: string;
	code?: boolean;
	description?: string;
}

export interface ProjectItem {
	name: string;
	description: string;
	year?: string | number;
	status?: string;
	previewImages?: ProjectPreviewImage[];
	tech?: ProjectTechItem[];
	urls?: ProjectUrl[];
}

export interface CVData {
	hero: Hero;
	education: EducationItem[];
	sectionConfig?: SectionConfig;
	publications: PublicationItem[];
	experience: ExperienceItem[];
	projects?: ProjectItem[];
	news?: NewsItem[];
	awards: AwardItem[];
	patents?: PatentItem[];
	copyrights?: CopyrightItem[];
	skills: Skills;
	talks?: TalkItem[];
}

export type Locale = SupportedLocale;

export interface LocalizedCVData extends CVData {
	locale: Locale;
}
