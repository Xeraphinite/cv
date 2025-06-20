'use client'

import { Zap, Code, Lightbulb, MessageSquare } from "lucide-react"
import { useTranslations } from 'next-intl'

interface Skill {
  name: string
  category: string
  description: string
}

interface Skills {
  categories: string[]
  skills: Skill[]
}

interface SkillsSectionProps {
  data: Skills
}

export function SkillsSection({ data }: SkillsSectionProps) {
  const t = useTranslations()
  
  if (!data || !data.skills || data.skills.length === 0) return null

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Programming': Code,
      'Research': Lightbulb,
      'Communication': MessageSquare,
      'プログラミング': Code,
      '研究': Lightbulb,
      'コミュニケーション': MessageSquare
    }
    return icons[category as keyof typeof icons] || Code
  }

  return (
    <section className="print:break-inside-avoid-page">
      <div className="flex items-center gap-3 mb-5 pb-2 border-b border-border print:border-gray-300">
        <div className="flex items-center justify-center w-8 h-8 bg-foreground print:bg-black rounded-xl">
          <Zap className="h-4 w-4 text-background print:text-white" />
        </div>
        <h2 className="text-xl font-bold text-foreground print:text-black">
          {t('section.skills')}
        </h2>
      </div>

      <div className="space-y-6">
        {data.categories.map((category) => {
          const categorySkills = data.skills.filter((skill) => skill.category === category)
          if (categorySkills.length === 0) return null

          const IconComponent = getCategoryIcon(category)

          return (
            <div key={category} className="print:break-inside-avoid">
              <div className="bg-card print:bg-white border border-border print:border-gray-300 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-foreground print:bg-black rounded-xl">
                    <IconComponent className="h-4 w-4 text-background print:text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground print:text-black">{category}</h3>
                </div>
                
                <div className="space-y-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.name} className="p-4 bg-muted/50 print:bg-gray-50 rounded-xl border border-border/50 print:border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground print:text-black break-words flex-1">{skill.name}</span>
                        <div className="w-2 h-2 bg-foreground print:bg-black rounded-full flex-shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground print:text-gray-600 leading-relaxed break-words">{skill.description}</p>
                    </div>
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
