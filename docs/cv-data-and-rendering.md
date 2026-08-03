# CV Data And Rendering

## Data Sources
- Primary CV data source is `data/cv.toml`.
- Default content locale (`en`) resolves to `data/cv.toml`, not `data/cv.en.toml`.
- Localized overrides live in `data/cv.{locale}.toml` and should contain locale-specific overrides only.
- When `data/cv.toml` changes, keep localized files aligned to the same record structure and item parity.
- For `data/cv.ja.toml` and `data/cv.zh.toml`, keep parity with English by translation, not by copying raw English text.
- `lib/load-cv-data.ts` maps TOML into `CVData`.
- TOML text fields preserve Markdown and render through `components/ui/markdown-text.tsx`.

## Minimal Runtime Shape
- `CVData` core sections: `hero`, `education`, `publications`, `experience`, `skills`, `awards`.
- Optional sections: `news`, `projects`, `patents`, `copyrights`, `talks`, `sectionConfig`.
- Current top-level TOML tables in `data/cv.toml`: `profile`, `education`, `experience`, `publications`, `news`, `projects`, `skills`, `awards`, `patents`, `copyrights`, `sectionConfig`.

## Hero / Profile Data
- Do not render a standalone hero role/title; keep identity and research context in the About copy.
- Use `profile.summary` / `hero.bio` for the right-column About content.
- About copy may use the registered `<BioMark icon="mingcute:…" effect="…">phrase</BioMark>` MDX component for small inline identity icons. Supported effects are `research`, `drift`, `craft`, `beat`, and `graduate`.
- Use simplified `profile.furigana_name` as the animated original-script name in English and Chinese. Set the localized Japanese hero override `furiganaName = "鄭|恪|悠"` so it renders the Japanese/traditional `鄭` form.
- In Japanese, split `profile.furigana` on `|` and center each reading over its corresponding signature character.
- Show the smaller English name beneath the original-script signature in every active locale.

## Structured Content Rules
- Education entries support an optional `supervisor` field, rendered with the localized supervisor label.
- Publication entries support `image` / `image_alt` and comma-separated `metadata`; from the `sm` breakpoint, render publication highlights as large rounded thumbnails at the left, sized to roughly match the item height. Hide them on smaller screens and keep locale-specific `imageAlt` text in localized overrides.
- Publication metadata keeps quartile and impact factor values structured while preserving other labels such as conference rank, presentation type, and acceptance rate.
- Skills `items` support string form or object form with `text`/`name`, optional `icon`, `url`, `code`, and `description`.
- Main Skills category order is `Languages` -> `Programming Languages` -> `DevOps` -> `AI Engineering` -> `Web Dev & Design` -> `Backend Development`; `Misc` renders as a separate bottom section.
- News data lives under `[news.*]` with `title`, `outlet`, `date`, `summary`, and `url`, mapped to `CVData.news`.
- Patents data lives under `[patents.*]` with `number`, `title`, `filed`, `status`, `country`, and `inventors`, mapped to `CVData.patents`.
- Copyrights data lives under `[copyrights.*]` with `title`, `year`, `status`, `country`, and `holders`, mapped to `CVData.copyrights`.
- In Patents/Copyrights rows, render timestamps with the same unified style as other CV date columns (including superscript month when month exists).
- In Patents/Copyrights rows, sort items newest first by date/year (same ordering behavior as Publications).
- In Patents/Copyrights contributor lists, auto-bold profile owner names using the same alias/variant matching logic as Publications.
- In Patents/Copyrights rows, text order should be: title (line 1) -> contributors/holders (line 2) -> metadata (line 3).
- Patent metadata line should show country-prefixed patent number format (e.g., `US 18/662,981`).
- For project entries carrying experience-style fields (`start/end/role/org/location/summary/details`), render them in Experience and exclude them from Selected Projects.
- Projects data lives under `[projects.*]` / `[[projects]]`; do not fall back to mock data.
- Project fields support `year`, `name`, `status`, `description`, optional `preview_images`, optional `urls`, and optional `tech`.
- `components/sections/talks-section.tsx` exists, but Talks is currently not mounted in the main CV page composition.
