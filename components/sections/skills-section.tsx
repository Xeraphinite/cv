'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { SkillItemBadge, type SkillItemBadgeData } from './skill-item-badge'

interface SkillsSectionProps {
  data: {
    skills?: {
      [category: string]: SkillItemBadgeData[]
    }
  }
}

export function SkillsSection({ data }: SkillsSectionProps) {
  const t = useTranslations()
  
  if (!data || !data.skills || Object.keys(data.skills).length === 0) return null

  return (
    <section className="paper-section">
      <h2 className="paper-section-title !mb-1.5 sm:!mb-2 !pb-0.5 sm:!pb-1">
        <Icon icon="mingcute:flashlight-fill" className="mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.skills')}
      </h2>

      <div className="paper-card">
        <div className="flex flex-col gap-3">
          {Object.entries(data.skills).map(([category, skills]) => (
            <div key={category} className="grid grid-cols-1 items-start gap-x-4 gap-y-1 md:grid-cols-[11rem_minmax(0,1fr)]">
              <h3 className="text-sm font-semibold text-foreground md:text-right">
                {category}
              </h3>
              <div className="flex flex-wrap items-center gap-1">
                {skills.map((skill, index) => (
                  <SkillItemBadge key={`${category}-${skill.text}-${index}`} item={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
