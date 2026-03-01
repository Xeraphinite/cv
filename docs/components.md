# Components

This project is organized around three component groups:

```text
components/
  layout/    shell-level controls and footer
  sections/  CV sections and page composition
  ui/        reusable primitives and typography helpers
```

## Layout Components

### `components/layout/cv-footer.tsx`

Shared footer used in two places:

- mobile and tablet footer from `app/(cv)/[locale]/layout.tsx`
- desktop footer inside the sticky left rail in `components/sections/cv.tsx`

Responsibilities:

- locale-aware relative `lastUpdated` display
- Umami visitor and active-user indicators
- locale and theme controls
- links to localized `llms.txt`, Accessibility, and Privacy pages

### `components/layout/locale-switcher.tsx`

Standalone locale switcher helper. The main interactive locale control currently lives in `CVFooter`.

### `components/layout/umami-indicators.tsx`

Client component that renders footer analytics data from `app/api/umami/visitors/route.ts`.

## Section Components

### `components/sections/cv.tsx`

Top-level page composition component.

Props:

```ts
interface CVProps {
  data: CVData | null
  locale?: string
  lastUpdated?: string
}
```

Behavior:

- builds the two-column shell at `lg`
- keeps the hero column sticky on large screens
- renders sections in this order:
  - `about`
  - `news`
  - `projects`
  - `publications`
  - `experience`
  - `education`
  - `skills`
  - `awards`
  - `misc`
- splits `Misc` skills into the dedicated bottom section

### `components/sections/hero-section.tsx`

Left-column identity block with avatar, name, position, location, and contact links.

Related components:

- `hero-location.tsx`
- `hero-location-map.tsx`

### `components/sections/bio-section.tsx`

Renders the About section from `hero.bio`.

### `components/sections/news-section.tsx`

Renders reverse-chronological news items. News row summaries support Markdown.

### `components/sections/projects-section.tsx`

Renders project items with optional preview images, external links, status badges, and tech chips.

### `components/sections/publications-section.tsx`

Renders publications in a compact year-first format and highlights owner-name variants based on hero aliases and normalized name forms.

### `components/sections/experience-section.tsx`

Renders time-first experience rows. The date column leads visually; organization metadata excludes location in the main meta line.

### `components/sections/education-section.tsx`

Renders compact education rows. `sectionConfig.education.splitExpectedLine` controls expected-line splitting behavior.

### `components/sections/skills-section.tsx`

Renders the main skills grid as a two-column category-and-badges layout.

### `components/sections/skill-item-badge.tsx`

Shared badge renderer for skills and project tech stacks.

Badge data shape:

```ts
type SkillItemBadgeData = {
  text: string
  icon?: string
  url?: string
  code?: boolean
  description?: string
}
```

### `components/sections/awards-section.tsx`

Compact two-column awards layout aligned with the education rhythm.

### `components/sections/misc-section.tsx`

Dedicated renderer for the `Misc` skill category.

## UI Components

### `components/ui/markdown-text.tsx`

Markdown renderer used for TOML-backed rich text. Inline URLs preserve the project’s dashed-underline external-link treatment.

### `components/ui/typography.tsx`

Client-side typography helpers:

- `Typography`
- `Heading`
- `Text`
- `RubyText`
- `VerticalText`
- `Quote`
- `List`
- `ListItem`

These components consume locale-aware helpers from `lib/utils`.

## Conventions

- Prefer section components for CV rendering, not large monolithic page files.
- Keep shell-level controls in layout components.
- Reuse `SkillItemBadge` for compact chip UI.
- Reuse `MarkdownText` for TOML fields that may contain Markdown.
- Prefer helper classes in `app/globals.css` over Tailwind `!` modifiers in section code.
