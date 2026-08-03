# Section And Component Rules

## Shared Section Layout
- Time-based sections should render date/time first using muted sans text, followed by content.
- Use `yyyymm` when month exists; otherwise show `yyyy`.
- Date parsing should support CJK and Korean year/month markers.
- In Experience and Education, render month as superscript in `yyyymm`.
- Avoid calendar/date icons for row timestamps.
- In two-column time layouts, keep non-time content aligned to the second column.

## About, News, Publications, Projects
- Use `text-base` for About content and News row description content.
- Keep About-section micro-interactions inline, decorative, data-driven through `BioMark`, and safe for reduced-motion preferences.
- Use `text-base` for Selected Projects titles, Publications titles, and Awards main item lines.
- News rows should show only `date` plus description text and sort newest first.
- For News items with custom link labels, put links directly in `summary` Markdown and leave `url` empty.
- Do not append trailing external-link icons for URL links inside News rows.
- Publications should use a concise year-first layout with compact metadata, without heavy card styling.
- Publication owner-name highlighting should match `profile.aliases` plus normalized full-name and initial-based variants.
- Render project names in sans and descriptions in serif.
- Render project status as a compact badge.
- Render project tech stacks with `SkillItemBadge`.

## Skills
- Use `components/sections/skill-item-badge.tsx` as the shared skills chip component.
- Style skills chips like restrained stickers: use a white face in light mode, a black face in dark mode, a bright die-cut rim, and a compact offset shadow.
- Before adding or updating skills icon IDs, verify them through the Iconify API and keep only IDs that resolve.
- If a skill item omits `icon` and has `url`, derive a favicon from the URL host.
- When `code = true`, render the badge with `font-mono`; otherwise use `font-sans`.
- Language-skill badges in the main Skills section should use `font-serif`.
- If `description` exists, show concise hover content via shadcn `Tooltip`.
- Skills tooltip description text should be plain strings in `font-sans` (do not use `MarkdownText`).
- Main Skills rows use a two-column layout with a fixed-width right-aligned category label and flexible badges.
- Keep that two-column skills layout on both mobile and larger screens.
- Category labels in main Skills rows use `font-sans text-lg`.
- Do not show trailing external-direction icons in Skills badges.
- Keep Interests under `Misc` and render it as a dedicated bottom section.

## Education, Experience, Awards
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

## Hero, Shell, TOC
- Keep the hero section single-column on small and medium screens; switch to a two-column page shell at `lg`.
- On non-`lg`, use the sticky mobile `CVHeader` behavior for controls.
- CV page shell is one column by default and two columns at `lg`, with hero in column 1 and all other sections in column 2.
- Keep second-column vertical padding at `py-2 sm:py-4 lg:py-6`.
- Right column order is `about` -> `news` -> `education` -> `projects` -> `publications` -> `experience` -> `skills` -> `awards` -> `patents` -> `copyrights` -> `misc`.
- `section#about` should use the locale `navigation.about` label.
- On `lg`, keep the first-column sticky panel near full viewport height with minimal outer margin and no extra gap between hero content and footer.
- Hero card content stays vertically stacked: avatar, name, bio, contacts.
- The hero signature uses outlined 壹城ラウラfont glyph artwork: simplified `郑恪悠` in English and Chinese, and Japanese/traditional `鄭恪悠` in Japanese. Separate the Laura outline into disjoint ordered stroke regions using normalized Hanzi Writer medians; do not use another font's stroke outlines as masks. Assign intersections to the later crossing stroke so neighboring fragments never appear early. Show the completed signature initially, play the writing animation on its first pointer hover only, cross-fade the stroke layer into the exact font outline without changing the finished appearance, optically align the first visible brush stroke with the sidebar content edge, render Japanese furigana in the same handwritten style and center it per character, render the smaller English name beneath it with matching Laura outlines, and honor reduced-motion and print fallbacks. Keep the locally installed font binary out of the repository because its license prohibits redistribution.
- Use `pt-4` for first-column top spacing and `pb-4` for compact footer bottom spacing.
- Hero contacts should be one item per line and wrap values instead of truncating.
- Hero contact hover cards should use service-specific presentations instead of one shared card style: an airmail envelope for email, a contribution grid for GitHub, a profile summary for social accounts, a metadata preview for personal websites, and an independent academic profile card for Google Scholar. Keep non-contact metadata tooltips top-positioned.
- Keep hero contact hover cards and the location map preview on the same `rounded-xl` outer corner radius; embedded map surfaces must match the containing preview.
- Anchor contact cards above and start-aligned with their trigger so they remain inside the sidebar footprint instead of covering the adjacent content column. Preserve viewport collision padding so the card can flip when space is constrained.
- Service profile cards must render data returned by the real public profile or a dated, verified snapshot of that profile. Never generate placeholder activity, citation trends, follower counts, biographies, or other profile facts.
- Do not add extra left inset for contact rows.
- Use margin-based spacing between hero contact rows.
- Contact hover backgrounds should wrap only the actual content.
- Hero location text should use locale-aware serif font.
- Hero location uses a dedicated `HeroLocation` component.
- In `HeroLocation`, prefer generic identifier names for map constants and labels.
- Do not transform hero location display strings by prefix replacement; render source text directly.
- For the hero location hover map, keep the card within the sidebar footprint and show the map as the sole preview instead of repeating place or region labels in overlays. Keep the marker high-contrast, keep wheel zoom enabled, hide attribution text, and position the marker near the top-right-center by tuning camera settings.
- Build TOC items from rendered `main section[id]` headings instead of hardcoding them.
- TOC trigger should show text and chevron only.
- Do not render a sticky/mobile TOC header in locale layouts.
- Keep mobile locale/theme controls in `CVFooter`; do not maintain parallel `CVControls` or TOC-header control UIs.
