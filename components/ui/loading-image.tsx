'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface LoadingImageProps {
  src: string
  alt: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
  quality?: number
  blurDataURL?: string
}

export function LoadingImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
  quality = 85,
  blurDataURL,
  ...props
}: LoadingImageProps) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
        className={cn(
          'duration-700 ease-in-out',
          isLoading
            ? 'scale-110 blur-2xl grayscale'
            : 'scale-100 blur-0 grayscale-0',
          className
        )}
        onLoad={() => setLoading(false)}
        {...props}
      />
    </div>
  )
} 