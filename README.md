# CV

A multilingual CV site built with Next.js 16, React 19, Tailwind CSS, and TOML-backed content.

This repo is structured around a single resume data source with locale-specific overrides, compact section-based rendering, generated `llms.txt`, and Cloudflare Pages deployment support.

## Overview

- App Router project on Next.js `16.1.6`
- Locales: `en`, `zh`, `ja`
- Default locale is unprefixed (`/`), non-default locales are prefixed (`/zh`, `/ja`)
- CV content comes from `data/cv.toml` plus locale overrides in `data/cv.{locale}.toml`
- Markdown-capable TOML fields render through the MDX runtime
- Includes localized Accessibility, Privacy, and `llms.txt` pages
- Footer visitor stats are backed by Umami
- Cloudflare Pages deployment is supported through `@cloudflare/next-on-pages@1`

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- `next-intl`
- `@iconify/react` with MingCute icons
- Biome
- Playwright
- TOML via `smol-toml`

## Project Structure

```text
app/
  (cv)/[locale]/              CV routes
  (a11y)/[locale]/            Accessibility and privacy pages
  api/umami/visitors/route.ts Umami-backed footer stats API
  llms.txt/                   Generated LLMs.txt routes
components/
  layout/                     Header, footer, locale/theme controls
  sections/                   CV section rendering
  ui/                         Shared UI primitives
data/
  cv.toml                     Default English CV source
  cv.zh.toml                  Chinese overrides
  cv.ja.toml                  Japanese overrides
  accessibility/              Localized accessibility statements
  privacy/                    Localized privacy statements
lib/
  config/app-config.ts        Locale and site configuration
  load-cv-data.ts             TOML loading and CV mapping
messages/                     `next-intl` locale messages
public/                       Static assets
```

## Development

### Requirements

- Node.js 18+
- `pnpm`

### Install

```bash
pnpm install
```

### Start the dev server

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm format
pnpm check
pnpm optimize-images
pnpm cf:build
pnpm cf:deploy
```

## Content Model

### CV data

- Primary source: `data/cv.toml`
- Default content locale `en` resolves to `data/cv.toml`
- Locale overrides live in `data/cv.zh.toml` and `data/cv.ja.toml`
- Inactive future locales such as `yue` and `ko` can remain in the repo without being enabled

Keep localized CV files aligned with the same record structure and item parity as the default file.

### Other content

- Accessibility statements: `data/accessibility/statement*.md`
- Privacy statements: `data/privacy/statement*.md`
- Translations: `messages/*.json`

## Routing

- `/` -> English CV
- `/zh` -> Chinese CV
- `/ja` -> Japanese CV
- `/accessibility`, `/zh/accessibility`, `/ja/accessibility`
- `/privacy`, `/zh/privacy`, `/ja/privacy`
- `/llms.txt`, `/zh/llms.txt`, `/ja/llms.txt`

Locale detection redirect is disabled. The default locale stays unprefixed.

## Configuration Notes

- Locale and site metadata config lives in `lib/config/app-config.ts`
- Middleware locale routing is implemented in `middleware.ts`
- `next.config.mjs` configures raw loading for `.md` and `.toml` in both Turbopack and webpack
- Global runtime styles live in `app/globals.css`

## Analytics Environment

Footer visitor metrics use Umami through `app/api/umami/visitors/route.ts`.

Required server environment variables:

```bash
UMAMI_API_KEY=...
UMAMI_WEBSITE_ID=...
```

Optional:

```bash
UMAMI_API_BASE_URL=https://api.umami.is/v1
```

## Deployment

This repo targets Cloudflare Pages.

Build static output for Cloudflare Pages:

```bash
pnpm cf:build
```

Deploy:

```bash
pnpm cf:deploy
```

The deploy script uses:

- `npx @cloudflare/next-on-pages@1`
- `wrangler pages deploy .vercel/output/static`

## Docs

- [docs/components.md](./docs/components.md)
- [docs/customization.md](./docs/customization.md)
- [docs/data-structure.md](./docs/data-structure.md)
- [docs/i18n.md](./docs/i18n.md)
- [docs/typography.md](./docs/typography.md)

## Workflow Notes

- Use `pnpm` for all package management and scripts
- Prefer updating CV content in TOML instead of hardcoding section content
- Use Biome for formatting and Tailwind class sorting/dedup lint
- Save Playwright artifacts under `output/playwright/`
