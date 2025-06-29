# Enhanced Multilingual Typography

This documentation explains the enhanced typography system implemented following W3C guidelines for Chinese (CLREQ), Japanese (JLREQ), Korean (KLREQ), and English typography best practices.

## Overview

The typography system provides:
- **Language-specific font stacks** optimized for each script
- **Proper line heights and letter spacing** for different languages
- **CJK text enhancements** including punctuation handling
- **Ruby text support** for Japanese
- **Vertical text support** for CJK languages
- **Typography components** for easy implementation

## Font Loading

High-quality fonts are loaded via Google Fonts CDN:
- **Inter** - Latin text (English)
- **Noto Sans/Serif SC** - Simplified Chinese
- **Noto Sans/Serif TC** - Traditional Chinese
- **Noto Sans/Serif JP** - Japanese
- **Noto Sans/Serif KR** - Korean

## Typography Classes

### Language-Specific Base Classes

```css
/* Chinese (Simplified) */
.font-zh-sans     /* Sans-serif Chinese fonts */
.font-zh-serif    /* Serif Chinese fonts */

/* Chinese (Traditional) */
.font-zh-hant-sans
.font-zh-hant-serif

/* Japanese */
.font-ja-sans     /* Includes ruby text support */
.font-ja-serif

/* Korean */
.font-ko-sans
.font-ko-serif

/* English */
.font-en-sans
.font-en-serif
```

### Typography Hierarchy

```css
/* Titles */
.paper-title              /* Base title styling */
.paper-title.lang-zh      /* Chinese-optimized title */
.paper-title.lang-ja      /* Japanese-optimized title */
.paper-title.lang-ko      /* Korean-optimized title */

/* Subtitles */
.paper-subtitle           /* Base subtitle styling */
.paper-subtitle.lang-zh   /* Chinese-optimized subtitle */
.paper-subtitle.lang-ja   /* Japanese-optimized subtitle */
.paper-subtitle.lang-ko   /* Korean-optimized subtitle */

/* Body text */
.paper-body               /* Base body text */
.paper-body.lang-zh       /* Chinese-optimized body */
.paper-body.lang-ja       /* Japanese-optimized body */
.paper-body.lang-ko       /* Korean-optimized body */

/* Meta text */
.paper-meta               /* Base meta text */
.paper-meta.lang-zh       /* Chinese-optimized meta */
.paper-meta.lang-ja       /* Japanese-optimized meta */
.paper-meta.lang-ko       /* Korean-optimized meta */
```

### Special Features

```css
/* Ruby text for Japanese */
.paper-ruby               /* Ruby text container */
.paper-ruby rt            /* Ruby annotation styling */

/* Vertical text */
.vertical-rl              /* Right-to-left vertical text */
.vertical-lr              /* Left-to-right vertical text */

/* CJK enhancements */
.cjk-punctuation          /* Proper punctuation spacing */
.cjk-text                 /* Enhanced text selection */

/* Text justification */
.text-justify-zh          /* Chinese text justification */
.text-justify-ja          /* Japanese text justification */
.text-justify-ko          /* Korean text justification */

/* Emphasis styles */
.emphasis-zh              /* Chinese emphasis (dots under) */
.emphasis-ja              /* Japanese emphasis (sesame over) */
.emphasis-ko              /* Korean emphasis (underline) */
```

## Utility Functions

### Typography Classes Generator

```typescript
import { getTypographyClasses } from '@/lib/utils'

// Get all typography classes for a locale
const typography = getTypographyClasses('zh')
// Returns: { title: '...', subtitle: '...', body: '...', meta: '...', emphasis: '...' }
```

### Font Class Utilities

```typescript
import { getFontClass, getLanguageClass } from '@/lib/utils'

// Get font class for locale
const fontClass = getFontClass('ja', 'sans') // 'font-ja-sans'

// Get language-specific class
const langClass = getLanguageClass('ko') // 'text-ko'
```

### Locale Detection

```typescript
import { isCJKLocale, supportsVerticalWriting } from '@/lib/utils'

// Check if locale uses CJK characters
const isCJK = isCJKLocale('zh') // true

// Check if locale supports vertical writing
const hasVertical = supportsVerticalWriting('ja') // true
```

## Typography Components

### Basic Typography Component

```tsx
import { Typography } from '@/components/ui/typography'

<Typography variant="title" locale="zh" className="mb-4">
  中文标题
</Typography>

<Typography variant="body" locale="ja" serif>
  日本語のテキスト
</Typography>
```

