# AGENTS.md

## Workflow

### Tooling
- Always use `pnpm`.
- Run the local Next.js dev server with `pnpm dev` on Next.js 16+.
- Update `AGENTS.md` whenever a reusable project convention or user preference changes.
- Prefer local Git hooks (`husky` + `lint-staged`) over CI-only enforcement; staged files should run Biome formatting and Tailwind class sorting/dedup lint.

### MCP / Browser Validation
- Keep workspace-local VS Code MCP config in `.vscode/mcp.json` using `next-devtools-mcp@latest` when this project needs Next MCP discovery.
- For Next.js work in this repo, initialize `next-devtools` first and follow its `init` guidance when the server is available.
- For browser inspection, layout debugging, console/network investigation, or visual verification, prefer `chrome-devtools` when available.
- For UI/layout/style changes, validate with Playwright before finalizing.
- For UI/layout/style changes, also run an accessibility check via Playwright before finalizing.

## UI Conventions

### Iconography
- Use `mingcute` icons for CV/UI iconography.
- Prefer `@iconify/react` with icon IDs in the form `mingcute:*`.
- Do not introduce new `lucide-react` icons in CV/layout features unless explicitly requested.
- Use `mingcute:arrow-right-up-fill` for external links.
- Use `mingcute:news-fill` for the News section header.
- Use `mingcute:medal-fill` for Awards section headers and `mingcute:medal-line` for compact/stat contexts.
- Use `mingcute:telescope-fill` for the Experience section header.
- Use `mingcute:at-fill` in Experience item meta.
- Use `mingcute:mortarboard-fill` for school-cap iconography in hero location UI.

### Typography
- Use `Spectral` as the default serif family and `IBM Plex Sans` as the default sans family for English (`en`) content.
- For non-English serif text (`zh`, `zh-hant`, `ja`, `ko`), use locale-appropriate `Noto Serif` variants as the primary serif stack.
- Do not use `Noto Serif SC` as a cross-locale serif fallback; map locale-specific serif variants (`CJK SC` / `TC` / `JP` / `KR`) per language.
- Use `Maple Mono` for code-like text.
- Keep section titles at `text-2xl`.
- Default body and description/detail copy to `text-base`; keep `text-sm` as the minimum size.
- In rendered Markdown, keep clear paragraph-to-paragraph spacing.
- Keep readable contrast for muted UI text; avoid overly faint muted text on badges or dense metadata.
- Tooltip text should default to `font-sans`.
- Hover card and tooltip panels should use theme-aware popover surfaces.

### Links, Chips, and Cards
- Inline URL links rendered in text/Markdown should use a dim dashed underline by default, switch to solid underline on hover/focus, and append trailing `mingcute:arrow-right-up-fill`.
- Keep non-inline section links unchanged.
- Keep badges/chips compact by default: small pill padding, small icons, and tight inter-chip spacing.
- When a roomier badge layout is explicitly requested, increase chip-group gap and slightly widen chip padding.
- Keep `.paper-card` top and bottom padding removed by default (`pt-0 pb-0`).
- Keep `.paper-card` content unrounded unless explicitly requested otherwise.
- In section components, avoid Tailwind `!` modifiers; prefer semantic helper classes in `app/globals.css`.

### Spacing and Layout Rhythm
- Keep section spacing compact by default and use margin-based vertical rhythm.
- Use bottom spacing (`mb-*`) for section content rhythm; avoid `mt-*` for equivalent spacing.
- Apply per-section spacing on `section[id]` wrappers with responsive `mb-*` classes instead of shared CSS margins.
- In-section item lists should use a unified `gap-y-2` by default.
- Within a section component, keep one spacing strategy consistently instead of mixing equivalent patterns.
- On mobile (`< sm`), favor readable spacing and full-width content usage over dense packing.
- If overall mobile spacing needs to change, adjust shared page-shell/body gutters before per-section overrides.
- If overall CV top/bottom spacing needs to change, adjust the top-level shell in `components/sections/cv.tsx`.
- If mobile spacing changes involve the sticky header or footer, adjust `components/layout/cv-header.tsx` and `components/layout/cv-footer.tsx` directly.
- For timeline-style rows, stack on mobile and switch to two-column alignment from `md` upward.

