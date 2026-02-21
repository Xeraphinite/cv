'use client'

import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { CVControls } from '@/components/layout/cv-controls'

export function CVHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const lastScrollYRef = useRef(0)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isScrolledRef = useRef(false)

  useEffect(() => {
    const clearHideTimer = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current)
        hideTimerRef.current = null
      }
    }

    const scheduleHeaderHide = () => {
      clearHideTimer()
      hideTimerRef.current = setTimeout(() => {
        setIsHeaderVisible((previous) => (isScrolledRef.current ? false : previous))
      }, 2200)
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollYRef.current
      const next = currentScrollY > 20

      setIsScrolled((previous) => (previous === next ? previous : next))
      isScrolledRef.current = next
      if (!next) {
        setIsHeaderVisible(true)
        clearHideTimer()
      } else if (delta < -2) {
        setIsHeaderVisible(true)
        scheduleHeaderHide()
      } else if (delta > 2) {
        scheduleHeaderHide()
      }

      lastScrollYRef.current = currentScrollY
    }

    const handleUserActivity = () => {
      if (!isScrolledRef.current) return
      setIsHeaderVisible(true)
      scheduleHeaderHide()
    }

    lastScrollYRef.current = window.scrollY
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('mousemove', handleUserActivity, { passive: true })
    window.addEventListener('touchstart', handleUserActivity, { passive: true })
    window.addEventListener('keydown', handleUserActivity)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('touchstart', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      clearHideTimer()
    }
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-4 z-50 mx-auto mb-4 max-w-2xl transition-all duration-300 lg:mb-0 lg:hidden',
        isHeaderVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0',
        isScrolled
          ? 'rounded-2xl border border-border bg-background/80 px-3 py-2 shadow-lg backdrop-blur-lg'
          : 'rounded-2xl border border-transparent bg-background/60 px-3 py-2 backdrop-blur-sm'
      )}
    >
      <CVControls bare />
    </header>
  )
}
