import fs from "node:fs/promises"
import path from "node:path"
import { parse as parseToml } from "smol-toml"
import { appConfig } from "@/lib/config/app-config"
import type { CVData, Locale, ProjectItem, ProjectPreviewImage, ProjectTechItem, ProjectUrl } from '@/lib/types/cv'

export async function getCVLastUpdated(locale: Locale = appConfig.cvData.fallbackLocale): Promise<string> {
  try {
    const filePath = await resolveCVSourceFilePath(locale)
    const stats = await fs.stat(filePath)
    return stats.mtime.toISOString()
  } catch (error) {
    console.error(`Error reading CV source mtime for locale ${locale}:`, error)
    return new Date().toISOString()
  }
}

export async function getCVData(locale: Locale = appConfig.cvData.fallbackLocale): Promise<CVData> {
  let baseData: CVData
  try {
    baseData = await getCVDataFromDefaultToml()
  } catch (defaultTomlError) {
    console.error(`Error loading default TOML data:`, defaultTomlError)
    return getSampleData()
  }

  const localeOverride = await tryGetLocalizedTomlOverride(locale)
  if (localeOverride) {
    return mergeCVData(baseData, localeOverride)
  }

  if (locale !== appConfig.cvData.fallbackLocale) {
    console.warn(`Falling back to default locale '${appConfig.cvData.fallbackLocale}'`)
    const fallbackOverride = await tryGetLocalizedTomlOverride(appConfig.cvData.fallbackLocale)
    if (fallbackOverride) {
      return mergeCVData(baseData, fallbackOverride)
    }
  }

  return baseData
}

type TomlContact = {
  icon?: string
  label?: string
  url?: string
}

type TomlCVData = {
  sectionConfig?: {
    education?: {
      splitExpectedLine?: boolean
    }
  }
  profile?: {
    original_name?: string
    en_name?: string
    aliases?: string[]
    furigana_name?: string
    furigana?: string
    location_label?: string
    position?: string
    summary?: string
    contacts?: TomlContact[]
  }
  education?: Record<
    string,
    {
      institution?: string
      degree?: string
      date?: string
      details?: string[]
    }
  >
  experience?: Record<
    string,
    {
      project?: string
      role?: string
      org?: string
      location?: string
      start?: string
      end?: string
      summary?: string
      details?: string[]
    }
  >
  publications?: Record<
    string,
    {
      type?: string
      title?: string
      venue?: string
      published?: string
      metadata?: string
      DOI?: string
      pdf?: string
      authors?: string[]
      tldr?: string
    }
  >
  news?: Record<
    string,
    {
      title?: string
      outlet?: string
      date?: string
      summary?: string
      url?: string
    }
  >
  projects?: Record<
    string,
    {
      name?: string
      description?: string
      year?: string | number
      status?: string
      preview_images?: Array<
        | string
        | {
            src?: string
            alt?: string
          }
      >
      urls?: Array<
        | string
        | {
            label?: string
            url?: string
            icon?: string
          }
      >
      tech?: Array<
        | string
        | {
            text?: string
            name?: string
            icon?: string
            url?: string
            code?: boolean
            description?: string
          }
      >
    }
  >
  skills?: Record<
    string,
    {
      label?: string
      items?: Array<
        | string
        | {
            text?: string
            name?: string
            icon?: string
            url?: string
            code?: boolean
            description?: string
          }
      >
    }
  >
  awards?: Record<
    string,
    {
      name?: string
      date?: string
      from?: string
      description?: string
    }
  >
}

async function getCVDataFromDefaultToml(): Promise<CVData> {
  const fileContents = await fs.readFile(getDefaultTomlFilePath(), "utf8")
  const parsedData = parseToml(fileContents) as TomlCVData
  return mapTomlToCVData(parsedData)
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends Record<string, unknown>
      ? DeepPartial<T[K]>
      : T[K]
}