## CV Data And Rendering

### Data Sources
- Primary CV data source is `data/cv.toml`.
- Default content locale (`en`) resolves to `data/cv.toml`, not `data/cv.en.toml`.
- Localized overrides live in `data/cv.{locale}.toml` and should contain locale-specific overrides only.
- When `data/cv.toml` changes, keep localized files aligned to the same record structure and item parity.
- For `data/cv.ja.toml` and `data/cv.zh.toml`, keep parity with English by translation, not by copying raw English text.
- `lib/load-cv-data.ts` maps TOML into `CVData`.
- TOML text fields preserve Markdown and render through `components/ui/markdown-text.tsx`.

### Hero / Profile Data
- Use `profile.position` or localized `hero.position` for the left-column hero role/title.
- Use `profile.summary` / `hero.bio` for the right-column About content.
- In Japanese hero content, use `profile.furigana_name` and `profile.furigana`; when values are `|`-separated, render segmented ruby aligned to each base chunk.
- Keep furigana in normal ruby layout; do not fake it with absolutely positioned `rt`.
- In Japanese locale hero, show the English name beneath the Japanese display name.
- In English locale hero, show the original-script name first and the English name beneath when both exist.

### Structured Content Rules
- Skills `items` support string form or object form with `text`/`name`, optional `icon`, `url`, `code`, and `description`.
- Main Skills category order is `Languages` -> `Programming Languages` -> `DevOps` -> `AI Engineering` -> `Web Dev & Design` -> `Backend Development`; `Misc` renders as a separate bottom section.
- News data lives under `[news.*]` with `title`, `outlet`, `date`, `summary`, and `url`, mapped to `CVData.news`.
- Projects data lives under `[projects.*]` / `[[projects]]`; do not fall back to mock data.
- Project fields support `year`, `name`, `status`, `description`, optional `preview_images`, optional `urls`, and optional `tech`.

## App Architecture

### Config And Routing
- `lib/config/app-config.ts` is the centralized source for locales, metadata labels, and CV data source settings.
- Always pass `locale` to `NextIntlClientProvider` in locale layouts.
- Active locales are `en`, `zh`, and `ja`; keep `yue` / `ko` files in the repo for future re-enable.
- Locale routing uses explicit default-locale routes: `en` is unprefixed via dedicated routes, and non-default locales are prefixed under `[locale]`.
- Do not use client-side locale auto-switch prompts or browser-language detection.

### App Router / Runtime
- In `app/` routes, do not use `next/head`; use the Metadata API and/or native `<head>` in layouts.
- Keep CV pages under `app/(cv)/[locale]`.
- Keep accessibility pages under `app/(a11y)/[locale]/accessibility`.
- `app/globals.css` is the runtime global stylesheet source of truth; do not reintroduce `styles/globals.css`.
- Theme tokens consumed by Tailwind must be defined in `app/globals.css` for both light and dark modes.
- Load primary fonts with `next/font` in locale root layouts; do not use CSS `@import` for Google Fonts in `app/globals.css`.
- For SSR-rendered components, do not use render-time nondeterministic values such as `Math.random()` or `Date.now()`.

### Next.js / Cloudflare Constraints
- Cloudflare deploys in this repo target Workers via `@opennextjs/cloudflare`, not Pages via `@cloudflare/next-on-pages`.
- Keep Cloudflare build/deploy scripts aligned with OpenNext: `opennextjs-cloudflare build` and `opennextjs-cloudflare deploy`.
- Keep Worker config in root `wrangler.jsonc` with `.open-next/worker.js` as the entrypoint and `.open-next/assets` as static assets.
- Do not add `export const runtime = "edge"` for Cloudflare compatibility in this repo; OpenNext Cloudflare does not support Edge runtime route segments here.
- Keep locale routing proxy-free; implement unprefixed English routes explicitly and localized routes under `app/**/[locale]`.

