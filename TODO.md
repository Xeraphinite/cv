## ux

- [ ] mobile device experience:
  - [ ] optimize layout for smaller screens;
  - [ ] ensure touch-friendly interactions (e.g., click instead of hover);
  - [ ] hide non-essential details in mobile view;
- [ ] Hover experience:
  - [ ] add hover effects to URLs for better interactivity;
  - [ ] map hover support;
- [ ] consistancy:
  - [x] unify the date format across the CV (e.g., "Sep 2023 - Jun 2026" or "2023.9 - 2026.6");

## typography

- [ ] unify the font style, size, and spacing across the CV

## intl

- [ ] Update `zh-CN`, `ja-JP` translations and typograhpy;
- [ ] Add `zh-yue` and `ko-KR` translations;
- [ ] Add language detector.

## visual

- [ ] Add logo and favicon for visual identity;
- [ ] Update name by using personal, real name like [this](https://antfu.me/posts/animated-svg-logo);

## docs

- [ ] Update README.md with new project name, description, and usage instructions;
- [ ] Add documentation for contributing, customization, and deployment;
- [ ] Migrate Cloudflare deployment from `@cloudflare/next-on-pages` to OpenNext (`@opennextjs/cloudflare`) on Workers; use free `*.workers.dev` domain (or bind custom domain on Worker);
- [ ] Create a changelog to track updates and changes;

## content

- [ ] Update project content

## perf

- [ ] Optimize lighthouse perf.
- [ ] Setup Chrome DevTools, Lighthouse etc.

## code practices

- [ ] Split oversized `components/ui/map.tsx` (1497 LOC) into smaller modules (`map-root`, markers, clusters, controls) to reduce coupling and review risk.
- [ ] Remove `react-hooks/exhaustive-deps` suppressions in `components/ui/map.tsx` (11 occurrences) by stabilizing dependencies with refs/callbacks where needed.
- [ ] Replace unsafe cast in `components/ui/map.tsx` (`feature as unknown as GeoJSON.Feature<...>`) with type guards before invoking `onPointClick`.
- [ ] Remove duplicated hook implementations and keep a single source of truth in `hooks/`:
  - [ ] `hooks/use-mobile.tsx` vs `components/ui/use-mobile.tsx`
  - [ ] `hooks/use-toast.ts` vs `components/ui/use-toast.ts`
- [ ] Add a lightweight code-health check (script or lint rule) to prevent duplicate hook files and repeated lint suppressions from being reintroduced.

## misc

- [x] Remove `!` important flag in CSS.
- [ ] Email disconfusion?
