'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, List } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

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
  
  useEffect(() => {
    const observers = new Map<string, IntersectionObserver>()
    
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setCurrentSection(section.id)
              }
            })
          },
          {
            threshold: 0.3,
            rootMargin: '-20% 0px -70% 0px'
          }
        )
        
        observer.observe(element)
        observers.set(section.id, observer)
      }
    })
    
    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [sections])
  
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = 80 // Approximate header height
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
    }
  }
  
  const currentSectionData = sections.find(section => section.id === currentSection)
  
  if (sections.length === 0) return null
  
  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <List className="h-4 w-4" />
            <span className="max-w-48 truncate">
              {currentSectionData?.title || sections[0]?.title}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          className="w-64 max-h-80 overflow-y-auto"
          sideOffset={8}
        >
          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`cursor-pointer transition-colors ${
                currentSection === section.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/50'
              }`}
            >
              {section.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Mobile TOC Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="md:hidden"
            aria-label="Table of contents"
          >
            <List className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          className="w-64 max-h-80 overflow-y-auto"
          sideOffset={8}
        >
          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`cursor-pointer transition-colors ${
                currentSection === section.id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-muted/50'
              }`}
            >
              {section.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 