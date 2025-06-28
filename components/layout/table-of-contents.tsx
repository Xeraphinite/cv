'use client'

import { useEffect, useState, useCallback } from 'react'
import { ChevronDown, List } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

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
  const [isScrolling, setIsScrolling] = useState(false)
  
  // Debounced section update to prevent rapid changes
  const debouncedSetCurrentSection = useCallback((sectionId: string) => {
    if (!isScrolling) {
      setCurrentSection(sectionId)
    }
  }, [isScrolling])

  useEffect(() => {
    const observerOptions = {
      threshold: [0.1, 0.5, 0.9],
      rootMargin: '-100px 0px -60% 0px'
    }

    const sectionElements = new Map<string, HTMLElement>()
    const observers = new Map<string, IntersectionObserver>()
    
    // Find and store all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        sectionElements.set(section.id, element)
      }
    })

    // Create intersection observers for each section
    sectionElements.forEach((element, sectionId) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
              debouncedSetCurrentSection(sectionId)
            }
          })
        },
        observerOptions
      )
      
      observer.observe(element)
      observers.set(sectionId, observer)
    })

    // Fallback scroll listener for edge cases
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        
        // Find the section closest to the top of viewport
        let closestSection = sections[0]?.id
        let closestDistance = Number.POSITIVE_INFINITY
        
        sectionElements.forEach((element, sectionId) => {
          const rect = element.getBoundingClientRect()
          const distance = Math.abs(rect.top - 100) // Account for header height
          
          if (distance < closestDistance && rect.top < window.innerHeight) {
            closestDistance = distance
            closestSection = sectionId
          }
        })
        
        if (closestSection) {
          setCurrentSection(closestSection)
        }
      }, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      observers.forEach((observer) => observer.disconnect())
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [sections, debouncedSetCurrentSection])
  
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      setIsScrolling(true)
      setCurrentSection(sectionId)
      
      const headerHeight = 100 // Account for sticky header
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      
      // Reset scrolling state after animation
      setTimeout(() => setIsScrolling(false), 1000)
    }
  }
  
  const currentSectionData = sections.find(section => section.id === currentSection)
  
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
            <List className="h-4 w-4" />
            <span className="max-w-48 truncate">
              {currentSectionData?.title || sections[0]?.title}
            </span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="center" 
          className="max-h-80 w-64 overflow-y-auto"
          sideOffset={8}
        >
          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={clsx(
                "cursor-pointer",
                currentSection === section.id 
                  ? "bg-primary/10 font-medium text-primary" 
                  : "hover:bg-muted/50"
              )}
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
          className="max-h-80 w-64 overflow-y-auto"
          sideOffset={8}
        >
          {sections.map((section) => (
            <DropdownMenuItem
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={clsx(
                "cursor-pointer",
                currentSection === section.id 
                  ? "bg-primary/10 font-medium text-primary" 
                  : "hover:bg-muted/50"
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