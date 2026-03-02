# Design System

This document describes the implemented design tokens and UI conventions used in this project.

## Token Sources

- Global tokens: `app/globals.css`
- Tailwind token mapping/extensions: `tailwind.config.ts`
- Font loading: `app/(cv)/[locale]/layout.tsx`
- CV shell/layout rhythm: `components/sections/cv.tsx`

## Color System

Color tokens are defined as HSL channels in CSS variables and consumed through Tailwind color aliases.

### Light mode (`:root`)

| Token | Value |
| --- | --- |
| `--background` | `0 0% 95%` |
| `--foreground` | `0 0% 25%` |
| `--card` | `0 0% 95%` |
| `--card-foreground` | `0 0% 25%` |
| `--popover` | `0 0% 95%` |
| `--popover-foreground` | `0 0% 25%` |
| `--primary` | `0 0% 25%` |
| `--primary-foreground` | `0 0% 95%` |
| `--secondary` | `0 0% 90%` |
| `--secondary-foreground` | `0 0% 25%` |
| `--muted` | `0 0% 90%` |
| `--muted-foreground` | `0 0% 50%` |
| `--accent` | `0 0% 90%` |
| `--accent-foreground` | `0 0% 25%` |
| `--destructive` | `0 84% 60%` |
| `--destructive-foreground` | `0 0% 98%` |
| `--border` | `0 0% 95%` |
| `--input` | `0 0% 95%` |
| `--ring` | `0 0% 25%` |

### Dark mode (`.dark`)

| Token | Value |
| --- | --- |
| `--background` | `0 0% 10%` |
| `--foreground` | `0 0% 82%` |
| `--card` | `0 0% 10%` |
| `--card-foreground` | `0 0% 82%` |
| `--popover` | `0 0% 10%` |
| `--popover-foreground` | `0 0% 82%` |
| `--primary` | `0 0% 82%` |
| `--primary-foreground` | `0 0% 10%` |
| `--secondary` | `0 0% 16%` |
| `--secondary-foreground` | `0 0% 82%` |
| `--muted` | `0 0% 16%` |
| `--muted-foreground` | `0 0% 62%` |
| `--accent` | `0 0% 16%` |
| `--accent-foreground` | `0 0% 82%` |
| `--destructive` | `0 62% 30%` |
| `--destructive-foreground` | `0 0% 98%` |
| `--border` | `0 0% 10%` |
| `--input` | `0 0% 10%` |
| `--ring` | `0 0% 82%` |

### Additional color groups

- Chart palette: `--chart-1` to `--chart-5`
- Sidebar palette: `--sidebar-*`
- Glass/paper tokens:
  - `--surface-texture`
  - `--surface-shadow`
  - `--glass-backdrop`
  - `--glass-border`

### Tailwind aliases

Tailwind maps semantic colors to CSS variables:
- `background`, `foreground`
- `primary`, `secondary`, `muted`, `accent`, `destructive`
- `card`, `popover`
- `border`, `input`, `ring`
- `chart.*`, `sidebar.*`

## Typography

### Loaded fonts

- `Spectral` (`--font-spectral`)
- `IBM Plex Sans` (`--font-ibm-plex-sans`)
- CJK serif families loaded via Google Fonts stylesheet:
  - `Noto Serif SC`, `Noto Serif TC`, `Noto Serif JP`, `Noto Serif KR`
- Code stack includes `Maple Mono` variants.

### Tailwind font families

- Base: `sans`, `serif`, `mono`
- Locale families:
  - `zh-sans`, `zh-serif`
  - `zh-hant-sans`, `zh-hant-serif`
  - `ja-sans`, `ja-serif`
  - `ko-sans`, `ko-serif`

### Global helper classes

- Font helpers: `.font-en-*`, `.font-zh-*`, `.font-zh-hant-*`, `.font-ja-*`, `.font-ko-*`
- Semantic text styles:
  - `.cv-title` (`text-4xl md:text-5xl`, serif)
  - `.cv-subtitle` (`text-lg`, sans)
  - `.cv-body` (`text-base`, serif)
  - `.cv-meta` (`text-sm`, sans)
  - `.cv-section-title` (`text-2xl`, sans, bold)

### Locale typography tuning

Tailwind extends script-sensitive scales:
- `letterSpacing`: `zh`, `ja`, `ko`, `en`
- `lineHeight`: `zh`, `ja`, `ko`, `en`, `title`

## Spacing and Layout Rhythm

### Shell spacing

- `body`: `px-5 py-5 sm:px-6 sm:py-0 md:px-7 lg:px-8`
- `cv-container`: `max-w-6xl lg:max-w-7xl`, `pt-4 pb-6 sm:pt-0 sm:pb-0 lg:pt-4 lg:pb-6`
- Main grid: `grid-cols-1` -> `lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]`
- Inter-column gap: `gap-4 lg:gap-10`

### Section rhythm

- Right column vertical padding: `sm:py-4 lg:py-6`
- Section spacing: `[&>section]:mb-7 sm:[&>section]:mb-8 lg:[&>section]:mb-12`
- Card/list rhythm uses compact spacing (`mb-2`, `sm:mb-3`, `gap-y-2` patterns in sections)

### Link/badge spacing patterns

- Inline markdown links use dashed underline with hover/focus solid underline.
- Badges/chips are compact by default (`px-2 py-1`, small icon/text density).

## Shape, Radius, and Surface

- Base radius token: `--radius: 8px`
- Tailwind radius mapping:
  - `rounded-lg = var(--radius)`
  - `rounded-md = calc(var(--radius) - 2px)`
  - `rounded-sm = calc(var(--radius) - 4px)`
  - `rounded-xl = calc(var(--radius) + 2px)`
  - `rounded-2xl = calc(var(--radius) + 8px)`
- Project-specific radii:
  - Hero map canvas: `1rem`
  - Contact hover container: `0.75rem`
  - Avatar: `rounded-3xl`

## Motion and Interaction

### Tailwind keyframes/animations

- `accordion-down`, `accordion-up`
- `fade-in`
- `slide-up`

### Transition style conventions

- Compact micro-interactions on links/badges (`duration-200` to `duration-300`)
- Reduced motion support:
  - Under `prefers-reduced-motion`, animation/transition durations are effectively disabled.

## Accessibility and Contrast

- High contrast mode (`prefers-contrast: high`) removes decorative borders for paper cards and badges.
- Typography minimums in use:
  - Body text at `text-base`
  - Metadata minimum at `text-sm`
- Tooltip/popover surfaces use theme-aware semantic tokens (`bg-popover`, `text-popover-foreground`).
