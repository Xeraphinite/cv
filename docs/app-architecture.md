# App Architecture

## Config And Routing
- `lib/config/app-config.ts` is the centralized source for locales, metadata labels, and CV data source settings.
- Always pass `locale` to `NextIntlClientProvider` in locale layouts.
- Active locales are `en`, `zh`, and `ja`; keep `yue` / `ko` files in the repo for future re-enable.
- Locale routing uses `as-needed` prefixing: `en` is unprefixed, non-default locales are prefixed, and middleware locale auto-detection redirect is disabled.
- Do not use client-side locale auto-switch prompts or browser-language detection.

## App Router / Runtime
- In `app/` routes, do not use `next/head`; use the Metadata API and/or native `<head>` in layouts.
- Keep CV pages under `app/(cv)/[locale]`.
- Keep accessibility pages under `app/(a11y)/[locale]/accessibility`.
- `app/globals.css` is the runtime global stylesheet source of truth; do not reintroduce `styles/globals.css`.
- Theme tokens consumed by Tailwind must be defined in `app/globals.css` for both light and dark modes.
- Load primary fonts with `next/font` in locale root layouts; do not use CSS `@import` for Google Fonts in `app/globals.css`.
- For SSR-rendered components, do not use render-time nondeterministic values such as `Math.random()` or `Date.now()`.

## Next.js / Cloudflare Constraints
- Cloudflare deploys in this repo target Cloudflare Pages via `@cloudflare/next-on-pages@1`.
- Keep Cloudflare Pages build/deploy scripts aligned with that adapter: `npx @cloudflare/next-on-pages@1` and `wrangler pages deploy .vercel/output/static`.
- For Cloudflare Pages builds, keep `/[locale]/accessibility` on Edge runtime in `app/(a11y)/[locale]/layout.tsx`.
- For Cloudflare Pages builds, non-static App Router route handlers, including `llms.txt`, must export `runtime = "edge"`.
- For Cloudflare Pages builds with `next-on-pages`, keep locale routing in root `middleware.ts`.

## Markdown / TOML Loading
- `components/ui/markdown-text.tsx` uses the MDX runtime (`@mdx-js/react` + `@mdx-js/mdx`); preserve current inline-link styling and paragraph spacing.
- Markdown math is enabled via `remark-math` + `rehype-katex`; support inline `$...$` and block `$$...$$` in TOML/Markdown content.
- Keep KaTeX sizing in Markdown aligned to body text (`.markdown-text-root .katex { font-size: 1em; }`).
- `MarkdownText` block paragraphs should default to `text-base`.
- Do not wrap `MarkdownText` content in an outer `<a>` when the markdown may already contain links.
- For `.md` and `.toml` raw imports in Next.js dev with Turbopack, keep `raw-loader` rules mapped with `as: "*.js"`.
- On Next.js 16 in this repo, keep those rules under top-level `turbopack.rules`.
- Keep `pnpm build` on `next build --webpack` while the repo still relies on custom webpack raw-source rules for `.md` / `.toml`.
- Keep route-sensitive public assets at the `public/` root (`icon.png`, `rss.xml`, `sitemap.xml`); group general assets under subfolders such as `public/images/*`, `public/files/*`, and `public/data/*`.
