'use client'

import { Icon } from '@iconify/react'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'

export interface SkillItemBadgeData {
  text: string
  icon?: string
  url?: string
  code?: boolean
  description?: string
}

interface SkillItemBadgeProps {
  item: SkillItemBadgeData
}

function getFaviconUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url)
    return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`
  } catch {
    return undefined
  }
}

function SkillBadgeContent({ item }: SkillItemBadgeProps) {
  const resolvedFavicon = item.url ? getFaviconUrl(item.url) : undefined

  return (
    <Badge
      variant="secondary"
      className={cn(
        'h-auto rounded-full border-transparent bg-muted/60 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:bg-muted/80 gap-1.5',
        item.code ? 'font-mono' : 'font-sans'
      )}
    >
      {item.icon ? (
        <Icon icon={item.icon} className="h-3.5 w-3.5 shrink-0" />
      ) : (
        resolvedFavicon && (
          <img
            src={resolvedFavicon}
            alt=""
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 rounded-sm"
            loading="lazy"
          />
        )
      )}
      <span>{item.text}</span>
    </Badge>
  )
}

export function SkillItemBadge({ item }: SkillItemBadgeProps) {
  const trigger = item.url ? (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex no-underline hover:no-underline focus-visible:no-underline visited:no-underline"
    >
      <SkillBadgeContent item={item} />
    </a>
  ) : (
    <span className="inline-flex">
      <SkillBadgeContent item={item} />
    </span>
  )

  if (!item.description) {
    return trigger
  }

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent side="top" className="w-72 p-3 font-sans text-sm leading-relaxed">
        {item.description}
      </HoverCardContent>
    </HoverCard>
  )
}
