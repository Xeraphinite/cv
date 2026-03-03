# Locale Parity Checklist

Use this checklist when adding or updating translated content.

## 1) Locale keys and routing

- Confirm locale list in `lib/config/app-config.ts` matches intended active locales.
- Confirm `middleware.ts` and route groups resolve locale paths as expected.
- Confirm default locale prefix behavior matches repo policy.

## 2) Messages parity

- Ensure each locale file in `messages/` contains the same key tree.
- Keep placeholders (for example `{name}`) unchanged between locales.
- Keep ICU/pluralization patterns structurally equivalent.

Quick key scan:

```bash
rg --files messages
```

## 3) CV data parity

- Keep `data/cv.toml` as canonical structure.
- Ensure `data/cv.<locale>.toml` preserves section/item parity with base data.
- Translate locale-specific content; do not leave accidental untranslated placeholders.

## 4) Rendering checks

- Open each locale route and verify:
  - Section order is preserved.
  - Markdown renders correctly (links, spacing, punctuation).
  - Date and number formatting match locale expectations.
  - No missing-message warnings in console/server logs.

## 5) Verification commands

```bash
pnpm lint
pnpm build
```

If UI changed:

```bash
pnpm dev
```
