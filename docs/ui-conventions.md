# UI Conventions

## Iconography
- Use `mingcute` icons for CV/UI iconography.
- Prefer `@iconify/react` with icon IDs in the form `mingcute:*`.
- Do not introduce new `lucide-react` icons in CV/layout features unless explicitly requested.
- Use `mingcute:arrow-right-up-fill` for external links.
- Use `mingcute:news-fill` for the News section header.
- Use `mingcute:medal-fill` for Awards section headers and `mingcute:medal-line` for compact/stat contexts.
- Use `mingcute:telescope-fill` for the Experience section header.
- Use `mingcute:at-fill` in Experience item meta.
- Use `mingcute:mortarboard-fill` for school-cap iconography in hero location UI.

## Typography
- Use `Spectral` as the default serif family and `IBM Plex Sans` as the default sans family for English (`en`) content.
- Keep localized sans typography within the IBM Plex family: use self-hosted `Frex Sans GB` for Simplified Chinese glyphs and `IBM Plex Sans JP` for Japanese glyphs, with Latin glyphs resolving to `IBM Plex Sans` first.
- For non-English serif text (`zh`, `zh-hant`, `ja`, `ko`), use locale-appropriate `Noto Serif` variants as the primary serif stack.
- In localized UI copy, prefer `.cv-locale-sans` / `.cv-locale-serif` over raw Tailwind `font-sans` / `font-serif` so `en` stays IBM Plex while CJK locales use the matching Plex sans or locale-specific serif stack consistently.
- Personal names written in Chinese characters should render in a locale-appropriate serif stack; on the English hero, the secondary Chinese name under the English name should use Chinese serif styling instead of English sans.
- Do not use `Noto Serif SC` as a cross-locale serif fallback; map locale-specific serif variants (`CJK SC` / `TC` / `JP` / `KR`) per language.
- Use `Maple Mono` for code-like text.
- Keep section titles at `text-2xl`.
- Default body and description/detail copy to `text-base`; keep `text-sm` as the minimum size.
- In rendered Markdown, keep clear paragraph-to-paragraph spacing.
- Keep prose and inline Markdown links in the normal inline formatting context so Unicode punctuation cannot be stranded at the start or end of a line; attach decorative trailing icons with a word joiner instead of an atomic flex wrapper.
- Use strict locale-aware line breaking for CJK prose and `text-wrap: pretty` for rendered Markdown.
- Keep readable contrast for muted UI text; avoid overly faint muted text on badges or dense metadata.
- Tooltip text should default to `font-sans`.
- Hover card and tooltip panels should use theme-aware popover surfaces.
- Tooltip copy should add context beyond visible labels; avoid repeating button/link text.
- Keep tooltip copy concise (typically one short phrase) and action-oriented.
- Prefer sentence case for tooltip copy and omit trailing periods for short fragments.

## Links, Chips, and Cards
- Inline URL links rendered in text/Markdown should use a dim dashed underline by default, switch to solid underline on hover/focus, and append trailing `mingcute:arrow-right-up-fill`.
- Keep non-inline section links unchanged.
- Keep badges/chips compact by default: small pill padding, small icons, and tight inter-chip spacing.
- When a roomier badge layout is explicitly requested, increase chip-group gap and slightly widen chip padding.
- Use `cv-*` semantic helper classes from `app/globals.css`; do not reintroduce legacy helper class prefixes.
- Keep `.cv-card` top and bottom padding removed by default (`pt-0 pb-0`).
- Keep `.cv-card` content unrounded unless explicitly requested otherwise.
- In section components, avoid Tailwind `!` modifiers; prefer semantic helper classes in `app/globals.css`.
- Keep footer metadata and the preference trigger on one row. Consolidate language, appearance, and sound controls in one compact, theme-aware popover with visible labels, grouped pressed states, and the card-standard `rounded-xl` radius.

## Interaction Sound
- Use quiet, synthesized interaction cues with no audio-file downloads.
- Play cues only after a visitor interacts with a link or control; never autoplay sound on page load.
- Keep a clearly labeled sound on/off choice in the preference popover and persist that choice locally.

## Spacing and Layout Rhythm
- Keep section spacing compact by default and use margin-based vertical rhythm.
- Use bottom spacing (`mb-*`) for section content rhythm; avoid `mt-*` for equivalent spacing.
- Apply per-section spacing through the shared `.cv-sections-stack` helper in `app/globals.css`, backed by `--cv-section-gap*` tokens.
- In-section item lists should use the shared `.cv-items-stack` helper (`--cv-item-gap*` tokens) for unified mobile-first spacing.
- Within a section component, keep one spacing strategy consistently instead of mixing equivalent patterns.
- On mobile (`< sm`), favor readable spacing and full-width content usage over dense packing.
- If overall mobile spacing needs to change, adjust shared page-shell/body gutters before per-section overrides.
- If overall CV top/bottom spacing needs to change, adjust the top-level shell in `components/sections/cv.tsx`.
- If mobile spacing changes involve the sticky header or footer, adjust `components/layout/cv-header.tsx` and `components/layout/cv-footer.tsx` directly.
- For timeline-style rows, stack on mobile and switch to two-column alignment from `md` upward.

## Page Surface
- Use the shared `PaperBackground` shader as the full-page surface on CV and secondary pages.
- Keep the shader static, decorative, pointer-transparent, theme-aware, and resolution-capped; page content must render above it on transparent main surfaces.
- Keep all page-content surfaces, cards, media frames, and footers transparent so the paper texture remains continuous across the site; reserve filled surfaces for temporary interactive overlays.
- Render content imagery through the shared `PaperTextureImage` filter while preserving a real image fallback and alt text; exclude tiny favicon-style UI iconography.
- Preserve a solid theme-matched fallback and omit the shader when printing.
