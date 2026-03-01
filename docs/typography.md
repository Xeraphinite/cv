# Typography

The typography system combines `next/font`, Tailwind theme extensions, and semantic helper classes in `app/globals.css`.

## Primary Fonts

Loaded in `app/(cv)/[locale]/layout.tsx`:

- `Spectral`
- `IBM Plex Sans`

Additional CJK serif fonts are loaded through a Google Fonts stylesheet link for:

- `Noto Serif SC`
- `Noto Serif TC`
- `Noto Serif JP`
- `Noto Serif KR`

Code-like text uses `Maple Mono` via the Tailwind `mono` stack and global `code, pre, kbd, samp` styles.

## Tailwind Font Families

Defined in `tailwind.config.ts`:

- `sans`
- `serif`
- `mono`
- `zh-sans`
- `zh-serif`
- `zh-hant-sans`
- `zh-hant-serif`
- `ja-sans`
- `ja-serif`
- `ko-sans`
- `ko-serif`

The config also extends:

- `letterSpacing`
- `lineHeight`

for locale-sensitive typography tuning.

## Global Typography Classes

Shared helper classes live in `app/globals.css`.

### Font helpers

- `.font-en-sans`
- `.font-en-serif`
- `.font-zh-sans`
- `.font-zh-serif`
- `.font-zh-hant-sans`
- `.font-zh-hant-serif`
- `.font-ja-sans`
- `.font-ja-serif`
- `.font-ko-sans`
- `.font-ko-serif`

### Semantic text helpers

- `.paper-title`
- `.paper-subtitle`
- `.paper-body`
- `.paper-meta`
- `.paper-body-emphasis`

Locale variants exist for several of these, for example:

- `.paper-title.lang-ja`
- `.paper-body.lang-zh`
- `.paper-meta.lang-ko`

### Special-purpose helpers

- `.paper-ruby`
- `.paper-ruby-group`
- `.vertical-rl`
- `.vertical-lr`
- `.cjk-punctuation`
- `.text-justify-zh`
- `.text-justify-ja`
- `.text-justify-ko`
- `.emphasis-zh`
- `.emphasis-ja`
- `.emphasis-ko`

## Typography Components

`components/ui/typography.tsx` exports reusable helpers:

- `Typography`
- `Heading`
- `Text`
- `RubyText`
- `VerticalText`
- `Quote`
- `List`
- `ListItem`

These components consume locale-aware helpers from `lib/utils`, including:

- `getTypographyClasses`
- `getFontClass`
- `isCJKLocale`

## Current Usage Pattern

- English defaults to serif body text and sans metadata
- CJK locales get locale-specific font classes and punctuation helpers
- section titles stay at `text-2xl` in section components
- body and description text generally stay at `text-base`
- metadata should not drop below `text-sm`

## Ruby And Vertical Text

Japanese furigana support is implemented with real `<ruby>` and `<rt>` markup through `RubyText` and the `.paper-ruby` styles.

Vertical writing helpers exist, but they are utility-level support rather than the default CV layout mode.

## Inline Links

Markdown-rendered inline URLs use the project’s dashed underline treatment:

- dashed underline by default
- solid underline on hover or focus
- trailing external-link icon where appropriate

The relevant classes are:

- `.inline-url-link`
- `.inline-url-link-text`
- `.inline-url-link-icon`

## Editing Guidance

- Put reusable typography behavior in `app/globals.css`.
- Put new font-family tokens in `tailwind.config.ts`.
- Keep locale-specific font decisions explicit instead of relying on generic cross-locale serif fallbacks.
- Prefer the existing typography helpers over ad hoc per-component font stacks.
