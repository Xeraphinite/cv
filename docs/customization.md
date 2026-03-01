# Customization

This project is customized primarily through TOML content, locale message files, and shared CSS tokens in `app/globals.css`.

## Main Entry Points

- Content: `data/cv.toml`, `data/cv.zh.toml`, `data/cv.ja.toml`
- Locale messages: `messages/en.json`, `messages/zh.json`, `messages/ja.json`
- Site and locale config: `lib/config/app-config.ts`
- Global styles and tokens: `app/globals.css`
- Tailwind theme extension: `tailwind.config.ts`

## Content Customization

### CV content

Update structured CV content in:

- `data/cv.toml`
- `data/cv.zh.toml`
- `data/cv.ja.toml`

The default English source is `data/cv.toml`. Localized files are override payloads, not separate full schemas.

### Secondary pages

Update secondary content here:

- Accessibility: `data/accessibility/statement.md` and locale overrides
- Privacy: `data/privacy/statement.md` and locale overrides

### Messages

UI strings come from `messages/*.json`. Update these when section labels, tooltips, or footer copy changes.

## Visual Customization

### Theme tokens

Color tokens, paper styles, typography helpers, and link treatments live in `app/globals.css`.

Key areas:

- light and dark CSS custom properties under `:root` and `.dark`
- shared shell classes such as `.paper-container`, `.paper-card`, `.paper-section-title`
- locale-aware font utility classes such as `.font-en-serif`, `.font-ja-sans`
- inline URL styling through `.inline-url-link*`

### Tailwind theme

`tailwind.config.ts` extends:

- font families
- letter spacing
- line heights
- color tokens bound to CSS variables
- animation and keyframe utilities

Use `tailwind.config.ts` when you need new theme primitives. Use `app/globals.css` when you need runtime tokens or semantic helper classes.

## Layout Customization

### Page shell

The main CV shell lives in `components/sections/cv.tsx`.

Adjust this file when changing:

- top and bottom page spacing
- column widths
- section order
- desktop sticky behavior

### Footer and controls

Adjust `components/layout/cv-footer.tsx` when changing:

- mobile controls
- footer line layout
- relative-time display
- footer links

### Hero behavior

Adjust `components/sections/hero-section.tsx` and related hero-location components when changing:

- contact layout
- avatar treatment
- location display
- map hover behavior

## Typography And Icons

- Default English serif: `Spectral`
- Default English sans: `IBM Plex Sans`
- Code-like text: `Maple Mono`
- CJK serif and sans handling is refined through locale-specific classes in `app/globals.css` and font stacks in `tailwind.config.ts`
- CV iconography should use `@iconify/react` with `mingcute:*` IDs

## Routing And Metadata

Locale routing and labels are configured in `lib/config/app-config.ts`, `i18n.ts`, and `middleware.ts`.

Adjust those files when changing:

- supported locales
- default locale
- locale labels
- locale-prefixed path behavior
- site metadata base or localized titles

## Analytics

Footer analytics come from Umami.

Relevant files:

- `app/api/umami/visitors/route.ts`
- `components/layout/umami-indicators.tsx`

Relevant env vars:

```bash
UMAMI_API_KEY=...
UMAMI_WEBSITE_ID=...
UMAMI_API_BASE_URL=https://api.umami.is/v1
```

## Workflow

Use these commands while customizing:

```bash
pnpm dev
pnpm lint
pnpm lint:fix
pnpm format
pnpm check
```

For UI changes, validate in a browser and keep Playwright artifacts under `output/playwright/`.