### Markdown / TOML Loading
- `components/ui/markdown-text.tsx` uses the MDX runtime (`@mdx-js/react` + `@mdx-js/mdx`); preserve current inline-link styling and paragraph spacing.
- `MarkdownText` block paragraphs should default to `text-base`.
- Do not wrap `MarkdownText` content in an outer `<a>` when the markdown may already contain links.
- For `.md` and `.toml` raw imports in Next.js dev with Turbopack, keep `raw-loader` rules mapped with `as: "*.js"`.
- On Next.js 16 in this repo, keep those rules under top-level `turbopack.rules`.
- Keep `pnpm build` on `next build --webpack` while the repo still relies on custom webpack raw-source rules for `.md` / `.toml`.
- Keep route-sensitive public assets at the `public/` root (`icon.png`, `rss.xml`, `sitemap.xml`); group general assets under subfolders such as `public/images/*`, `public/files/*`, and `public/data/*`.

## Section And Component Rules

### Shared Section Layout
- Time-based sections should render date/time first using muted sans text, followed by content.
- Use `yyyymm` when month exists; otherwise show `yyyy`.
- Date parsing should support CJK and Korean year/month markers.
- In Experience and Education, render month as superscript in `yyyymm`.
- Avoid calendar/date icons for row timestamps.
- In two-column time layouts, keep non-time content aligned to the second column.

### About, News, Publications, Projects
- Use `text-base` for About content and News row description content.
- Use `text-base` for Selected Projects titles, Publications titles, and Awards main item lines.
- News rows should show only `date` plus description text and sort newest first.
- For News items with custom link labels, put links directly in `summary` Markdown and leave `url` empty.
- Do not append trailing external-link icons for URL links inside News rows.
- Publications should use a concise year-first layout with compact metadata, without heavy card styling.
- Publication owner-name highlighting should match `profile.aliases` plus normalized full-name and initial-based variants.
- Render project names in sans and descriptions in serif.
- Render project status as a compact badge.
- Render project tech stacks with `SkillItemBadge`.

### Skills
- Use `components/sections/skill-item-badge.tsx` as the shared skills chip component.
- Before adding or updating skills icon IDs, verify them through the Iconify API and keep only IDs that resolve.
- If a skill item omits `icon` and has `url`, derive a favicon from the URL host.
- When `code = true`, render the badge with `font-mono`; otherwise use `font-sans`.
- Language-skill badges in the main Skills section should use `font-serif`.
- If `description` exists, show concise hover content via shadcn `HoverCard`.
- Main Skills rows use a two-column layout with a fixed-width right-aligned category label and flexible badges.
- Keep that two-column skills layout on both mobile and larger screens.
- Category labels in main Skills rows use `font-sans text-lg`.
- Do not show trailing external-direction icons in Skills badges.
- Keep Interests under `Misc` and render it as a dedicated bottom section.

### Education, Experience, Awards
- For Skills, Awards, Education, Experience, and Misc sections, keep section-title underline/border spacing tight.
- In Education, keep inter-item and intra-item spacing compact.
- In Education, hide detail/highlight bullet lists by default; show core metadata only.
- Education expected-suffix line splitting is controlled by `sectionConfig.education.splitExpectedLine` and uses locale text from `messages/*` key `labels.expected`.
- Experience items should show time in a muted leading column.
- Experience meta should show org/company only, not location.
- Awards should use concise two-column alignment similar to Education.
- Keep year-to-item horizontal spacing tight in Awards rows.
- Awards rows should follow the same per-item card/grid rhythm as Education.
- Awards date rendering should mirror Education date formatting.
- In Awards rows, keep award name at `text-base` and institution at `text-sm`.

