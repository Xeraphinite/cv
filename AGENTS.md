# AGENTS.md

## Devops
- Always use `pnpm` for package management.
- Always update `AGENTS.md` for any reusable knowledge or user preferences that should be followed across the project.
- For UI/layout/style changes, always validate with Playwright before finalizing.

## User Preferences
- Use `mingcute` icons for CV/UI iconography whenever an icon is needed.
- Prefer `@iconify/react` with icon IDs in the form `mingcute:*`.
- Do not introduce new `lucide-react` icons in CV/layout features unless explicitly requested.

## Reusable Project Knowledge
- CV data source:
  - Primary source is TOML at `data/cv.toml`.
  - Loader maps TOML to app `CVData` in `lib/load-cv-data.ts`.
  - Fallback YAML loading remains available for locale files in `data/cv.{locale}.yaml`.
- Centralized app config:
  - `lib/config/app-config.ts` contains:
    - intl locales/default/labels
    - metadata labels
    - CV data source settings
- Typography policy:
  - Keep the configured font families (`Spectral`, `Noto Serif SC`, `Rethink Sans`, `Inconsolata`).
  - Do not force xyndrome font-size values unless explicitly requested.
- Code-like text:
  - Keep mono font for `code`/`pre` via `Inconsolata`.
- Awards/Honors iconography:
  - Use `mingcute:medal-fill` for section headers and `mingcute:medal-line` for compact/stat contexts.
- Hero layout breakpoint:
  - Keep the hero section single-column on small/medium screens; switch to two-column split at `lg:`.
  - On non-`lg`, use the sticky mobile navigator-style `CVHeader` UX (show/hide on scroll) for controls.
  - CV page shell should be one column by default, and at `lg:` use two columns with hero as column 1 and all other sections as column 2.
  - On `lg`, first-column sticky panel should use viewport-height so the footer area sits at viewport bottom (with only small outer page margin), not content bottom.
  - On `lg`, keep no extra spacing between hero content and footer block.
  - In the hero card, keep content vertically stacked (no avatar/name same-row split on `lg`): Avatar -> Name -> Description/Bio -> Contacts.
  - Remove top spacing above avatar/icon in hero wrapper so the avatar aligns flush with the content top.
  - Contacts in hero should be one item per line (icon + value), with values wrapping instead of truncating.
  - Do not add left padding/inset for contact rows; icon should not reserve extra left spacing.
  - Use `space-y` on the hero contacts list for vertical separation between contact rows.
  - Contact hover background should wrap only real content (`w-fit`/`self-start`) with rounded corners; inner padding should apply on hover only.
  - Hero location text should use locale-aware serif font.
- Print styling policy:
  - Do not use Tailwind `print:*` variants or `@media print` overrides in runtime app styles/components.
- TOC behavior:
  - Do not hardcode TOC items in header/components.
  - Build TOC from rendered `main section[id]` elements and section headings so it stays in sync with shown sections.
  - TOC trigger should not show a leading icon; keep label text and chevron only.
- Footer behavior:
  - Show `lastUpdated` as locale-aware relative time (e.g., today / 2 days ago) instead of absolute date.
  - `lastUpdated` should be computed from CV source file mtime via `getCVLastUpdated` in `lib/load-cv-data.ts`, not from browser page metadata.
  - Footer links should include only `LLMs.txt` (no RSS/Sitemap links).
  - On `lg`, do not show TOC in first-column bottom area.
  - On `lg`, place language and theme controls in footer immediately after `LLMs.txt`.
