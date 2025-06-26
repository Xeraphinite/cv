export interface SocialLinks {
  github?: string;
  email?: string;
  phone?: string;
  wechat?: string;
  linkedin?: string;
  website?: string;
  orcid?: string;
  googleScholar?: string;
  researchGate?: string;
  twitter?: string;
}

export interface Hero {
  name: string;
  enName?: string;
  avatar: string;
  location: string;
  age: string;
  bio?: string;
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

export interface PublicationItem {
  title: string;
  authors: string[];
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

export interface SkillItem {
  name: string;
  category: string;
  description: string;
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

export interface CVData {
  hero: Hero;
  education: EducationItem[];
  publications: PublicationItem[];
  experience: ExperienceItem[];
  awards: AwardItem[];
  skills: Skills;
  talks?: TalkItem[];
}

export type Locale = 'en' | 'zh' | 'ja';

export interface LocalizedCVData extends CVData {
  locale: Locale;
} 