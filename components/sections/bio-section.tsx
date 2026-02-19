'use client'

import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { MarkdownText } from '@/components/ui/markdown-text'

interface BioSectionProps {
  bio?: string
}

export function BioSection({ bio }: BioSectionProps) {
  const t = useTranslations()

  if (!bio?.trim()) return null

  return (
    <section className="paper-section">
      <h2 className="paper-section-title">
        <Icon icon="mingcute:user-3-line" className="size-[1em] mr-3 inline-block align-[-0.12em] text-primary" />
        {t('sections.biography')}
      </h2>

      <div className="paper-body leading-relaxed text-foreground">
        <MarkdownText content={bio} />
      </div>
    </section>
  )
}
