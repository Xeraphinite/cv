'use client'

import { Icon } from '@iconify/react'
import { Map, MapMarker, MarkerContent, MarkerLabel } from '@/components/ui/map'

const MAP_MARKER_COORDINATES: [number, number] = [113.39850748368237, 23.03593600443637]
const MAP_CAMERA_CENTER: [number, number] = [113.39850748368237, 23.03593600443637]

interface HeroLocationMapProps {
  workplaceLabel: string
}

export function HeroLocationMap({ workplaceLabel }: HeroLocationMapProps) {
  return (
    <div className="hero-location-map relative h-52 w-full overflow-hidden rounded-2xl">
      <Map
        className="rounded-2xl"
        center={MAP_CAMERA_CENTER}
        zoom={14.15}
        attributionControl={false}
        dragPan
        dragRotate={false}
        scrollZoom
        doubleClickZoom={false}
        touchZoomRotate
      >
        <MapMarker longitude={MAP_MARKER_COORDINATES[0]} latitude={MAP_MARKER_COORDINATES[1]}>
          <MarkerContent />
          <MarkerLabel position="bottom" className="relative top-2 text-foreground/85 text-xs">
            {workplaceLabel}
          </MarkerLabel>
        </MapMarker>
      </Map>
      <div className="pointer-events-none absolute bottom-3 left-3 h-1/2 w-1/2 rounded-[2rem] border border-border/60 bg-popover/95 px-5 py-4 backdrop-blur-[1px]">
        <div className="flex h-full flex-col items-start justify-between space-y-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#9f7a63]">
            <Icon icon="mingcute:mortarboard-fill" className="h-4 w-4 text-white" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-base text-foreground leading-none">学校</p>
            <p className="text-muted-foreground text-sm leading-none">Guangdong</p>
          </div>
        </div>
      </div>
    </div>
  )
}