async function getCVDataFromLocalizedToml(locale: Locale): Promise<DeepPartial<CVData>> {
  const fileContents = await fs.readFile(getLocalizedTomlFilePath(locale), "utf8")
  return parseToml(fileContents) as DeepPartial<CVData>
}

async function tryGetLocalizedTomlOverride(locale: Locale): Promise<DeepPartial<CVData> | null> {
  const filePath = getLocalizedTomlFilePath(locale)
  try {
    await fs.access(filePath)
  } catch {
    return null
  }

  try {
    return await getCVDataFromLocalizedToml(locale)
  } catch (error) {
    console.error(`Error loading localized TOML override for locale ${locale}:`, error)
    return null
  }
}

async function resolveCVSourceFilePath(locale: Locale): Promise<string> {
  if (locale === appConfig.cvData.defaultSourceLocale) {
    return getDefaultTomlFilePath()
  }

  const localizedPath = getLocalizedTomlFilePath(locale)
  try {
    await fs.access(localizedPath)
    return localizedPath
  } catch {
    return getDefaultTomlFilePath()
  }
}

function getDefaultTomlFilePath(): string {
  return path.isAbsolute(appConfig.cvData.defaultTomlFilePath)
    ? appConfig.cvData.defaultTomlFilePath
    : path.join(process.cwd(), appConfig.cvData.defaultTomlFilePath)
}

function getLocalizedTomlFilePath(locale: Locale): string {
  const fileName = appConfig.cvData.localizedTomlTemplate.replace("{locale}", locale)
  const fileDir = path.isAbsolute(appConfig.cvData.localizedTomlDir)
    ? appConfig.cvData.localizedTomlDir
    : path.join(process.cwd(), appConfig.cvData.localizedTomlDir)
  return path.join(fileDir, fileName)
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function mergeObject<T extends object>(base: T, override: DeepPartial<T>): T {
  const merged = { ...base }

  for (const key of Object.keys(override) as Array<keyof T>) {
    const overrideValue = override[key]
    if (overrideValue === undefined) continue

    const baseValue = merged[key]
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      merged[key] = mergeObject(
        baseValue as Record<string, unknown>,
        overrideValue as DeepPartial<Record<string, unknown>>,
      ) as T[keyof T]
      continue
    }

    merged[key] = overrideValue as T[keyof T]
  }

  return merged
}

function mergeArrayByIndex<T extends object>(
  base: T[],
  override?: Array<DeepPartial<T>>,
): T[] {
  if (!override || override.length === 0) return base

  return base.map((item, index) => {
    const overrideItem = override[index]
    if (!overrideItem) return item
    return mergeObject(item, overrideItem)
  })
}

function mergeCVData(base: CVData, override: DeepPartial<CVData>): CVData {
  const merged: CVData = {
    ...base,
    hero: override.hero ? mergeObject(base.hero, override.hero) : base.hero,
    education: mergeArrayByIndex(base.education, override.education),
    publications: mergeArrayByIndex(base.publications, override.publications),
    experience: mergeArrayByIndex(base.experience, override.experience),
    awards: mergeArrayByIndex(base.awards, override.awards),
    skills: {
      categories: override.skills?.categories ?? base.skills.categories,
      skills: mergeArrayByIndex(base.skills.skills, override.skills?.skills),
    },
  }

  const baseNews = base.news ?? []
  const mergedNews = mergeArrayByIndex(baseNews, override.news)
  if (base.news || override.news) {
    merged.news = mergedNews
  }

  const baseTalks = base.talks ?? []
  const mergedTalks = mergeArrayByIndex(baseTalks, override.talks)
  if (base.talks || override.talks) {
    merged.talks = mergedTalks
  }

  const baseProjects = base.projects ?? []
  const mergedProjects = mergeArrayByIndex(baseProjects, override.projects)
  if (base.projects || override.projects) {
    merged.projects = mergedProjects
  }

  return merged
}

