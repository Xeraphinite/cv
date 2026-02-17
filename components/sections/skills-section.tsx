'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'

interface SkillsSectionProps {
  data: {
    skills?: {
      [category: string]: string[]
    }
  }
}

export function SkillsSection({ data }: SkillsSectionProps) {
  const t = useTranslations()
  
  if (!data || !data.skills || Object.keys(data.skills).length === 0) return null

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:flashlight-fill" className="mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.skills')}
      </h2>

      <div className="paper-card">
        <div className="flex flex-col gap-3">
          {Object.entries(data.skills).map(([category, skills]) => (
            <div key={category} className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                {skills.map((skill) => (
                  <span key={skill} className="paper-badge text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