### Hero, Shell, TOC
- Keep the hero section single-column on small and medium screens; switch to a two-column page shell at `lg`.
- On non-`lg`, use the sticky mobile `CVHeader` behavior for controls.
- CV page shell is one column by default and two columns at `lg`, with hero in column 1 and all other sections in column 2.
- Keep second-column vertical padding at `py-2 sm:py-4 lg:py-6`.
- Right column order is `about` -> `news` -> `projects` -> `publications` -> `experience` -> `education` -> `skills` -> `awards` -> `misc`.
- `section#about` should use the locale `navigation.about` label.
- On `lg`, keep the first-column sticky panel near full viewport height with minimal outer margin and no extra gap between hero content and footer.
- Hero card content stays vertically stacked: avatar, name, bio, contacts.
- Remove extra top spacing above the avatar.
- Hero contacts should be one item per line, wrap values instead of truncating, and use top-positioned shadcn tooltips.
- Do not add extra left inset for contact rows.
- Use margin-based spacing between hero contact rows.
- Contact hover backgrounds should wrap only the actual content.
- Hero location text should use locale-aware serif font.
- Hero location uses a dedicated `HeroLocation` component.
- In `HeroLocation`, prefer generic identifier names for map constants and labels.
- Do not transform hero location display strings by prefix replacement; render source text directly.
- For the hero location hover map, keep the marker high-contrast, keep wheel zoom enabled, hide attribution text, and position the marker near the top-right-center by tuning camera settings.
- Build TOC items from rendered `main section[id]` headings instead of hardcoding them.
- TOC trigger should show text and chevron only.
- Do not render a sticky/mobile TOC header in locale layouts.
- Keep mobile locale/theme controls in `CVFooter`; do not maintain parallel `CVControls` or TOC-header control UIs.

## Footer, Secondary Pages, And Integrations

### Footer
- Show `lastUpdated` as locale-aware relative time, not an absolute date.
- Compute `lastUpdated` from CV source file mtime via `getCVLastUpdated` in `lib/load-cv-data.ts`.
- Recalculate footer relative time client-side after hydration and keep it refreshing.
- Do not show a textual prefix before the relative time.
- Footer body text should stay at `text-sm` unless explicitly requested otherwise.
- Footer should include `© yyyy <owner>. All rights reserved.` on a single line.
- Render the footer in exactly three lines:
  - Line 1: last update time + visitor numbers + locale/theme toggles
  - Line 2: `LLMs.txt` + Accessibility + Privacy
  - Line 3: copyright
- In footer line 2, each item should have a leading mingcute icon.
- Keep footer bottom spacing compact.
- Use recency-based text tone for `lastUpdated`.
- Footer links should include `LLMs.txt`; do not add RSS or Sitemap links.
- Footer last-updated text, `LLMs.txt`, `Accessibility`, language control, and theme control should expose concise top-positioned tooltips.
- Footer language and theme controls should show the current selection as visible label text.
- On `lg`, do not show TOC in the first-column bottom area.

### Accessibility, Privacy, LLMs
- `LLMs.txt` is generated by `app/llms.txt/route.ts` and `app/[locale]/llms.txt/route.ts`, not from `public/llms.txt`.
- Keep `LLMs.txt` content sourced from localized CV data so `/llms.txt`, `/zh/llms.txt`, and `/ja/llms.txt` stay aligned.
- Accessibility statement content lives in `data/accessibility/statement.md` with locale overrides.
- Privacy statement content lives in `data/privacy/statement.md` with locale overrides.
- Accessibility page language switching should use a simple inline text-link switcher with slash separators and `aria-current`.
- Privacy content must explicitly state that Umami is used for visitor analytics.

### Umami / Artifacts
- Footer visitor counts must use real Umami aggregated stats from `app/api/umami/visitors/route.ts`.
- Footer online-now counts should come from the same route via the website `active` API.
- Keep Umami count-fetching/rendering centralized in `components/layout/umami-indicators.tsx`.
- Treat total visitors and online-now availability independently in footer UI.
- Use `UMAMI_API_KEY` and `UMAMI_WEBSITE_ID` server env vars; `UMAMI_API_BASE_URL` is optional and defaults to `https://api.umami.is/v1`.
- Save Playwright screenshots and artifacts under `output/playwright/`.
- Keep Playwright artifacts gitignored: `output/playwright/`, `playwright-report/`, `test-results/`, and `tmp-playwright-*.png`.
