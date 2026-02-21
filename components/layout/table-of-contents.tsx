'use client'

import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
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
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const t = useTranslations()
  const [sections, setSections] = useState<TOCSection[]>([])
  const [currentSection, setCurrentSection] = useState<string>('')
  const isProgrammaticScrollRef = useRef(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const sectionElements = Array.from(document.querySelectorAll('main section[id]')) as HTMLElement[]
    const nextSections = sectionElements
      .map((element) => {
        const id = element.id
        if (!id) return null
        if (id === 'hero') {
          return { id, title: t('navigation.about') || 'About' }
        }

        const heading = element.querySelector('h2')
        const title = heading?.textContent?.trim()
        if (title) return { id, title }

        return {
          id,
          title: id
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
        }
      })
      .filter((section): section is TOCSection => section !== null)

    setSections(nextSections)
    setCurrentSection(nextSections[0]?.id || '')
  }, [t])

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
    <div className={clsx('flex items-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-3 py-1.5 font-medium text-sm hover:bg-muted/50"
            aria-label="Table of contents"
          >
            <span className="max-w-32 truncate">{currentSectionData?.title || sections[0]?.title}</span>
            <Icon icon="mingcute:down-line" className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="max-h-80 w-56 overflow-y-auto" sideOffset={8}>
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
