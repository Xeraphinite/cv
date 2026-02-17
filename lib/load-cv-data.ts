import fs from "node:fs/promises"
import path from "node:path"
import yaml from "js-yaml"
import { parse as parseToml } from "smol-toml"
import { appConfig } from "@/lib/config/app-config"
import type { CVData, Locale } from '@/lib/types/cv'

export async function getCVData(locale: Locale = "zh"): Promise<CVData> {
  try {
    if (appConfig.cvData.source === "toml") {
      return await getCVDataFromToml()
    }
    return await getCVDataFromYaml(locale)
  } catch (error) {
    console.error(`Error loading CV data for locale ${locale}:`, error)
    // Fallback to YAML data if TOML loading fails
    if (appConfig.cvData.source === "toml") {
      try {
        return await getCVDataFromYaml(locale)
      } catch (yamlError) {
        console.error(`Error loading fallback YAML data for locale ${locale}:`, yamlError)
      }
    }
    // Fallback to default locale if current locale fails
    if (locale !== appConfig.cvData.fallbackLocale) {
      console.warn(`Falling back to default locale '${appConfig.cvData.fallbackLocale}'`)
      return getCVData(appConfig.cvData.fallbackLocale)
    }
    // Return sample data as last resort
    return getSampleData()
  }
}

type TomlContact = {
  icon?: string
  label?: string
  url?: string
}

type TomlCVData = {
  profile?: {
    original_name?: string
    en_name?: string
    location_label?: string
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
  skills?: Record<
    string,
    {
      label?: string
      items?: string[]
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

async function getCVDataFromToml(): Promise<CVData> {
  const filePath = path.isAbsolute(appConfig.cvData.tomlFilePath)
    ? appConfig.cvData.tomlFilePath
    : path.join(process.cwd(), appConfig.cvData.tomlFilePath)
  const fileContents = await fs.readFile(filePath, "utf8")
  const parsedData = parseToml(fileContents) as TomlCVData
  return mapTomlToCVData(parsedData)
}

async function getCVDataFromYaml(locale: Locale): Promise<CVData> {
  const fileName = appConfig.cvData.fallbackYamlTemplate.replace("{locale}", locale)
  const filePath = path.join(process.cwd(), appConfig.cvData.fallbackYamlDir, fileName)
  const fileContents = await fs.readFile(filePath, "utf8")
  const data = yaml.load(fileContents) as CVData

  if (!data || typeof data !== "object") {
    throw new Error(`Invalid CV data structure for locale: ${locale}`)
  }
  return data
}

function mapTomlToCVData(source: TomlCVData): CVData {
  const profile = source.profile ?? {}
  const educationEntries = Object.values(source.education ?? {})
  const experienceEntries = Object.values(source.experience ?? {})
  const publicationEntries = Object.values(source.publications ?? {})
  const skillEntries = Object.values(source.skills ?? {})
  const awardEntries = Object.values(source.awards ?? {})

  return {
    hero: {
      name: cleanText(profile.original_name ?? profile.en_name ?? "Unknown"),
      enName: cleanText(profile.en_name ?? profile.original_name ?? "Unknown"),
      avatar: "/avatar-256.png",
      location: cleanText(profile.location_label ?? ""),
      age: "",
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
    awards: awardEntries.map((item) => ({
      name: cleanText(item.name ?? ""),
      institute: cleanText(item.from ?? ""),
      date: cleanText(item.date ?? ""),
      description: cleanText(item.description ?? ""),
    })),
    skills: {
      categories: skillEntries
        .map((item) => cleanText(item.label ?? ""))
        .filter(Boolean),
      skills: skillEntries.flatMap((item) => {
        const category = cleanText(item.label ?? "")
        return (item.items ?? [])
          .map(cleanText)
          .filter(Boolean)
          .map((name) => ({
            name,
            category,
            description: "",
          }))
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

function cleanText(value: string): string {
  return value
    .replace(/`/g, "")
    .replace(/\*+/g, "")
    .replace(/_+/g, "")
    .replace(/#smallcaps\("([^"]+)"\)/g, "$1")
    .replace(/;{2,}/g, ";")
    .replace(/\s+/g, " ")
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
    awards: [
      {
        name: "Sample Award",
        institute: "Sample Institute",
        date: "2023",
        description: "Sample award description.",
      },
    ],
    skills: {
      categories: ["Programming", "Research", "Communication"],
      skills: [
        {
          name: "Sample Skill",
          category: "Programming",
          description: "Sample skill description",
        },
      ],
    },
  }
}