function mapTomlToCVData(source: TomlCVData): CVData {
  const profile = source.profile ?? {}
  const educationEntries = Object.values(source.education ?? {})
  const experienceEntries = Object.values(source.experience ?? {})
  const publicationEntries = Object.values(source.publications ?? {})
  const projectEntries = Object.values(source.projects ?? {})
  const newsEntries = Object.values(source.news ?? {})
  const skillEntries = Object.values(source.skills ?? {})
  const awardEntries = Object.values(source.awards ?? {})

  return {
    hero: {
      name: cleanText(profile.original_name ?? profile.en_name ?? "Unknown"),
      enName: cleanText(profile.en_name ?? profile.original_name ?? "Unknown"),
      aliases: (profile.aliases ?? []).map(cleanText).filter(Boolean),
      furiganaName: cleanText(profile.furigana_name ?? ""),
      furigana: cleanText(profile.furigana ?? ""),
      avatar: "/avatar-256.png",
      location: cleanText(profile.location_label ?? ""),
      age: "",
      position: cleanText(profile.position ?? ""),
      bio: cleanText(profile.summary ?? ""),
      social: mapContactsToSocial(profile.contacts ?? []),
    },
    education: educationEntries.map((item) => {
      const { area, degree } = splitAreaAndDegree(item.degree ?? "")
      const { startDate, endDate } = splitDateRange(item.date)
      const details = (item.details ?? []).map(cleanText).filter(Boolean)
      return {
        institution: cleanText(item.institution ?? ""),
        area,
        degree,
        startDate,
        endDate,
        summary: details.join(" "),
        highlights: details,
      }
    }),
    sectionConfig: {
      education: {
        splitExpectedLine: source.sectionConfig?.education?.splitExpectedLine ?? true,
      },
    },
    experience: experienceEntries.map((item) => ({
      position: cleanText(item.project ?? item.role ?? ""),
      company: cleanText(item.org ?? ""),
      location: cleanText(item.location ?? ""),
      startDate: cleanText(item.start ?? ""),
      endDate: cleanText(item.end ?? "Present"),
      summary: cleanText(item.summary ?? ""),
      highlights: (item.details ?? []).map(cleanText).filter(Boolean),
    })),
    publications: publicationEntries.map((item) => {
      const metadata = cleanText(item.metadata ?? "")
      const impactFactor = parseImpactFactor(metadata)
      return {
        title: cleanText(item.title ?? ""),
        authors: (item.authors ?? []).map(cleanText).filter(Boolean),
        year: cleanText(item.published ?? ""),
        type: mapPublicationType(item.type),
        status: mapPublicationStatus(item.published, item.DOI),
        indexing: parseIndexing(metadata),
        impactFactor,
        publishedIn: cleanText(item.venue ?? ""),
        abstract: cleanText(item.tldr ?? ""),
        doi: cleanText(item.DOI ?? ""),
        url: cleanText(item.pdf ?? ""),
      }
    }),
    projects: projectEntries.flatMap((item) => {
      const name = cleanText(item.name ?? "")
      if (!name) return []

      const urls = (item.urls ?? [])
        .map(mapProjectUrl)
        .filter((projectUrl): projectUrl is ProjectUrl => Boolean(projectUrl))

      const tech = (item.tech ?? [])
        .map(mapProjectTechItem)
        .filter((techItem): techItem is ProjectTechItem => Boolean(techItem))

      const previewImages = (item.preview_images ?? [])
        .map(mapProjectPreviewImage)
        .filter((previewImage): previewImage is ProjectPreviewImage => Boolean(previewImage))

      return [
        {
          name,
          description: cleanText(item.description ?? ""),
          year: item.year,
          status: cleanText(item.status ?? ""),
          tech,
          urls,
          previewImages,
        } satisfies ProjectItem,
      ]
    }),
    awards: awardEntries.map((item) => ({
      name: cleanText(item.name ?? ""),
      institute: cleanText(item.from ?? ""),
      date: cleanText(item.date ?? ""),
      description: cleanText(item.description ?? ""),
    })),
    news: newsEntries.map((item) => ({
      title: cleanText(item.title ?? ""),
      outlet: cleanText(item.outlet ?? ""),
      date: cleanText(item.date ?? ""),
      summary: cleanText(item.summary ?? ""),
      url: cleanText(item.url ?? ""),
    })),
    skills: {
      categories: skillEntries
        .map((item) => cleanText(item.label ?? ""))
        .filter(Boolean),
      skills: skillEntries.flatMap((item) => {
        const category = cleanText(item.label ?? "")
        return (item.items ?? []).flatMap((skill) => {
          if (typeof skill === "string") {
            const text = cleanText(skill)
            if (!text) return []
            return [
              {
                text,
                category,
                description: "",
              },
            ]
          }

          const text = cleanText(skill.text ?? skill.name ?? "")
          if (!text) return []

          return [
            {
              text,
              category,
              icon: cleanText(skill.icon ?? ""),
              url: cleanText(skill.url ?? ""),
              code: Boolean(skill.code),
              description: cleanText(skill.description ?? ""),
            },
          ]
        })
      }),
    },
    talks: [],
  }
}

