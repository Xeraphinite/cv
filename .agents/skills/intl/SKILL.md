---
name: intl
description: Internationalization and localization workflows for Next.js CV/resume repositories using next-intl and TOML-backed content. Use when adding or updating locales, translating messages, keeping locale file parity, fixing locale routing behavior, or validating localized rendering.
---

# Intl

## Overview

Implement and maintain i18n/l10n in Next.js App Router repositories that use locale-prefixed routing and localized message/content files. Keep translations, routing, and structured data aligned across locales without regressions.

## Workflow

1. Define scope.
- Determine whether the request changes routing/config (`middleware.ts`, locale config, layout/provider wiring), translation keys (`messages/*`), or structured localized data (`data/cv*.toml`).

2. Update locale config and routing.
- Keep locale source of truth in `lib/config/app-config.ts`.
- Ensure `NextIntlClientProvider` receives explicit `locale`.
- Preserve project locale prefix strategy (default locale unprefixed, non-default locales prefixed when using `as-needed`).
- Keep middleware locale behavior consistent with project policy.

3. Update translation files.
- Edit only required keys in `messages/<locale>.json`.
- Keep key structure identical across locales.
- Translate locale content instead of copying raw English when parity is expected.
- Preserve placeholders, Markdown, and punctuation semantics.

4. Update localized CV data.
- Keep canonical base content in `data/cv.toml`.
- Keep locale files (`data/cv.<locale>.toml`) as overrides only.
- Maintain record structure and list-item parity with the base locale.
- Preserve sorting conventions and locale-specific formatting.

5. Validate behavior.
- Run:
```bash
pnpm lint
pnpm build
```
- For UI-affecting i18n changes, run:
```bash
pnpm dev
```
- Verify locale routes for active locales and confirm there are no missing-translation fallbacks or hydration regressions.

## Project Defaults

- Treat `en`, `zh`, and `ja` as active locales.
- Keep `yue` and `ko` files for future re-enable unless explicitly asked to activate them.
- Keep CV pages under `app/(cv)/[locale]`.
- Keep accessibility pages under `app/(a11y)/[locale]/accessibility`.
- Keep locale `llms.txt` routes aligned with localized CV data.

## References

- Read `references/locale-parity-checklist.md` before broad locale updates or locale migrations.