### Specialized Components

```tsx
import { Heading, Text, RubyText, VerticalText } from '@/components/ui/typography'

// Headings with automatic sizing
<Heading level={1} locale="ko">한국어 제목</Heading>

// Text with emphasis
<Text locale="zh" emphasis>重要文本</Text>

// Ruby text for Japanese
<RubyText ruby="かんじ">漢字</RubyText>

// Vertical text for CJK
<VerticalText locale="ja" direction="rl">
  縦書きテキスト
</VerticalText>
```

## Usage in Components

### Manual Class Application

```tsx
import { getTypographyClasses } from '@/lib/utils'

function MyComponent({ locale }: { locale: string }) {
  const typography = getTypographyClasses(locale)
  
  return (
    <div>
      <h1 className={typography.title}>Title</h1>
      <p className={typography.body}>Body text</p>
    </div>
  )
}
```

### Using Typography Components

```tsx
import { Typography } from '@/components/ui/typography'

function MyComponent({ locale }: { locale: string }) {
  return (
    <div>
      <Typography variant="title" locale={locale}>
        Title
      </Typography>
      <Typography variant="body" locale={locale}>
        Body text
      </Typography>
    </div>
  )
}
```

## Tailwind Configuration

The typography system extends Tailwind with:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      'zh-sans': [/* Chinese font stack */],
      'ja-sans': [/* Japanese font stack */],
      'ko-sans': [/* Korean font stack */],
      // ... more font families
    },
    letterSpacing: {
      'zh': '-0.02em',
      'ja': '-0.01em',
      'ko': '-0.015em',
      'en': '-0.01em'
    },
    lineHeight: {
      'zh': '1.7',
      'ja': '1.75', 
      'ko': '1.6',
      'en': '1.5'
    }
  }
}
```

## Language-Specific Guidelines

### Chinese (CLREQ)
- **Line height**: 1.7 for better readability
- **Letter spacing**: -0.02em for character cohesion
- **Punctuation**: Proper spacing with `cjk-punctuation`
- **Justification**: `text-justify: inter-character`

### Japanese (JLREQ)
- **Mixed scripts**: Optimized for Hiragana, Katakana, Kanji, Latin
- **Ruby text**: Built-in support with `paper-ruby`
- **Line height**: 1.75 for mixed script readability
- **Vertical writing**: Supported with `vertical-rl/lr`

### Korean (KLREQ)
- **Hangul optimization**: Proper spacing for Korean characters
- **Line height**: 1.6 for compact Korean text
- **Letter spacing**: -0.015em for Hangul
- **Justification**: `text-justify: inter-word`

### English (Practical Typography)
- **Font stack**: Inter, SF Pro, system fonts
- **Line height**: 1.5 for optimal readability
- **Letter spacing**: -0.01em for modern appearance

## Best Practices

1. **Always specify locale** when using typography components
2. **Use appropriate variants** (title, subtitle, body, meta)
3. **Consider serif fonts** for longer text content
4. **Apply language classes** for automatic optimization
5. **Test with real content** in each language
6. **Use emphasis styles** appropriately for each language

## Browser Support

- **Modern browsers**: Full support for all features
- **Legacy browsers**: Graceful degradation with system fonts
- **Font loading**: Optimized with `font-display: swap`
- **Performance**: Minimal impact with efficient font loading

## Examples

### Multilingual CV Section

```tsx
function CVSection({ data, locale }: { data: any, locale: string }) {
  const typography = getTypographyClasses(locale)
  
  return (
    <section>
      <h2 className={typography.subtitle}>
        {data.title}
      </h2>
      <p className={typography.body}>
        {data.description}
      </p>
      <div className={typography.meta}>
        {data.date}
      </div>
    </section>
  )
}
```

### Japanese with Ruby Text

```tsx
function JapaneseText() {
  return (
    <Typography variant="body" locale="ja">
      私の名前は
      <RubyText ruby="たなか">田中</RubyText>
      です。
    </Typography>
  )
}
```

### Chinese Vertical Text

```tsx
function ChineseVertical() {
  return (
    <VerticalText locale="zh" direction="rl" className="h-64">
      中文直排文字展示
    </VerticalText>
  )
}
```

This typography system ensures excellent readability and cultural appropriateness across all supported languages while maintaining design consistency. 