function splitDateRange(input?: string): { startDate: string; endDate: string } {
  if (!input) return { startDate: "", endDate: "Present" }
  const parts = input.split(/\s+-\s+/).map((part) => cleanText(part))
  if (parts.length >= 2) {
    return { startDate: parts[0], endDate: parts.slice(1).join(" - ") }
  }
  return { startDate: cleanText(input), endDate: "Present" }
}

function splitAreaAndDegree(input: string): { area: string; degree: string } {
  const normalized = cleanText(input)
  const [areaPart, degreePart] = normalized.split(",").map((part) => part.trim())
  return {
    area: areaPart || normalized,
    degree: degreePart || normalized,
  }
}

function mapProjectUrl(value: string | { label?: string; url?: string; icon?: string }): ProjectUrl | null {
  if (typeof value === "string") {
    const url = cleanText(value)
    if (!url) return null
    return {
      label: "Link",
      url,
      icon: "mingcute:arrow-right-up-fill",
    }
  }

  const url = cleanText(value.url ?? "")
  if (!url) return null
  const label = cleanText(value.label ?? "Link")
  const icon = cleanText(value.icon ?? "")
  return {
    label,
    url,
    icon,
  }
}

function mapProjectPreviewImage(
  value: string | { src?: string; alt?: string },
): ProjectPreviewImage | null {
  if (typeof value === "string") {
    const src = cleanText(value)
    if (!src) return null
    return { src, alt: "" }
  }

  const src = cleanText(value.src ?? "")
  if (!src) return null
  return {
    src,
    alt: cleanText(value.alt ?? ""),
  }
}

function mapProjectTechItem(
  value:
    | string
    | {
        text?: string
        name?: string
        icon?: string
        url?: string
        code?: boolean
        description?: string
      },
): ProjectTechItem | null {
  if (typeof value === "string") {
    const text = cleanText(value)
    if (!text) return null
    return {
      text,
      code: true,
    }
  }

  const text = cleanText(value.text ?? value.name ?? "")
  if (!text) return null
  return {
    text,
    icon: cleanText(value.icon ?? ""),
    url: cleanText(value.url ?? ""),
    code: Boolean(value.code),
    description: cleanText(value.description ?? ""),
  }
}

