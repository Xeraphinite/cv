'use client'

import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface TOCSection {
  id: string
  title: string
  element?: HTMLElement
}

interface TableOfContentsProps {
  sections: TOCSection[]
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [currentSection, setCurrentSection] = useState<string>(sections[0]?.id || '')
  const isProgrammaticScrollRef = useRef(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (sections.length === 0) return

    setCurrentSection((previous) => {
      if (sections.some((section) => section.id === previous)) return previous
      return sections[0].id
    })

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScrollRef.current) return

        let bestId: string | null = null
        let bestRatio = 0

        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio <= 0.1) continue
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestId = entry.target.id
          }
        }

        if (bestId) {
          setCurrentSection((previous) => (previous === bestId ? previous : bestId))
        }
      },
      {
        threshold: [0.1, 0.5, 0.9],
        rootMargin: '-100px 0px -60% 0px',
      }
    )

    for (const section of sections) {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    }

    return () => {
      observer.disconnect()
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, [sections])

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (!element) return

    isProgrammaticScrollRef.current = true
    setCurrentSection(sectionId)

    window.scrollTo({
      top: element.offsetTop - 100,
      behavior: 'smooth',
    })

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false
    }, 900)
  }

  const currentSectionData = sections.find((section) => section.id === currentSection)

  if (sections.length === 0) {
    return null
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hidden items-center gap-2 font-medium text-muted-foreground text-sm md:flex"
          >
            <Icon icon="mingcute:list-check-3-line" className="h-4 w-4" />
            <span className="max-w-48 truncate">{currentSectionData?.title || sections[0]?.title}</span>
            <Icon icon="mingcute:down-line" className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="max-h-80 w-64 overflow-y-auto" sideOffset={8}>
          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={clsx(
                'cursor-pointer',
                currentSection === section.id ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted/50'
              )}
            >
              {section.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden" aria-label="Table of contents">
            <Icon icon="mingcute:list-check-3-line" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="max-h-80 w-64 overflow-y-auto" sideOffset={8}>
          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={clsx(
                'cursor-pointer',
                currentSection === section.id ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-muted/50'
              )}
            >
              {section.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
