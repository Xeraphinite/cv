'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { locales, localeLabels, type Locale } from '@/i18n'
import { createLocalizedPath, getLocaleFromPathname } from '@/lib/i18n-utils'

const STORAGE_KEY = 'cv-locale-selected'

export function LocaleDetector() {
  const [isOpen, setIsOpen] = useState(false)
  const [detectedLocale, setDetectedLocale] = useState<Locale | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = getLocaleFromPathname(pathname)

  useEffect(() => {
    // Check if user has already made a locale selection
    const hasSelectedLocale = localStorage.getItem(STORAGE_KEY)
    if (hasSelectedLocale) return

    // Detect user's preferred language
    const browserLanguages = navigator.languages || [navigator.language]
    let detected: Locale | null = null

    for (const lang of browserLanguages) {
      const langCode = lang.split('-')[0].toLowerCase()
      if (locales.includes(langCode as Locale)) {
        detected = langCode as Locale
        break
      }
    }

    // If we detected a different locale than current, show the modal
    if (detected && detected !== currentLocale) {
      setDetectedLocale(detected)
      setIsOpen(true)
    } else {
      // Mark as selected to avoid showing modal again
      localStorage.setItem(STORAGE_KEY, 'true')
    }
  }, [currentLocale])

  const handleLocaleSelect = (locale: Locale) => {
    localStorage.setItem(STORAGE_KEY, 'true')
    const newPath = createLocalizedPath(pathname, locale)
    setIsOpen(false)
    router.push(newPath)
  }

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setIsOpen(false)
  }

  if (!detectedLocale) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl">
              <Icon icon="mingcute:globe-line" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-left">
                Language Preference Detected
              </DialogTitle>
              <DialogDescription className="text-left mt-1">
                We detected that you might prefer {localeLabels[detectedLocale]}. Would you like to switch?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => handleLocaleSelect(detectedLocale)}
            className="w-full justify-start gap-3"
            size="lg"
          >
            <Icon icon="mingcute:globe-line" className="h-4 w-4" />
            Switch to {localeLabels[detectedLocale]}
          </Button>
          
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="w-full justify-start gap-3"
            size="lg"
          >
            <Icon icon="mingcute:close-line" className="h-4 w-4" />
            Keep {localeLabels[currentLocale || 'en']}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-4 text-center">
          You can always change the language using the switcher in the header.
        </div>
      </DialogContent>
    </Dialog>
  )
} 
