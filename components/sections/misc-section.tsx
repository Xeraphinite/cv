'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { SkillItemBadge, type SkillItemBadgeData } from './skill-item-badge'

interface MiscSectionProps {
  items: SkillItemBadgeData[]
}

export function MiscSection({ items }: MiscSectionProps) {
  const t = useTranslations()

  if (!items.length) return null

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:more-2-fill" className="mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.misc')}
      </h2>

      <div className="paper-card">
        <div className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => (
            <SkillItemBadge key={`misc-${item.text}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
