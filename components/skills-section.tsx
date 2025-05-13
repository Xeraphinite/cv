import React from "react"
import { Lightbulb, Code, BookOpen, MessageSquare, Palette, Heart } from "lucide-react"

interface Skill {
  name: string
  category: string
  description: string
}

interface SkillsSectionProps {
  data: {
    categories: string[]
    skills: Skill[]
  }
}

// Fixed categories and their Chinese translations
const CATEGORY_LABELS: Record<string, { en: string; zh: string }> = {
  Programming: { en: "Programming", zh: "编程" },
  Research: { en: "Research", zh: "研究" },
  Communication: { en: "Communication", zh: "语言" },
  Design: { en: "Design", zh: "设计" },
  Hobbies: { en: "Hobbies", zh: "兴趣" },
}

// Category icons
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Programming: <Code className="h-4 w-4" />,
  Research: <BookOpen className="h-4 w-4" />,
  Communication: <MessageSquare className="h-4 w-4" />,
  Design: <Palette className="h-4 w-4" />,
  Hobbies: <Heart className="h-4 w-4" />,
}

// Category colors
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Programming: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Research: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Communication: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Design: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  Hobbies: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
}

export function SkillsSection({ data }: SkillsSectionProps) {
  if (!data || !data.skills || data.skills.length === 0) return null

  // Group skills by fixed categories
  const skillsByCategory: Record<string, Skill[]> = {}
  Object.keys(CATEGORY_LABELS).forEach(category => {
    skillsByCategory[category] = []
  })
  for (const skill of data.skills) {
    if (CATEGORY_LABELS[skill.category]) {
      skillsByCategory[skill.category].push(skill)
    }
  }

  return (
    <section className="print:break-inside-avoid-page">
      <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />
        技能
      </h2>

      <div className="space-y-2">
        {Object.entries(skillsByCategory).map(([category, skills]) => {
          if (skills.length === 0) return null
          const colorSet = CATEGORY_COLORS[category] || {
            bg: "bg-gray-50",
            text: "text-gray-700",
            border: "border-gray-200",
          }
          const label = CATEGORY_LABELS[category]

          return (
            <div key={category} className="print:break-inside-avoid">
              <div className={`flex items-center gap-1 mb-1 ${colorSet.text}`}>
                <span className={`flex items-center min-w-4 gap-1 text-sm px-2 py-1 rounded-full font-medium ${colorSet.bg}`}>
                  {CATEGORY_ICONS[category]}
                  <span>
                    {label.zh}
                  </span>
                </span>
                <div className="pl-2 text-sm text-gray-700 leading-relaxed">
                  {skills.map((skill, index) => (
                    <React.Fragment key={skill.name}>
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      {skill.description && <span className="text-gray-600"> {skill.description}</span>}
                      {index < skills.length - 1 && <span className="mx-1.5 text-gray-400">•</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
