'use client'

import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Map, MapMarker, MarkerContent, MarkerLabel } from '@/components/ui/map'
import { cn, getFontClass } from '@/lib/utils'

interface HeroLocationProps {
  location: string
  locale?: string
}

const GUANGZHOU_COORDINATES: [number, number] = [113.39922790281463, 23.036126383069753]
const GUANGZHOU_CAMERA_CENTER: [number, number] = [113.39922790281463, 23.036126383069753]
const STATE_KEY_TEXT = 'State Key Lab of Manufacturing Technology & Equipment'

export function HeroLocation({ location, locale }: HeroLocationProps) {
  const serifFontClass = getFontClass(locale, 'serif')
  const normalizedLocation = location.trim().toLowerCase()
  const shouldShowMap = normalizedLocation === 'guangzhou, guangdong'
  const [canRenderMap, setCanRenderMap] = useState(false)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const webglContext = canvas.getContext('webgl2') || canvas.getContext('webgl')
    setCanRenderMap(Boolean(webglContext))
  }, [])

  const trigger = (
    <div className="paper-contact-link group">
      <div className="relative h-4 w-4">
        <Icon
          icon="mingcute:canton-tower-line"
          className="absolute inset-0 h-4 w-4 transition-opacity duration-200 group-hover:opacity-0"
        />
        <Icon
          icon="mingcute:canton-tower-fill"
          className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
      </div>
      <span className={cn(serifFontClass, 'break-words')}>{location}</span>
    </div>
  )

  if (!shouldShowMap) return trigger

  return (
    <HoverCard openDelay={120} closeDelay={120}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent align="start" side="top" className="w-[22rem] p-2">
        {canRenderMap ? (
          <div className="relative h-52 overflow-hidden rounded-2xl border border-border/60">
            <Map
              center={GUANGZHOU_CAMERA_CENTER}
              zoom={14.15}
              attributionControl={false}
              dragPan
              dragRotate={false}
              scrollZoom
              doubleClickZoom={false}
              touchZoomRotate
            >
              <MapMarker longitude={GUANGZHOU_COORDINATES[0]} latitude={GUANGZHOU_COORDINATES[1]}>
                <MarkerContent />
                <MarkerLabel position="bottom" className="mt-2 text-xs text-foreground/85">
                  {STATE_KEY_TEXT}
                </MarkerLabel>
              </MapMarker>
            </Map>
            <div className="pointer-events-none absolute bottom-3 left-3 h-1/2 w-1/2 rounded-[2rem] border border-border/60 bg-white px-5 py-4 dark:bg-background">
              <div className="flex h-full flex-col items-start justify-between space-y-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9f7a63]">
                  <Icon icon="mingcute:mortarboard-fill" className="h-4 w-4 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-base leading-none text-foreground font-bold">学校</p>
                  <p className="text-sm leading-none text-muted-foreground">Guangzhou</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-border/60 bg-card/60 p-3">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9f7a63]">
                <Icon icon="mingcute:mortarboard-fill" className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-lg leading-none text-foreground">学校</p>
                <p className="text-sm leading-none text-muted-foreground">Guangzhou</p>
              </div>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
