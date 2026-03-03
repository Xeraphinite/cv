# AGENTS.md

This file is now a table of contents for agent instructions. Detailed conventions are split into `docs/agents/*`.

## Table Of Contents
- [Workflow](docs/agents/workflow.md)
- [UI Conventions](docs/agents/ui-conventions.md)
- [CV Data And Rendering](docs/agents/cv-data-and-rendering.md)
- [App Architecture](docs/agents/app-architecture.md)
- [Section And Component Rules](docs/agents/sections-and-components.md)
- [Footer, Secondary Pages, And Integrations](docs/agents/footer-pages-integrations.md)

## General Website Workflow
1. Align scope first: identify target section/page, locale impact (`en` / `zh` / `ja`), and whether change is UI, content, data, or architecture.
2. Check source of truth before editing:
   - Content/data in `data/cv.toml` and `data/cv.{locale}.toml`.
   - Routing/config/runtime in `lib/config/app-config.ts`, `app/`, and `middleware.ts`.
   - Styling/layout conventions in `app/globals.css` and section components.
3. Implement with project conventions:
   - Use `pnpm`.
   - Prefer semantic `cv-*` helpers and existing shared components.
   - For vertical rhythm, use shared spacing helpers: `cv-sections-stack` for section spacing and `cv-items-stack` for item lists.
   - Keep locale parity and section ordering rules intact.
4. Validate locally:
   - Run `pnpm dev` for manual checks.
   - For UI/layout/style changes, verify in browser with Playwright and include an accessibility check.
5. Finish with documentation hygiene:
   - If a new reusable rule was introduced, update the relevant `docs/agents/*.md`.
   - Keep this TOC and workflow summary current.

## Maintenance Rule
- When a reusable project convention or user preference changes, update the relevant `docs/agents/*.md` file and keep this TOC current.
