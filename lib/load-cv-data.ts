import fs from "node:fs/promises"
import path from "node:path"
import yaml from "js-yaml"
import type { CVData, Locale } from '@/lib/types/cv'

export async function getCVData(locale: Locale = "zh"): Promise<CVData> {
  try {
    const filePath = path.join(process.cwd(), "data", `cv.${locale}.yaml`);
    const fileContents = await fs.readFile(filePath, "utf8")
    const data = yaml.load(fileContents) as CVData
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid CV data structure for locale: ${locale}`)
    }
    
    return data
  } catch (error) {
    console.error(`Error loading CV data for locale ${locale}:`, error)
    // Fallback to default locale if current fails
    if (locale !== 'zh') {
      console.warn(`Falling back to default locale 'zh'`)
      return getCVData('zh')
    }
    // Return sample data as last resort
    return getSampleData()
  }
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