function cleanText(value: string): string {
  return value
    .replace(/#smallcaps\("([^"]+)"\)/g, "$1")
    .replace(/\r\n?/g, "\n")
    .trim()
}

function mapContactsToSocial(contacts: TomlContact[]): CVData["hero"]["social"] {
  const social: CVData["hero"]["social"] = {}
  for (const contact of contacts) {
    const icon = cleanText(contact.icon ?? "").toLowerCase()
    const label = cleanText(contact.label ?? "")
    const url = cleanText(contact.url ?? "")
    if (icon === "email") {
      if (url.startsWith("mailto:")) {
        social.email = url.replace(/^mailto:/, "")
      } else {
        social.email = label
      }
    }
    if (icon === "website" && url) {
      social.website = url
    }
    if (icon === "github" && url) {
      social.github = url
    }
    if (icon === "wechat" && label) {
      social.wechat = label
    }
  }
  return social
}

function mapPublicationType(type?: string): string {
  const normalized = cleanText(type ?? "").toLowerCase()
  if (normalized === "journal") return "Journal Article"
  if (normalized === "conference") return "Conference Paper"
  if (normalized === "preprint") return "Preprint"
  return "Journal Article"
}

function mapPublicationStatus(published?: string, doi?: string): string {
  if (doi && cleanText(doi)) return "Published"
  const year = Number.parseInt(cleanText(published ?? ""), 10)
  if (Number.isFinite(year)) {
    const currentYear = new Date().getFullYear()
    return year > currentYear ? "Under Review" : "Published"
  }
  return "Published"
}

function parseImpactFactor(metadata: string): number | undefined {
  const match = metadata.match(/\bIF:\s*([0-9]+(?:\.[0-9]+)?)\b/i)
  if (!match) return undefined
  return Number.parseFloat(match[1])
}

function parseIndexing(metadata: string): string[] | undefined {
  const values: string[] = []
  if (/JCR\s*Q1/i.test(metadata)) values.push("JCR-Q1")
  if (/JCR\s*Q2/i.test(metadata)) values.push("JCR-Q2")
  if (/JCR\s*Q3/i.test(metadata)) values.push("JCR-Q3")
  if (/JCR\s*Q4/i.test(metadata)) values.push("JCR-Q4")
  return values.length > 0 ? values : undefined
}

function getSampleData(): CVData {
  return {
    hero: {
      name: "Sample Name",
      avatar: "/placeholder.svg?height=128&width=128",
      location: "Sample Location",
      age: "1990-01",
      position: "Sample Position",
      bio: "Sample bio text for demonstration purposes.",
      social: {
        github: "https://github.com/sample",
        email: "sample@example.com",
      },
    },
    experience: [
      {
        company: "Sample Company",
        position: "Sample Position",
        location: "Sample Location",
        startDate: "Jan 2020",
        endDate: "Present",
        summary: "Sample experience description.",
        highlights: [
          "Sample achievement 1",
          "Sample achievement 2",
        ],
      },
    ],
    sectionConfig: {
      education: {
        splitExpectedLine: true,
      },
    },
    education: [
      {
        institution: "Sample University",
        area: "Sample Field",
        degree: "Sample Degree",
        startDate: "Sep 2015",
        endDate: "Jun 2019",
        summary: "Sample education description.",
        highlights: [
          "Sample highlight 1",
          "Sample highlight 2",
        ],
      },
    ],
    publications: [
      {
        title: "Sample Publication Title",
        authors: ["Sample Author"],
        type: "Journal Article",
        status: "Published",
        publishedIn: "Sample Journal",
      },
    ],
    projects: [
      {
        name: "Sample Project",
        description: "Sample project description.",
        year: "2024",
        status: "Active",
        tech: [{ text: "TypeScript", code: true }],
        urls: [{ label: "GitHub", url: "https://github.com/sample", icon: "mingcute:github-line" }],
      },
    ],
    awards: [
      {
        name: "Sample Award",
        institute: "Sample Institute",
        date: "2023",
        description: "Sample award description.",
      },
    ],
    news: [
      {
        title: "Sample News Headline",
        outlet: "Sample Media",
        date: "2024",
        summary: "Sample media coverage summary.",
      },
    ],
    skills: {
      categories: ["Programming", "Research", "Communication"],
      skills: [
        {
          text: "Sample Skill",
          category: "Programming",
          description: "Sample skill description",
        },
      ],
    },
  }
}
