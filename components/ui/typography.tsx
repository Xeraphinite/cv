'use client'

import React from 'react'
import { cn, getTypographyClasses, getFontClass, isCJKLocale } from '@/lib/utils'

interface TypographyProps {
  children: React.ReactNode
  variant?: 'title' | 'subtitle' | 'body' | 'meta'
  locale?: string
  className?: string
  as?: keyof React.JSX.IntrinsicElements
  serif?: boolean
}

export function Typography({ 
  children, 
  variant = 'body', 
  locale, 
  className,
  as,
  serif = false 
}: TypographyProps) {
  const typographyClasses = getTypographyClasses(locale)
  const fontClass = getFontClass(locale, serif ? 'serif' : 'sans')
  const isCJK = isCJKLocale(locale)
  
  // Auto-detect component type based on variant if not specified
  const getDefaultTag = (): keyof React.JSX.IntrinsicElements => {
    switch (variant) {
      case 'title': return 'h1'
      case 'subtitle': return 'h2'
      case 'body': return 'p'
      case 'meta': return 'span'
      default: return 'p'
    }
  }
  
  const Component = as || getDefaultTag()

  const baseClasses = typographyClasses[variant]
  const additionalClasses = cn(
    fontClass,
    isCJK && 'cjk-punctuation',
    className
  )

  return React.createElement(
    Component,
    { className: cn(baseClasses, additionalClasses) },
    children
  )
}

// Specialized typography components for different use cases

interface HeadingProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  locale?: string
  className?: string
  serif?: boolean
}

export function Heading({ children, level = 1, locale, className, serif = false }: HeadingProps) {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements
  const variant = level <= 2 ? 'title' : 'subtitle'
  
  return (
    <Typography 
      as={Component} 
      variant={variant} 
      locale={locale} 
      className={className}
      serif={serif}
    >
      {children}
    </Typography>
  )
}

interface TextProps {
  children: React.ReactNode
  locale?: string
  className?: string
  variant?: 'body' | 'meta'
  serif?: boolean
  emphasis?: boolean
}

export function Text({ 
  children, 
  locale, 
  className, 
  variant = 'body', 
  serif = false,
  emphasis = false 
}: TextProps) {
  const typographyClasses = getTypographyClasses(locale)
  const emphasisClass = emphasis ? typographyClasses.emphasis : ''
  
  return (
    <Typography 
      variant={variant} 
      locale={locale} 
      className={cn(emphasisClass, className)}
      serif={serif}
    >
      {children}
    </Typography>
  )
}

// Ruby text component for Japanese
interface RubyTextProps {
  children: React.ReactNode
  ruby: string
  className?: string
}

export function RubyText({ children, ruby, className }: RubyTextProps) {
  return (
    <ruby className={cn('paper-ruby', className)}>
      {children}
      <rt>{ruby}</rt>
    </ruby>
  )
}

// Vertical text component for CJK languages
interface VerticalTextProps {
  children: React.ReactNode
  direction?: 'rl' | 'lr'
  locale?: string
  className?: string
}

export function VerticalText({ 
  children, 
  direction = 'rl', 
  locale, 
  className 
}: VerticalTextProps) {
  const fontClass = getFontClass(locale)
  
  return (
    <div className={cn(
      direction === 'rl' ? 'vertical-rl' : 'vertical-lr',
      fontClass,
      className
    )}>
      {children}
    </div>
  )
}

// Quote component with proper typography
interface QuoteProps {
  children: React.ReactNode
  author?: string
  locale?: string
  className?: string
}

export function Quote({ children, author, locale, className }: QuoteProps) {
  const typographyClasses = getTypographyClasses(locale)
  
  return (
    <blockquote className={cn(typographyClasses.body, 'border-l-4 border-primary/20 pl-6 italic', className)}>
      {children}
      {author && (
        <footer className={cn(typographyClasses.meta, 'mt-2 not-italic')}>
          — {author}
        </footer>
      )}
    </blockquote>
  )
}

// List component with proper typography
interface ListProps {
  children: React.ReactNode
  ordered?: boolean
  locale?: string
  className?: string
}

export function List({ children, ordered = false, locale, className }: ListProps) {
  const typographyClasses = getTypographyClasses(locale)
  const Component = ordered ? 'ol' : 'ul'
  
  return (
    <Component className={cn(
      typographyClasses.body,
      ordered ? 'list-decimal' : 'list-disc',
      'ml-6 space-y-2',
      className
    )}>
      {children}
    </Component>
  )
}

export function ListItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={className}>{children}</li>
} 