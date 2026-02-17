# AGENTS.md

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
