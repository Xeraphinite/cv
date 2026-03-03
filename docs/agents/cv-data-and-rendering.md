# CV Data And Rendering

## Data Sources
- Primary CV data source is `data/cv.toml`.
- Default content locale (`en`) resolves to `data/cv.toml`, not `data/cv.en.toml`.
- Localized overrides live in `data/cv.{locale}.toml` and should contain locale-specific overrides only.
- When `data/cv.toml` changes, keep localized files aligned to the same record structure and item parity.
- For `data/cv.ja.toml` and `data/cv.zh.toml`, keep parity with English by translation, not by copying raw English text.
- `lib/load-cv-data.ts` maps TOML into `CVData`.
- TOML text fields preserve Markdown and render through `components/ui/markdown-text.tsx`.

## Hero / Profile Data
- Use `profile.position` or localized `hero.position` for the left-column hero role/title.
- Use `profile.summary` / `hero.bio` for the right-column About content.
- In Japanese hero content, use `profile.furigana_name` and `profile.furigana`; when values are `|`-separated, render segmented ruby aligned to each base chunk.
- Keep furigana in normal ruby layout; do not fake it with absolutely positioned `rt`.
- In Japanese locale hero, show the English name beneath the Japanese display name.
- In English locale hero, show the original-script name first and the English name beneath when both exist.

## Structured Content Rules
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
