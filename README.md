# Minimal CV

Multilingual CV site built with Next.js 16, React 19, Tailwind CSS, and TOML content.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Core Setup

- Locales: `en`, `zh`, `ja`
- Routing: `en` is unprefixed, non-default locales are prefixed (`/zh`, `/ja`)
- Main data source: `data/cv.toml`
- Locale overrides: `data/cv.zh.toml`, `data/cv.ja.toml`
- Global style/token source: `app/globals.css`

## Common Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm lint:fix
pnpm check
pnpm cf:build
pnpm cf:deploy
```

## Umami Env Vars

Required:

```bash
UMAMI_API_KEY=...
UMAMI_WEBSITE_ID=...
```

Optional:

```bash
UMAMI_API_BASE_URL=https://api.umami.is/v1
```

## Documentation
- [Workflow](./docs/workflow.md)
- [UI Conventions](./docs/ui-conventions.md)
- [CV Data And Rendering](./docs/cv-data-and-rendering.md)
- [App Architecture](./docs/app-architecture.md)
- [Section And Component Rules](./docs/sections-and-components.md)
- [Footer, Secondary Pages, And Integrations](./docs/footer-pages-integrations.md)
